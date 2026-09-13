import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { checkSession } from "@/lib/api/serverApi";

const privateRoutes = ["/profile", "/notes"];
const publicRoutes = ["/sign-in", "/sign-up"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();

  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route),
  );

  let isAuthenticated = Boolean(accessToken);
  let refreshedCookies: string[] = [];

  if (!isAuthenticated && refreshToken) {
    const res = await checkSession();
    isAuthenticated = Boolean(res.data.success);

    const setCookie = res.headers["set-cookie"];
    if (setCookie) {
      refreshedCookies = Array.isArray(setCookie) ? setCookie : [setCookie];
    }
  }

  function withRefreshedCookies(response: NextResponse) {
    for (const cookieStr of refreshedCookies) {
      const parsed = parseSetCookie(cookieStr);
      if (parsed.value) {
        response.cookies.set(parsed.name, parsed.value, parsed);
      }
    }
    return response;
  }

  if (!isAuthenticated && isPrivateRoute) {
    return withRefreshedCookies(
      NextResponse.redirect(new URL("/sign-in", request.url)),
    );
  }

  if (isAuthenticated && isPublicRoute) {
    return withRefreshedCookies(
      NextResponse.redirect(new URL("/", request.url)),
    );
  }

  return withRefreshedCookies(NextResponse.next());
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
