import { createClient } from "@insforge/sdk";

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL;
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY;

// Defensive initialization to prevent client-side crashes if env vars are missing
if (!baseUrl || !anonKey) {
  if (typeof window !== "undefined") {
    console.error(
      "❌ InsForge Configuration Missing: NEXT_PUBLIC_INSFORGE_URL or NEXT_PUBLIC_INSFORGE_ANON_KEY is not defined. " +
      "Check your Vercel Environment Variables."
    );
  }
}

export const insforge = createClient({
  baseUrl: baseUrl || "https://placeholder.insforge.app",
  anonKey: anonKey || "missing-key",
});
