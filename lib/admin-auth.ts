import { createHmac } from "crypto";

const ADMIN_TOKEN_PAYLOAD = "clinictech-admin-session-v1";

export function generateSessionToken(password: string): string {
  return createHmac("sha256", password)
    .update(ADMIN_TOKEN_PAYLOAD)
    .digest("hex");
}

export function isValidSession(cookieValue: string, password: string): boolean {
  const expected = generateSessionToken(password);
  if (cookieValue.length !== expected.length) return false;
  // Constant-time comparison
  let mismatch = 0;
  for (let i = 0; i < expected.length; i++) {
    mismatch |= cookieValue.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return mismatch === 0;
}
