"use client";

import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { AlertCircle, CheckCircle, AlertTriangle, Lightbulb } from "lucide-react";
import { AIReview } from "@/hooks/useAICodeReview";

interface AIReviewDisplayProps {
  review: AIReview;
}

export default function AIReviewDisplay({ review }: AIReviewDisplayProps) {
  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 8) return "default";
    if (score >= 6) return "outline";
    return "destructive";
  };

  return (
    <div className="space-y-4">
      {/* Quality Score Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Code Quality Assessment</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Quality Score</span>
              <Badge variant={getScoreBadgeVariant(review.codeQualityScore)}>
                <span className={getScoreColor(review.codeQualityScore)}>
                  {review.codeQualityScore}/10
                </span>
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">{review.quality}</p>
          </div>
        </CardContent>
      </Card>

      {/* Summary Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed">{review.summary}</p>
        </CardContent>
      </Card>

      {/* Best Practices */}
      {review.bestPractices.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Best Practices
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.bestPractices.map((practice, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-green-600 font-bold">✓</span>
                  <span>{practice}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Potential Bugs */}
      {review.potentialBugs.length > 0 && (
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle className="w-5 h-5 text-red-600" />
              Potential Bugs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.potentialBugs.map((bug, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-red-600 font-bold">⚠</span>
                  <span>{bug}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Performance Issues */}
      {review.performanceIssues.length > 0 && (
        <Card className="border-orange-200 bg-orange-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              Performance Issues
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.performanceIssues.map((issue, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-orange-600 font-bold">⚡</span>
                  <span>{issue}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Suggestions */}
      {review.suggestions.length > 0 && (
        <Card className="border-blue-200 bg-blue-50/50">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              Suggestions for Improvement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {review.suggestions.map((suggestion, idx) => (
                <li key={idx} className="flex gap-2 text-sm">
                  <span className="text-blue-600 font-bold">💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
