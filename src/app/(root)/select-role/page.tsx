"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useUserRole } from "@/hooks/useUserRole";
import toast from "react-hot-toast";
import { UserCheck, Users } from "lucide-react";
import LoaderUI from "@/components/LoaderUI";

export default function SelectRolePage() {
  const [selectedRole, setSelectedRole] = useState<"interviewer" | "candidate" | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUserRole = useMutation(api.users.setUserRole);
  const router = useRouter();
  const { hasRole, isLoading } = useUserRole();

  // Redirect if user already has a role
  if (!isLoading && hasRole) {
    router.replace("/");
    return null;
  }

  const handleRoleSelection = async () => {
    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsSubmitting(true);
    try {
      await setUserRole({ role: selectedRole });
      toast.success(`Role set to ${selectedRole} successfully!`);
      router.replace("/");
    } catch (error) {
      console.error("Error setting role:", error);
      toast.error("Failed to set role. Please try again.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoaderUI />;
  }

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-80px)] p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">Choose Your Role</h1>
          <p className="text-muted-foreground">
            Select your role to get started. This choice is permanent and cannot be changed later.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Interviewer Card */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === "interviewer"
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("interviewer")}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-3 rounded-full ${
                  selectedRole === "interviewer" ? "bg-primary" : "bg-muted"
                }`}>
                  <Users className={`w-6 h-6 ${
                    selectedRole === "interviewer" ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </div>
              </div>
              <CardTitle className="text-2xl">Interviewer</CardTitle>
              <CardDescription>Conduct interviews and evaluate candidates</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Schedule and manage interviews</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Collaborate with other interviewers</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Provide feedback and ratings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Access all user management features</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Candidate Card */}
          <Card
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedRole === "candidate"
                ? "ring-2 ring-primary border-primary"
                : "hover:border-primary/50"
            }`}
            onClick={() => setSelectedRole("candidate")}
          >
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-3 rounded-full ${
                  selectedRole === "candidate" ? "bg-primary" : "bg-muted"
                }`}>
                  <UserCheck className={`w-6 h-6 ${
                    selectedRole === "candidate" ? "text-primary-foreground" : "text-muted-foreground"
                  }`} />
                </div>
              </div>
              <CardTitle className="text-2xl">Candidate</CardTitle>
              <CardDescription>Participate in interviews and showcase your skills</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Join scheduled interviews</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Solve coding challenges</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>View interview recordings</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Receive feedback from interviewers</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 text-center">
          <Button
            onClick={handleRoleSelection}
            disabled={!selectedRole || isSubmitting}
            size="lg"
            className="px-8"
          >
            {isSubmitting ? "Setting Role..." : "Continue"}
          </Button>
          <p className="mt-4 text-sm text-muted-foreground">
            ⚠️ Warning: Once you select a role, it cannot be changed.
          </p>
        </div>
      </div>
    </div>
  );
}
