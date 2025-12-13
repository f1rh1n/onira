import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";

const JWT_SECRET = process.env.NEXTAUTH_SECRET || "your-secret-key";

export interface JWTUser {
  id: string;
  email: string;
  username: string;
}

/**
 * Verify JWT token from Authorization header
 * Used for mobile app authentication
 */
export function verifyJWT(request: NextRequest): JWTUser | null {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    const decoded = jwt.verify(token, JWT_SECRET) as JWTUser;

    return decoded;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

/**
 * Get user from JWT or NextAuth session
 * Works for both mobile (JWT) and web (NextAuth) requests
 */
export async function getUser(request: NextRequest): Promise<JWTUser | null> {
  // First try JWT token (for mobile)
  const jwtUser = verifyJWT(request);
  if (jwtUser) {
    return jwtUser;
  }

  // For web requests, they'll continue using NextAuth
  // This function prioritizes JWT for mobile compatibility
  return null;
}
