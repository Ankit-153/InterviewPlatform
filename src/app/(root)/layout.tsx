"use client";

import StreamClientProvider from "@/components/providers/StreamClientProvider";
import { useUserRole } from "@/hooks/useUserRole";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import LoaderUI from "@/components/LoaderUI";

function Layout({ children }: { children: React.ReactNode }) {
  const { hasRole, isLoading, isUserLoaded } = useUserRole();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Redirect to role selection once Clerk user is loaded and we know role is missing
    if (isUserLoaded && !isLoading && !hasRole && pathname !== "/select-role") {
      router.replace("/select-role");
    }
  }, [isUserLoaded, isLoading, hasRole, pathname, router]);

  // Show loader while checking role
  if (!isUserLoaded || isLoading) {
    return <LoaderUI />;
  }

  // Prevent rendering other pages if no role and not on select-role page
  if (!hasRole && pathname !== "/select-role") {
    return <LoaderUI />;
  }

  return <StreamClientProvider>{children}</StreamClientProvider>;
}
export default Layout;