import { createClient } from "@/lib/supabase/server";

export async function getSession() {
  const supabase = await createClient();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, role")
    .eq("id", user.id)
    .maybeSingle();

  return {
    id: user.id,
    name: profile?.full_name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Customer",
    email: user.email || "",
    role: profile?.role === "staff" ? "staff" : "customer",
  };
}
