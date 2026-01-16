import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  "/onboarding(.*)",
  "/organization(.*)",
  "/project(.*)",
  "/issue(.*)",
])

export default clerkMiddleware(async (auth, req) => {
  const {userId, sessionClaims, redirectToSignIn} = await auth();
  
  if(!userId && isProtectedRoute(req)){
    return redirectToSignIn();
  }
  
  const orgId = (sessionClaims?.o as { id?: string } | undefined)?.id;
  
  if(
    userId &&
    !orgId &&
    req.nextUrl.pathname !== '/onboarding' &&
    req.nextUrl.pathname !== "/"
  ){
    return NextResponse.redirect(new URL("/onboarding", req.url));
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};