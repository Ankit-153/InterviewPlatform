"use client";

import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import toast from "react-hot-toast";

export default function CleanupPage() {
  const [isRunning, setIsRunning] = useState(false);
  const resetRoles = useMutation(api.users.resetUserRolesToNull);

  const handleReset = async () => {
    setIsRunning(true);
    try {
      const result = await resetRoles();
      toast.success(`Reset ${result.updated} users to null role`);
    } catch (error) {
      console.error("Error resetting roles:", error);
      toast.error("Failed to reset roles");
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle>Database Cleanup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will reset all existing user roles to null, forcing them to select a role on next login.
              This is a one-time operation to fix the role selection flow.
            </p>
            <Button 
              onClick={handleReset} 
              disabled={isRunning}
              variant="destructive"
            >
              {isRunning ? "Resetting..." : "Reset All User Roles to Null"}
            </Button>
            <p className="text-xs text-muted-foreground">
              ⚠️ Use this only once to migrate existing data. After running, all users will need to re-select their role.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
