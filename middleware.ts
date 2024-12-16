import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedRoute = createRouteMatcher([
    "/dashboard(.*)",
    "/products(.*)",
    "/transactions(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId, redirectToSignIn } = await auth();

    if (!userId && isProtectedRoute(req)) {
        // Add custom logic to run before redirecting

        return redirectToSignIn();
    }

    if (userId) {
        // If they're on the home page, redirect to dashboard
        if (req.nextUrl.pathname === "/") {
            const dashboard = new URL("/dashboard", req.url);
            return NextResponse.redirect(dashboard);
        }
    } else {
        // If they're not on a public route, redirect to sign-in
        if (!req.nextUrl.pathname.startsWith("/sign-in")) {
            const signIn = new URL("/sign-in", req.url);
            return NextResponse.redirect(signIn);
        }
    }
});

export const config = {
    matcher: [
        // Skip Next.js internals and all static files, unless found in search params
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
