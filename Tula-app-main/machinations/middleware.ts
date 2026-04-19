import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
    matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};

// export default authMiddleware({
//     // publicRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/api/liveblocks-auth", "/dashboard"],
//     // Routes that can be accessed while signed out
//     // publicRoutes: ['/anyone-can-visit-this-route'],
//     // // Routes that can always be accessed, and have
//     // // no authentication information
//     // ignoredRoutes: ["/((?!api|trpc))(_next.*|.+\.[\w]+$)", "/api/liveblocks-auth"],
//     // ignoredRoutes: ["/(.*)"],
// });

// export const config = {
//     // matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
//     matcher: ["/((?!_next|.*\\..*).*)"],
// };