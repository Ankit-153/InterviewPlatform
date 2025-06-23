// hooks/useQuestions.ts
import { useEffect, useState } from "react";
import axios from "axios";

export interface Question {
  id: string;
  title: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: {
    javascript: string;
    python: string;
    java: string;
    cpp: string;
  };
  constraints?: string[];
}

export const useQuestions = () => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await axios.get(
  process.env.NODE_ENV === "production"
    ? "https://interview-platform-two.vercel.app/api/questions"
    : "/api/questions"
);

        setQuestions(res.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch questions");
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return { questions, loading, error };
};
