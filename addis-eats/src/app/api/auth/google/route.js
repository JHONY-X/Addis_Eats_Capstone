import { NextResponse } from "next/server";
import { safeNextPath } from "@/lib/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const callbackUrl = new URL("/auth/callback", requestUrl.origin);
  callbackUrl.searchParams.set("next", next);

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: callbackUrl.toString() },
  });

  if (error || !data.url) {
    const signInUrl = new URL("/signin", requestUrl.origin);
    signInUrl.searchParams.set("oauthError", "1");
    signInUrl.searchParams.set("next", next);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.redirect(data.url);
}