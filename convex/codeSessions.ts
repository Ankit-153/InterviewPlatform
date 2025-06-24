    import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
    

// Initialize or get a code session
export const initializeCodeSession = mutation({
  args: {
    interviewId: v.string(),
    initialCode: v.string(),
    language: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check if session already exists
    const existingSession = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();

    if (existingSession) {
      return existingSession._id;
    }

    // Create new session
    return await ctx.db.insert("codeSessions", {
      interviewId: args.interviewId,
      code: args.initialCode,
      language: args.language,
      lastUpdatedBy: args.userId,
      lastUpdated: Date.now(),
    });
  },
});

// Update code in real-time
export const updateCode = mutation({
  args: {
    interviewId: v.string(),
    code: v.string(),
    language: v.optional(v.string()),
    cursorPosition: v.optional(v.object({
      lineNumber: v.number(),
      column: v.number()
    })),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
    
    if (!session) {
      throw new Error("Code session not found");
    }

    const updates: any = {
      code: args.code,
      lastUpdatedBy: args.userId,
      lastUpdated: Date.now(),
    };

    if (args.language) {
      updates.language = args.language;
    }

    if (args.cursorPosition) {
      updates.cursorPosition = args.cursorPosition;
    }

    return await ctx.db.patch(session._id, updates);
  },
});

// Get session by interview ID (real-time)
export const getCodeSessionByInterviewId = query({
  args: { interviewId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
  },
});

export const updateExecutionResult = mutation({
  args: {
    interviewId: v.string(),
    result: v.object({
      output: v.optional(v.any()),
      stdin: v.string(),
      error: v.optional(v.string()),
    }),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
    
    if (!session) {
      throw new Error("Code session not found");
    }

    return await ctx.db.patch(session._id, {
      executionResult: args.result,
      lastUpdatedBy: args.userId,
      lastUpdated: Date.now(),
    }); 
  },
});

export const updateSelectedQuestion = mutation({
  args: {
    interviewId: v.string(),
    questionId: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
    
    if (!session) {
      throw new Error("Code session not found");
    }

    return await ctx.db.patch(session._id, {
      questionId: args.questionId,
      lastUpdatedBy: args.userId,
      lastUpdated: Date.now(),
    });
  },
});


export const updateStdin = mutation({
  args: {
    interviewId: v.string(),
    stdin: v.string(),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
    
    if (!session) {
      throw new Error("Code session not found");
    }

    return await ctx.db.patch(session._id, {
      stdin: args.stdin,
      lastUpdatedBy: args.userId,
      lastUpdated: Date.now(),
    });
  },
});


export const updateCursorPosition = mutation({
  args: {
    interviewId: v.string(),
    position: v.object({
      lineNumber: v.number(),
      column: v.number(),
    }),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("codeSessions")
      .withIndex("by_interview_id", (q) => q.eq("interviewId", args.interviewId))
      .first();
    
    if (!session) throw new Error("Session not found");
    
    return await ctx.db.patch(session._id, {
      cursorPosition: args.position,
      lastUpdatedBy: args.userId,
    });
  },
});