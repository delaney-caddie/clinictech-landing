import { Composio } from "composio-core";
import { NextRequest, NextResponse } from "next/server";

function getComposio() {
  const apiKey = process.env.COMPOSIO_API_KEY;
  if (!apiKey) throw new Error("COMPOSIO_API_KEY not configured");
  return new Composio({ apiKey });
}

// GET: Check connection status + get auth URL
export async function GET(req: NextRequest) {
  try {
    const composio = getComposio();
    const entityId = "clinictech-danika";

    // Check if Gmail is already connected
    try {
      const entity = composio.getEntity(entityId);
      const connection = await entity.getConnection({ app: "gmail" });
      if (connection) {
        return NextResponse.json({ connected: true, entityId });
      }
    } catch {
      // Not connected
    }

    // Generate auth URL for connecting Gmail
    const entity = composio.getEntity(entityId);
    const connectionRequest = await entity.initiateConnection({
      appName: "gmail",
      config: { redirectUrl: `${req.nextUrl.origin}/admin` },
    });

    return NextResponse.json({
      connected: false,
      authUrl: connectionRequest.redirectUrl,
      connectionId: connectionRequest.connectedAccountId,
    });
  } catch (err: any) {
    console.error("Gmail status check error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST: Send email via connected Gmail
export async function POST(req: NextRequest) {
  try {
    const composio = getComposio();
    const { to, subject, body } = await req.json();

    if (!to || !subject || !body) {
      return NextResponse.json({ error: "to, subject, and body are required" }, { status: 400 });
    }

    const entityId = "clinictech-danika";
    const toolset = new (require("composio-core").ComposioToolSet)({
      apiKey: process.env.COMPOSIO_API_KEY,
      entityId,
    });

    // Execute Gmail send email action directly
    const result = await toolset.executeAction({
      action: "GMAIL_SEND_EMAIL",
      params: {
        recipient_email: to,
        subject,
        body,
      },
      entityId,
    });

    return NextResponse.json({ ok: true, result });
  } catch (err: any) {
    console.error("Gmail send error:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
