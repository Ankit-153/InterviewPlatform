import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import toast from "react-hot-toast";

export interface AIReview {
  quality: string;
  codeQualityScore: number;
  bestPractices: string[];
  potentialBugs: string[];
  performanceIssues: string[];
  suggestions: string[];
  summary: string;
}

export const useAICodeReview = (codeSessionId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const saveAIReview = useMutation(api.interviews.saveAIReview);
  const existingReview = useQuery(
    api.interviews.getAIReviewByCodeSession,
    codeSessionId ? { codeSessionId: codeSessionId as Id<"codeSessions"> } : "skip"
  );

  const generateReview = async (
    code: string,
    language: string,
    interviewId: string
  ): Promise<AIReview | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/ai/review", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          language,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate review");
      }

      const data = await response.json();

      if (!data.success || !data.review) {
        throw new Error("Invalid response from AI service");
      }

      // Save the review to Convex
      if (codeSessionId) {
        await saveAIReview({
          codeSessionId: codeSessionId as Id<"codeSessions">,
          interviewId,
          code,
          language,
          review: data.review,
        });
      }

      toast.success("Code review generated successfully");
      return data.review;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate code review";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    generateReview,
    existingReview,
  };
};
