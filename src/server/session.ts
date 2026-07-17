import "server-only";

import { cookies } from "next/headers";
import { SignJWT, jwtVerify, type JWTPayload } from "jose";

const SESSION_COOKIE = "pns_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8;

type SessionPayload = JWTPayload & {
  userId: string;
};

function getSessionKey() {
  const secret = process.env.SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("SESSION_SECRET must contain at least 32 characters.");
  }

  return new TextEncoder().encode(secret);
}

export async function encryptSession(userId: string) {
  return new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSessionKey());
}

export async function decryptSession(token?: string) {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify<SessionPayload>(token, getSessionKey(), {
      algorithms: ["HS256"],
    });

    return typeof payload.userId === "string" ? payload : null;
  } catch {
    return null;
  }
}

export async function createSession(
  userId: string,
  options: { persistent?: boolean } = {},
) {
  const cookieStore = await cookies();
  const expires = new Date(Date.now() + SESSION_DURATION_SECONDS * 1000);

  cookieStore.set(SESSION_COOKIE, await encryptSession(userId), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    ...(options.persistent ? { expires } : {}),
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE);
}

export async function getSessionPayload() {
  const cookieStore = await cookies();
  return decryptSession(cookieStore.get(SESSION_COOKIE)?.value);
}
