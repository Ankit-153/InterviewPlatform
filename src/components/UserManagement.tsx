import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Doc } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/nextjs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Badge } from "./ui/badge";
import { toast } from "react-hot-toast";
import LoaderUI from "./LoaderUI";

export default function UserManagement() {
  const { user: currentUser } = useUser();
  const users = useQuery(api.users.getUsers);
  const updateUserRole = useMutation(api.users.updateUserRole);
  
  if (!users) return <LoaderUI />;
  
  const handleRoleChange = async (userId: string, newRole: "interviewer" | "candidate") => {
    try {
      await updateUserRole({
        userId,
        role: newRole,
      });
      toast.success("User role updated successfully");
    } catch (error) {
      toast.error("Failed to update user role");
      console.error(error);
    }
  };
  
  return (
    <div className="container max-w-4xl mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-2">
          Manage users and their roles in the platform
        </p>
      </div>
      
      <div className="grid gap-6">
        {users.map((user: Doc<"users">) => (
          <Card key={user._id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>
                      {user.name?.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <Badge variant={user.role === "interviewer" ? "default" : "outline"}>
                    {user.role}
                  </Badge>
                  
                  {/* Don't allow changing your own role */}
                  {user.clerkId !== currentUser?.id && (
                    <Select
                      defaultValue={user.role}
                      onValueChange={(value) => 
                        handleRoleChange(user._id, value as "interviewer" | "candidate")
                      }
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="candidate">Candidate</SelectItem>
                        <SelectItem value="interviewer">Interviewer</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}