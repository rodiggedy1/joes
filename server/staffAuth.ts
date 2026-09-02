import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { ENV } from "./_core/env";
import * as db from "./db";

const SCRYPT_N = 2 ** 15;
const SCRYPT_R = 8;
const SCRYPT_P = 3;
const KEY_LENGTH = 64;
const MAX_PASSWORD_LENGTH = 128;
const LOCK_AFTER_FAILURES = 5;
const LOCK_DURATION_MS = 15 * 60 * 1000;

export function normalizeStaffEmail(email: string) {
  return email.trim().toLowerCase();
}

export function isValidStaffPassword(password: string) {
  return password.length >= 15 && password.length <= MAX_PASSWORD_LENGTH;
}

async function deriveKey(password: string, salt: Buffer) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, KEY_LENGTH, {
      N: SCRYPT_N,
      r: SCRYPT_R,
      p: SCRYPT_P,
      maxmem: 256 * 1024 * 1024,
    }, (error, derivedKey) => error ? reject(error) : resolve(derivedKey));
  });
}

/** Passwords are one-way salted scrypt hashes; plaintext is never persisted. */
export async function hashStaffPassword(password: string) {
  if (!isValidStaffPassword(password)) throw new Error("Staff password does not meet minimum length requirements");
  const salt = randomBytes(16);
  const key = await deriveKey(password, salt);
  return ["scrypt", SCRYPT_N, SCRYPT_R, SCRYPT_P, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyStaffPassword(password: string, storedHash: string) {
  const [algorithm, n, r, p, encodedSalt, encodedKey] = storedHash.split("$");
  if (algorithm !== "scrypt" || !encodedSalt || !encodedKey || Number(n) !== SCRYPT_N || Number(r) !== SCRYPT_R || Number(p) !== SCRYPT_P) return false;
  try {
    const expected = Buffer.from(encodedKey, "base64url");
    const actual = await deriveKey(password, Buffer.from(encodedSalt, "base64url"));
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

type StaffAuthDependencies = {
  ensureInitialStaffAdmin: typeof db.ensureInitialStaffAdmin;
  findStaffCredentialByEmail: typeof db.findStaffCredentialByEmail;
  recordStaffLoginFailure: typeof db.recordStaffLoginFailure;
  resetStaffLoginFailures: typeof db.resetStaffLoginFailures;
  hashPassword: typeof hashStaffPassword;
  verifyPassword: typeof verifyStaffPassword;
  now: () => Date;
};

const runtimeDependencies: StaffAuthDependencies = {
  ensureInitialStaffAdmin: db.ensureInitialStaffAdmin,
  findStaffCredentialByEmail: db.findStaffCredentialByEmail,
  recordStaffLoginFailure: db.recordStaffLoginFailure,
  resetStaffLoginFailures: db.resetStaffLoginFailures,
  hashPassword: hashStaffPassword,
  verifyPassword: verifyStaffPassword,
  now: () => new Date(),
};

/**
 * Returns an approved staff user on success and null for every failed sign-in
 * state. This intentionally gives callers one generic response to avoid
 * revealing whether a staff email exists or is temporarily locked.
 */
export async function authenticateStaffWithPassword(
  input: { email: string; password: string },
  dependencies: StaffAuthDependencies = runtimeDependencies,
) {
  const email = normalizeStaffEmail(input.email);
  if (!email || !isValidStaffPassword(input.password)) return null;

  if (ENV.staffAdminEmail && ENV.staffAdminPassword) {
    await dependencies.ensureInitialStaffAdmin({
      email: ENV.staffAdminEmail,
      passwordHash: await dependencies.hashPassword(ENV.staffAdminPassword),
    });
  }

  const record = await dependencies.findStaffCredentialByEmail(email);
  if (!record) {
    // Do equivalent work for an unknown email, reducing account-enumeration timing signals.
    await dependencies.hashPassword(input.password);
    return null;
  }

  const now = dependencies.now();
  if (record.credential.lockedUntil && record.credential.lockedUntil > now) {
    await dependencies.hashPassword(input.password);
    return null;
  }

  const passwordMatches = await dependencies.verifyPassword(input.password, record.credential.passwordHash);
  if (!passwordMatches || record.user.role !== "admin") {
    const failedCount = record.credential.failedLoginCount + 1;
    await dependencies.recordStaffLoginFailure(record.credential.id, failedCount >= LOCK_AFTER_FAILURES ? new Date(now.getTime() + LOCK_DURATION_MS) : null, failedCount);
    return null;
  }

  await dependencies.resetStaffLoginFailures(record.credential.id);
  return record.user;
}
