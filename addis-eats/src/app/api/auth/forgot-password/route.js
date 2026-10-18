import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  const email = body?.email?.trim();
  if (!email) return Response.json({ error: "Email is required." }, { status: 400 });
  const requestUrl = new URL(request.url);
  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${requestUrl.origin}/auth/callback?next=/update-password` });
  if (error) {
    console.error("Password reset email error:", error);
    return Response.json({
      error: "We could not send the reset email. Please try again.",
      details: process.env.NODE_ENV === "development" ? error.message : undefined,
    }, { status: 500 });
  }
  return Response.json({ ok: true });
}
