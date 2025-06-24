import { useState, useEffect, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useUser } from "@clerk/nextjs";

type ExecutionResult = {
  output: any;
  stdin: string;
  error: string | null;
};

// Enhanced useSharedCodeEditor.ts
export function useSharedCodeEditor<T extends string = "javascript" | "python" | "java" | "cpp">(
  interviewId: string,
  initialCode: string,
  initialLanguage: T = "javascript" as T
) {
  const [code, setLocalCode] = useState(initialCode);
  const [language, setLocalLanguage] = useState<T>(initialLanguage);
  const [stdin, setLocalStdin] = useState("");
  const [questionId, setLocalQuestionId] = useState<string | null>(null);
  
  const { user } = useUser();
  const userId = user?.id;
  
  const initializeCodeSession = useMutation(api.codeSessions.initializeCodeSession);
  const updateCodeMutation = useMutation(api.codeSessions.updateCode);
  const updateExecutionResultMutation = useMutation(api.codeSessions.updateExecutionResult);
  const updateSelectedQuestionMutation = useMutation(api.codeSessions.updateSelectedQuestion);
  const updateStdinMutation = useMutation(api.codeSessions.updateStdin);
  const [cursorPosition, setCursorPosition] = useState({ lineNumber: 1, column: 1 });
  const updateCursorPositionMutation = useMutation(api.codeSessions.updateCursorPosition);
  
  // Initialize code session
  useEffect(() => {
    if (typeof userId !== 'string') return;
    const id: string = userId;
    async function init() {
      await initializeCodeSession({
        interviewId,
        initialCode,
        language: initialLanguage,
        userId: id,
      });
    }
    
    init();
  }, [interviewId, initialCode, initialLanguage, userId, initializeCodeSession]);
  
  // Subscribe to code session changes
  const session = useQuery(api.codeSessions.getCodeSessionByInterviewId, { 
    interviewId 
  });
  
  // Update local state when remote changes occur
  useEffect(() => {
    if (!session || typeof userId !== 'string') return;
    
    // Sync code
    if (session.code !== undefined && session.lastUpdatedBy !== userId) {
      setLocalCode(session.code);
    }
    
    // Sync language
    if (session.language !== undefined && session.lastUpdatedBy !== userId) {
      setLocalLanguage(session.language as T);
    }
    
    // Sync stdin
    if (session.stdin !== undefined && session.lastUpdatedBy !== userId) {
      setLocalStdin(session.stdin);
    }
    
    // Sync selected question
    if (session.questionId !== undefined && session.lastUpdatedBy !== userId) {
      setLocalQuestionId(session.questionId);
    }
  }, [session, userId]);

   // Function to update cursor position
  const updateCursorPosition = useCallback((position: { lineNumber: number; column: number }) => {
    if (!userId) return;
    
    setCursorPosition(position);
    updateCursorPositionMutation({
      interviewId,
      position,
      userId,
    });
  }, [interviewId, userId, updateCursorPositionMutation]);
  
  // Function to update code
  const updateCode = useCallback(async (newCode: string) => {
    if (typeof userId !== 'string') return;
    
    setLocalCode(newCode);
    await updateCodeMutation({
      interviewId,
      code: newCode,
      userId: userId,
    });
  }, [interviewId, updateCodeMutation, userId]);
  
  // Function to update language
  const updateLanguage = useCallback(async (newLanguage: T) => {
    if (typeof userId !== 'string') return;
    
    setLocalLanguage(newLanguage);
    await updateCodeMutation({
      interviewId,
      code,
      language: newLanguage,
      userId: userId,
    });
  }, [interviewId, code, updateCodeMutation, userId]);
  
  // Function to update stdin
  const updateStdin = useCallback(async (newStdin: string) => {
    if (typeof userId !== 'string') return;
    
    setLocalStdin(newStdin);
    await updateStdinMutation({
      interviewId,
      stdin: newStdin,
      userId: userId,
    });
  }, [interviewId, updateStdinMutation, userId]);
  
  // Function to update selected question
  const updateSelectedQuestion = useCallback(async (newQuestionId: string) => {
    if (typeof userId !== 'string') return;
    
    setLocalQuestionId(newQuestionId);
    await updateSelectedQuestionMutation({
      interviewId,
      questionId: newQuestionId,
      userId: userId,
    });
  }, [interviewId, updateSelectedQuestionMutation, userId]);

  // Function to update execution results
  const updateExecutionResult = useCallback(async (result: ExecutionResult) => {
    if (typeof userId !== 'string') return;
    
    await updateExecutionResultMutation({
      interviewId,
      result: {
        output: result.output,
        stdin: result.stdin,
        error: result.error === null ? undefined : result.error,
      },
      userId: userId,
    });
  }, [interviewId, updateExecutionResultMutation, userId]);
  
  return {
    code,
    language,
    stdin: session?.stdin || stdin,
    selectedQuestionId: session?.questionId || questionId,
    updateCode,
    updateLanguage,
    updateStdin,
    updateSelectedQuestion,
    updateExecutionResult,
    executionResult: session?.executionResult,
    isLoading: !session || !userId,
    session,
    cursorPosition: session?.cursorPosition || cursorPosition,
    updateCursorPosition,
  };
}








//   const id: string = userId;