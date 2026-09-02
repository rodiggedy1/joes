import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { User } from "../../drizzle/schema";
import { STAFF_COOKIE_NAME } from "@shared/const";
import { sdk } from "./sdk";

export type TrpcContext = {
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
  user: User | null;
  staffUser?: User | null;
};

export async function createContext(
  opts: CreateExpressContextOptions
): Promise<TrpcContext> {
  let user: User | null = null;
  let staffUser: User | null = null;

  try {
    user = await sdk.authenticateRequest(opts.req);
  } catch (error) {
    // Authentication is optional for public procedures.
    user = null;
  }
  if (opts.req.headers.cookie?.includes(`${STAFF_COOKIE_NAME}=`)) {
    try {
      staffUser = await sdk.authenticateRequest(opts.req, { cookieName: STAFF_COOKIE_NAME, allowBearer: false });
    } catch (error) {
      staffUser = null;
    }
  }

  return {
    req: opts.req,
    res: opts.res,
    user,
    staffUser,
  };
}
