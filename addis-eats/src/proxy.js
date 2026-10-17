// src/proxy.js
import { NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

export async function proxy(request) {
  const { response, user } = await updateSession(request);

  if (!user) {
    const url = request.nextUrl.clone();
    const next = `${request.nextUrl.pathname}${request.nextUrl.search}`;
    url.pathname = "/signin";
    url.search = "";
    url.searchParams.set("next", next);

    const redirectResponse = NextResponse.redirect(url);
    response.cookies.getAll().forEach((cookie) => redirectResponse.cookies.set(cookie));
    for (const header of ["cache-control", "expires", "pragma"]) {
      const value = response.headers.get(header);
      if (value) redirectResponse.headers.set(header, value);
    }
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/checkout/:path*", "/orders/:path*", "/kitchen/:path*", "/dashboard/:path*"],
};
