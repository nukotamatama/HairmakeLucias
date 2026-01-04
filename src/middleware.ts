import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const adminPath = process.env.NEXT_PUBLIC_ADMIN_PATH || "/admin";
    const skipAuth = process.env.SKIP_AUTH === "true";

    // 1. Dynamic Admin Path Handling
    if (pathname === adminPath || pathname === adminPath + "/") {
        // If Dev Bypass is on, always rewrite to dashboard
        if (skipAuth) {
            return NextResponse.rewrite(new URL("/admin/dashboard", request.url));
        }

        const session = await auth();
        if (session?.user) {
            return NextResponse.rewrite(new URL("/admin/dashboard", request.url));
        } else {
            return NextResponse.rewrite(new URL("/admin/login", request.url));
        }
    }

    // 2. Protect Internal Routes from Direct Access
    if (pathname.startsWith("/admin")) {
        // If Dev Bypass is on, we allow direct access (no redirect) to let standard routing handle it.
        if (skipAuth) {
            return NextResponse.next();
        }

        // Otherwise, redirect to the secret path
        return NextResponse.redirect(new URL(adminPath, request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/((?!api|_next/static|_next/image|favicon.ico).*)",
    ],
};
