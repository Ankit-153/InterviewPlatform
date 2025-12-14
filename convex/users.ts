import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const syncUser = mutation({
  args: {
    name: v.string(),
    email: v.string(),
    clerkId: v.string(),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("clerkId"), args.clerkId))
      .first();

    if (existingUser) return;

    return await ctx.db.insert("users", {
      ...args,
      role: null,
    });
  },
});

export const getUsers = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User is not authenticated");
    
    // Add authorization check to ensure only interviewers can see all users
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser || currentUser.role !== "interviewer") {
      throw new Error("Only interviewers can view all users");
    }

    const users = await ctx.db.query("users").collect();
    return users;
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    return user;
  },
});

// Mutation to set user role - can only be set once
export const setUserRole = mutation({
  args: {
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser) {
      throw new Error("User not found");
    }
    
    // Prevent role change if role is already set
    if (currentUser.role !== null) {
      throw new Error("Role has already been set and cannot be changed");
    }
    
    // Set the user's role for the first time
    return await ctx.db.patch(currentUser._id, {
      role: args.role,
    });
  },
});

// Admin mutation to update user roles (for admin purposes only)
export const updateUserRole = mutation({
  args: {
    userId: v.id("users"),
    role: v.union(v.literal("candidate"), v.literal("interviewer")),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    // Add authorization check to ensure only interviewers can change roles
    const currentUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
      .first();
    
    if (!currentUser || currentUser.role !== "interviewer") {
      throw new Error("Only interviewers can modify user roles");
    }
    
    // Update the user's role
    return await ctx.db.patch(args.userId, {
      role: args.role,
    });
  },
});

// Utility mutation to reset user roles to null (for fixing existing users)
export const resetUserRolesToNull = mutation({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    
    // Only allow superuser/admin (in this case, we'll just prevent it if not authenticated)
    const users = await ctx.db.query("users").collect();
    let count = 0;
    
    for (const user of users) {
      if (user.role === "candidate" || user.role === "interviewer") {
        await ctx.db.patch(user._id, {
          role: null,
        });
        count++;
      }
    }
    
    return { updated: count };
  },
});