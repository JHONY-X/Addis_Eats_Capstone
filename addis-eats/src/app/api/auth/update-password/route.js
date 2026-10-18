import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try { body = await request.json(); } catch { return Response.json({ error: "Request body must be valid JSON." }, { status: 400 }); }
  const password = body?.password;
  if (typeof password !== "string" || password.length < 8) return Response.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return Response.json({ error: "Could not update your password. Please request a new link." }, { status: 400 });
  return Response.json({ ok: true });
}
