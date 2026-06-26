"use client";

// import { ClerkProvider, useAuth } from "@clerk/nextjs";
// import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { Loading } from "@/components/loading";
import { ClerkProvider, SignInButton } from "@clerk/clerk-react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
// import { AuthLoading, Authenticated, ConvexReactClient } from "convex/react";
import { useAuth } from "@clerk/clerk-react"; // 
import { ConvexReactClient } from "convex/react";
import { Authenticated, Unauthenticated, AuthLoading } from "convex/react";

interface ConvexClientProviderProps {
  children: React.ReactNode;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL!;

const convex = new ConvexReactClient(convexUrl);

export const ConvexClientProvider = ({
  children,
}: ConvexClientProviderProps) => {
  return (
    <ClerkProvider publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY!}>
      <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
        <Authenticated>{children}</Authenticated>
        <AuthLoading><Loading/></AuthLoading>
        <Unauthenticated>
        <div>
          <SignInButton />
        </div>
      </Unauthenticated>
      </ConvexProviderWithClerk>
    </ClerkProvider>

    // <ConvexProviderWithClerk useAuth={useAuth} client={convex}>
    //   <Authenticated>{children}</Authenticated>
    //   <Unauthenticated>
    //     <div>Please sign in</div>
    //   </Unauthenticated>
    //   <AuthLoading>
    //     <Loading />
    //   </AuthLoading>
    // </ConvexProviderWithClerk>
  );
};
