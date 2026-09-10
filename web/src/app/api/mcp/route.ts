export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp-logic";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const WELL_KNOWN_URL = `${BASE_URL}/.well-known/oauth-protected-resource`;

function getBaseUrl(req: NextRequest): string {
  const host = req.headers.get("host") ?? "";
  const proto = req.headers.get("x-forwarded-proto") ?? "http";
  return host ? `${proto}://${host}` : BASE_URL;
}

// ─── GET — health check atau SSE handshake ──────────────────────────

export async function GET(req: NextRequest) {
  const accept = req.headers.get("accept") ?? "";
  const base = getBaseUrl(req);

  // SSE / Streamable HTTP handshake
  if (accept.includes("text/event-stream")) {
    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
        Link: `<${base}/.well-known/oauth-protected-resource>; rel="oauth-protected-resource"`,
      },
    });
  }

  // Browser health check
  return new NextResponse("MCP Inggris Server (Stateless) is active. Ready for connections.", {
    headers: {
      "Content-Type": "text/plain",
      Link: `<${WELL_KNOWN_URL}>; rel="oauth-protected-resource"`,
    },
  });
}

// ─── POST — JSON-RPC MCP requests ───────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless — required for serverless API routes
    });

    await server.connect(transport);

    const response = await transport.handleRequest(req);

    // Pastikan streaming-friendly headers terpasang
    const headers = new Headers(response.headers);
    headers.set("X-Accel-Buffering", "no");
    headers.set("Cache-Control", "no-cache");

    return new NextResponse(response.body, {
      status: response.status,
      headers,
    });
  } catch (error: unknown) {
    console.error("[MCP] POST error:", error);
    const msg = error instanceof Error ? error.message : "Internal Server Error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
