import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    return Response.json({ error: "Could not sign out." }, { status: 500 });
  }

  return Response.json({ message: "Signed out." }, { status: 200 });
}
