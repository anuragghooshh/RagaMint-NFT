import { NextResponse } from "next/server";

export default function middleware(req) {
  const { cookies } = req;
  const tokenCookie = cookies.get("token");
  const url = req.nextUrl.clone();

  const publicPaths = ["/login"];

  const isPublicPath = publicPaths.some((path) =>
    url.pathname.startsWith(path)
  );

  if (!isPublicPath && !tokenCookie) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  if (isPublicPath && tokenCookie) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/login"],
};
