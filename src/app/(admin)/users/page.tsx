"use client";

import { useUserRole } from "@/hooks/useUserRole";
import { useRouter } from "next/navigation";
import UserManagement from "@/components/UserManagement";
import LoaderUI from "@/components/LoaderUI";

export default function UsersPage() {
  const router = useRouter();
  const { isInterviewer, isLoading } = useUserRole();

  if (isLoading) return <LoaderUI />;
  
  // Only allow interviewers to access this page
  if (!isInterviewer) {
    router.push("/");
    return null;
  }

  return <UserManagement />;
}