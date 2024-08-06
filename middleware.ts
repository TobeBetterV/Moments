import { authMiddleware } from "@clerk/nextjs";
import { get } from "@vercel/edge-config";
import { type NextRequest, NextResponse } from "next/server";
import * as process from "process";

import { kvKeys } from "@/config/kv";
import countries from "@/lib/countries.json";
import { getIP } from "@/lib/ip";
import { redis } from "@/lib/redis";

export const config = {
  matcher: ["/((?!_next|public|.*\\..*).*)"],
};

async function beforeAuthMiddleware(req: NextRequest) {
  const { geo, nextUrl } = req;
  const isApi = nextUrl.pathname.startsWith("/api/");

  // if (process.env.VERCEL_ENV === "production") {
  //   const blockedIPs = await get<string[]>("blocked_ips");
  //   const ip = getIP(req);

  //   if (blockedIPs?.includes(ip)) {
  //     if (isApi) {
  //       return NextResponse.json(
  //         { error: "You have been blocked." },
  //         { status: 403 }
  //       );
  //     }

  //     nextUrl.pathname = "/blocked";
  //     return NextResponse.rewrite(nextUrl);
  //   }
  // }

  if (nextUrl.pathname === "/blocked") {
    nextUrl.pathname = "/";
    return NextResponse.redirect(nextUrl);
  }

  if (geo && !isApi && process.env.VERCEL_ENV === "production") {
    const country = geo.country;
    const city = geo.city;

    const countryInfo = countries.find((x) => x.cca2 === country);
    if (countryInfo) {
      const flag = countryInfo.flag;
      await redis.set(kvKeys.currentVisitor, { country, city, flag });
    }
  }

  return NextResponse.next();
}

export default authMiddleware({
  beforeAuth: beforeAuthMiddleware,
  publicRoutes: [
    "/",
    "/api(.*)",
    "/notes",
    "/reviews",
    "/public(.*)",
    "/rss",
    "/feed",
  ],
});
