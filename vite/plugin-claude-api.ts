import type { IncomingMessage } from "node:http";
import type { Plugin } from "vite";

function readBody(req: IncomingMessage): Promise<string> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

type AnthropicMessage = { role: "user" | "assistant"; content: string };

type AnthropicResponse = {
  content?: { type: string; text?: string }[];
  error?: { message?: string; type?: string };
};

/**
 * Dev-only: proxies Claude Messages API so CLAUDE_API_KEY never ships to the browser.
 * Production static sites need a separate serverless route; see .env.example.
 */
export function claudeDevApiPlugin(apiKey: string | undefined, defaultModel: string): Plugin {
  return {
    name: "claude-dev-api",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathOnly = req.url?.split("?")[0] ?? "";

        if (pathOnly === "/api/claude/health" && req.method === "GET") {
          res.setHeader("Content-Type", "application/json");
          res.end(JSON.stringify({ ok: Boolean(apiKey) }));
          return;
        }

        if (pathOnly === "/api/claude" && req.method === "POST") {
          if (!apiKey) {
            res.statusCode = 503;
            res.setHeader("Content-Type", "application/json");
            res.end(
              JSON.stringify({
                error:
                  "CLAUDE_API_KEY is not set. Add it to .env.local (never commit).",
              }),
            );
            return;
          }

          try {
            const raw = await readBody(req);
            if (raw.length > 512_000) {
              res.statusCode = 413;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Request body too large" }));
              return;
            }

            const body = JSON.parse(raw) as {
              system?: string;
              messages?: { role: string; content: string }[];
              model?: string;
            };

            const system = typeof body.system === "string" ? body.system : "";
            const model = typeof body.model === "string" && body.model.trim() ? body.model.trim() : defaultModel;
            const rawMsgs = Array.isArray(body.messages) ? body.messages : [];
            const messages: AnthropicMessage[] = rawMsgs
              .filter((m) => m.role === "user" || m.role === "assistant")
              .map((m) => ({ role: m.role as "user" | "assistant", content: String(m.content ?? "") }));

            const anthropicRes = await fetch("https://api.anthropic.com/v1/messages", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-api-key": apiKey,
                "anthropic-version": "2023-06-01",
              },
              body: JSON.stringify({
                model,
                max_tokens: 8192,
                system,
                messages,
                temperature: 0.35,
              }),
            });

            const data = (await anthropicRes.json().catch(() => ({}))) as AnthropicResponse;

            if (!anthropicRes.ok) {
              res.statusCode = anthropicRes.status;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: data.error?.message || anthropicRes.statusText || "Anthropic request failed",
                }),
              );
              return;
            }

            const text =
              data.content?.find((b) => b.type === "text")?.text ??
              data.content?.map((b) => (b.type === "text" ? b.text : "")).join("") ??
              "";

            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ content: text }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: e instanceof Error ? e.message : "Server error" }));
          }
          return;
        }

        next();
      });
    },
  };
}
