export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { createMcpServer } from "@/lib/mcp-logic";

// Buat instance server dan transport per request (karena stateless/serverless)
async function handleMcpRequest(req: NextRequest) {
  try {
    const server = createMcpServer();
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode untuk Vercel
    });

    await server.connect(transport);
    
    // Biarkan SDK yang menangani baik request GET (SSE Handshake) maupun POST (Message)
    return await transport.handleRequest(req);
    
  } catch (error: any) {
    console.error("[MCP] Request error:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}

// Gunakan handler yang sama untuk GET dan POST
export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
