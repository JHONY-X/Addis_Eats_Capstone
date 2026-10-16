import { NextResponse } from "next/server";
import { safeNextPath } from "@/lib/safe-next-path";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const next = safeNextPath(requestUrl.searchParams.get("next"));
  const code = requestUrl.searchParams.get("code");

  if (!code) {
    const signInUrl = new URL("/signin", requestUrl.origin);
    signInUrl.searchParams.set("oauthError", "1");
    signInUrl.searchParams.set("next", next);
    return NextResponse.redirect(signInUrl);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const signInUrl = new URL("/signin", requestUrl.origin);
    signInUrl.searchParams.set("oauthError", "1");
    signInUrl.searchParams.set("next", next);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.redirect(new URL(next, requestUrl.origin));
}