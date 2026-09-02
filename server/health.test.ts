import { describe, expect, it, vi } from "vitest";

const getDb = vi.hoisted(() => vi.fn());
vi.mock("./db", () => ({ getDb }));

import { isDatabaseHealthy } from "./health";

describe("isDatabaseHealthy", () => {
  it("reports ready only after the database accepts a lightweight query", async () => {
    const execute = vi.fn().mockResolvedValue([{ 1: 1 }]);
    getDb.mockResolvedValue({ execute });

    await expect(isDatabaseHealthy()).resolves.toBe(true);
    expect(execute).toHaveBeenCalledTimes(1);
  });

  it("reports not ready when no database is configured or the query fails", async () => {
    getDb.mockResolvedValueOnce(undefined).mockResolvedValueOnce({ execute: vi.fn().mockRejectedValue(new Error("offline")) });

    await expect(isDatabaseHealthy()).resolves.toBe(false);
    await expect(isDatabaseHealthy()).resolves.toBe(false);
  });
});
