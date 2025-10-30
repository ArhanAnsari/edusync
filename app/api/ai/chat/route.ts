import { NextRequest } from "next/server";
import { chatWithAssistant } from "@/lib/ai";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { messages, context } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Messages array is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const stream = await chatWithAssistant(messages, context);

    // ✅ 1st: Proper Vercel AI SDK format
    if (stream && typeof (stream as any).toTextStreamResponse === "function") {
      return (stream as any).toTextStreamResponse();
    }

    // ✅ 2nd: Raw readable stream fallback
    if (stream && (stream as any).stream) {
      return new Response((stream as any).stream, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }

    // ✅ 3rd: Raw body fallback
    if (stream && (stream as any).body) {
      return new Response((stream as any).body, {
        headers: { "Content-Type": "text/event-stream" },
      });
    }

    // ❌ Invalid case
    console.error("[AI Route] Unsupported AI response shape", stream);
    return new Response(
      JSON.stringify({ error: "Invalid AI streaming response shape" }),
      { status: 502, headers: { "Content-Type": "application/json" } }
    );
  } catch (error: any) {
    console.error("AI Chat Route Error:", error);
    const msg = error?.message || "Unknown error";
    let status = 500;
    let userError = "AI service error. Please try again.";

    if (msg.includes("API key") || msg.includes("401")) {
      status = 503;
      userError = "AI authentication failed.";
    } else if (msg.includes("429")) {
      status = 429;
      userError = "AI rate limited. Try again later.";
    } else if (msg.includes("timeout")) {
      status = 504;
      userError = "AI response timeout. Try again.";
    } else if (msg.includes("safety")) {
      status = 400;
      userError = "Blocked by AI safety filters.";
    } else if (msg.includes("model")) {
      status = 503;
      userError = "AI model temporarily unavailable.";
    } else if (msg.includes("budget")) {
      status = 413;
      userError = "Request too complex. Simplify it.";
    }

    return new Response(
      JSON.stringify({ error: userError, details: msg }),
      { status, headers: { "Content-Type": "application/json" } }
    );
  }
}
