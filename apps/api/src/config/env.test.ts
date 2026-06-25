import { describe, it, expect, vi, beforeEach } from "vitest";
import { Env } from "./env.js";

describe("env validation", () => {
  let originalEnv: NodeJS.ProcessEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    // Clear out mocked environment variables so we can test failure cleanly
    delete process.env.DATABASE_URL;
    delete process.env.JWT_SECRET;
    delete process.env.STELLAR_RPC_URL;
    delete process.env.STELLAR_HORIZON_URL;
    delete process.env.STELLAR_NETWORK_PASSPHRASE;
    delete process.env.TARIFF_SHIELD_CONTRACT_ID;
    delete process.env.PLATFORM_STELLAR_SECRET;
    delete process.env.SURETY_STELLAR_SECRET;
  });

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("fails validation and lists missing/invalid variables if required ones are absent", () => {
    const result = Env.safeParse(process.env);
    expect(result.success).toBe(false);

    if (!result.success) {
      const errorPaths = result.error.issues.map((i) => i.path[0]);
      expect(errorPaths).toContain("DATABASE_URL");
      expect(errorPaths).toContain("JWT_SECRET");
      expect(errorPaths).toContain("STELLAR_RPC_URL");
      expect(errorPaths).toContain("STELLAR_HORIZON_URL");
      expect(errorPaths).toContain("STELLAR_NETWORK_PASSPHRASE");
      expect(errorPaths).toContain("TARIFF_SHIELD_CONTRACT_ID");
      expect(errorPaths).toContain("PLATFORM_STELLAR_SECRET");
      expect(errorPaths).toContain("SURETY_STELLAR_SECRET");
    }
  });

  it("passes validation if all required variables are present", () => {
    process.env.DATABASE_URL = "postgres://localhost:5432/db";
    process.env.JWT_SECRET = "01234567890123456789012345678912";
    process.env.STELLAR_RPC_URL = "http://localhost:8000";
    process.env.STELLAR_HORIZON_URL = "http://localhost:8000";
    process.env.STELLAR_NETWORK_PASSPHRASE = "Test SDF Network ; September 2015";
    process.env.TARIFF_SHIELD_CONTRACT_ID = "CBLASRVG7NRAFP2CDPVSF4WTJBKC6L4FKT2XHR3OH7CLICUBPVQ4PBBF";
    process.env.PLATFORM_STELLAR_SECRET = "SDQVD3H2CMMD6A35KCQJ2I42YZB5N5UHRVROIF4ZTRV57Z6C3YNT7N6P";
    process.env.SURETY_STELLAR_SECRET = "SDQVD3H2CMMD6A35KCQJ2I42YZB5N5UHRVROIF4ZTRV57Z6C3YNT7N6P";
    
    const result = Env.safeParse(process.env);
    expect(result.success).toBe(true);
  });
});
