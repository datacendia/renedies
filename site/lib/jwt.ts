import { SignJWT, jwtVerify } from "jose";
import type { Tier } from "./tier";

const SECRET = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("JWT_SECRET environment variable is required in production");
    }
    // Development fallback - intentionally weak, never use in production
    console.warn("⚠️  Using weak JWT secret for development only. Set JWT_SECRET in production.");
    return new TextEncoder().encode("dev-only-secret-change-me-in-production");
  }
  return new TextEncoder().encode(secret);
};

export interface UnlockPayload {
  email: string;
  tier: Tier;
  orderId?: string;
}

export async function signUnlockToken(payload: UnlockPayload, expiresIn = "14d"): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer("remedia")
    .setAudience("remedia-unlock")
    .setExpirationTime(expiresIn)
    .sign(SECRET());
}

export async function verifyUnlockToken(token: string): Promise<UnlockPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET(), {
      issuer: "remedia",
      audience: "remedia-unlock"
    });
    return {
      email: String(payload.email),
      tier: payload.tier as Tier,
      orderId: payload.orderId ? String(payload.orderId) : undefined
    };
  } catch {
    return null;
  }
}
