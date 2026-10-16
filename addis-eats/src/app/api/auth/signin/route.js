import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Request body must be valid JSON." }, { status: 400 });
  }

  const { email, password } = body || {};

  if (!email || !password) {
    return Response.json({ error: "Email and password are required." }, { status: 400 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error || !data.user) {
    return Response.json({ error: "Invalid email or password." }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", data.user.id)
    .maybeSingle();

  return Response.json({
    user: {
      id: data.user.id,
      name: profile?.full_name || data.user.user_metadata?.full_name || email.split("@")[0],
      role: profile?.role === "staff" ? "staff" : "customer",
    },
  }, { status: 200 });
}
