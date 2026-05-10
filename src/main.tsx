import { createRoot } from "react-dom/client";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

function showMissingSupabaseEnv(): void {
  const el = document.getElementById("root");
  if (!el) return;
  el.innerHTML = `
    <div style="min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem;font-family:ui-sans-serif,system-ui,sans-serif;background:#07090b;color:#f8fafd;">
      <div style="max-width:28rem;line-height:1.6;font-size:0.95rem;">
        <p style="margin:0 0 0.5rem;font-weight:600;font-size:1.1rem;">Configuration missing</p>
        <p style="margin:0 0 1rem;opacity:0.88;">This build needs <code style="background:#1a1f26;padding:0.12rem 0.4rem;border-radius:6px;font-size:0.85em;">VITE_SUPABASE_URL</code> and <code style="background:#1a1f26;padding:0.12rem 0.4rem;border-radius:6px;font-size:0.85em;">VITE_SUPABASE_PUBLISHABLE_KEY</code> at build time.</p>
        <p style="margin:0;opacity:0.75;font-size:0.88rem;"><strong>GitHub Pages:</strong> add both as repository <strong>Variables</strong> (Settings → Secrets and variables → Actions → Variables), then push or re-run the workflow.<br /><br /><strong>Local:</strong> copy <code style="background:#1a1f26;padding:0.12rem 0.4rem;border-radius:6px;font-size:0.85em;">.env.example</code> to <code style="background:#1a1f26;padding:0.12rem 0.4rem;border-radius:6px;font-size:0.85em;">.env</code> and set values from the Supabase dashboard (anon key only).</p>
      </div>
    </div>
  `;
}

const hasSupabase =
  typeof supabaseUrl === "string" &&
  supabaseUrl.trim().length > 0 &&
  typeof supabaseAnonKey === "string" &&
  supabaseAnonKey.trim().length > 0;

if (!hasSupabase) {
  showMissingSupabaseEnv();
} else {
  void Promise.all([import("./App.tsx"), import("./index.css")]).then(([{ default: App }]) => {
    const root = document.getElementById("root");
    if (!root) return;
    createRoot(root).render(<App />);
  });
}
