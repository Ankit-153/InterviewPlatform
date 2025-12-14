import { useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export const useUserRole = () => {
  const { user, isLoaded: isUserLoaded } = useUser();

  // Only run the query once the Clerk user is fully loaded
  const shouldFetch = isUserLoaded && !!user?.id;

  const userData = useQuery(
    api.users.getUserByClerkId,
    shouldFetch
      ? {
          clerkId: user!.id,
        }
      : "skip"
  );

  const isLoading = !isUserLoaded || userData === undefined;

  return {
    isLoading,
    isUserLoaded,
    hasRole: userData?.role !== null && userData?.role !== undefined,
    role: userData?.role,
    isInterviewer: userData?.role === "interviewer",
    isCandidate: userData?.role === "candidate",
  };
};

// to check if user is candidate or interviewer