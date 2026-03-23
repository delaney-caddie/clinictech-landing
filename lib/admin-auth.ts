// Server-side auth (Node.js runtime — API routes)
import { createHmac } from "crypto";

const ADMIN_TOKEN_PAYLOAD = "clinictech-admin-session-v1";

export function generateSessionToken(password: string): string {
  return createHmac("sha256", password)
    .update(ADMIN_TOKEN_PAYLOAD)
    .digest("hex");
}
