import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    image: v.optional(v.string()),
    role: v.union(v.literal("candidate"), v.literal("interviewer"), v.null()),
    clerkId: v.string(),
  }).index("by_clerk_id", ["clerkId"]),

  interviews: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    endTime: v.optional(v.number()),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  })
    .index("by_candidate_id", ["candidateId"])
    .index("by_stream_call_id", ["streamCallId"]),

  comments: defineTable({
    content: v.string(),
    rating: v.number(),
    interviewerId: v.string(),
    interviewId: v.id("interviews"),
  }).index("by_interview_id", ["interviewId"]),

 codeSessions: defineTable({
  interviewId: v.string(),
  code: v.string(),
  language: v.string(),
  questionId: v.optional(v.string()),  // Add this for question sync
  stdin: v.optional(v.string()),       // Add this for stdin sync
  executionResult: v.optional(v.object({
    output: v.optional(v.any()),
    stdin: v.string(),
    error: v.optional(v.string()),
  })),
  cursorPosition: v.optional(v.object({
    lineNumber: v.number(),
    column: v.number()
  })),
  lastUpdatedBy: v.string(),
  lastUpdated: v.number(),
})
.index("by_interview_id", ["interviewId"])
});

// https://romantic-escargot-62.clerk.accounts.dev