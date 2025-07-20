import { LANGUAGES } from "@/constants";
import { useEffect, useState, useMemo, useCallback } from "react";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { AlertCircleIcon, BookIcon, LightbulbIcon } from "lucide-react";
import Editor from "@monaco-editor/react";
import { Button } from "./ui/button";
import { useCodeRunner } from "@/hooks/useCodeRunner";
import { useQuestions } from "@/hooks/useQuestions";
import LoaderUI from "./LoaderUI";
import { useSharedCodeEditor } from "@/hooks/useSharedCodeEditor";
import { useParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useRef } from "react";

import type { Question } from "@/hooks/useQuestions";
type CodeLanguage = "javascript" | "python" | "java" | "cpp";

function CodeEditor() {
  const params = useParams();
  const interviewId = params.id as string;
  const { user } = useUser();
  const { questions, loading: loadingQuestions } = useQuestions();
  const [executionLoading, setExecutionLoading] = useState(false);
  const [editorRef, setEditorRef] = useState<any>(null);
  
  // Use shared editor without cursor synchronization
  const {
    code,
    language,
    stdin,
    selectedQuestionId,
    updateCode,
    updateLanguage,
    updateStdin,
    updateSelectedQuestion,
    updateExecutionResult,
    executionResult,
    // Still destructuring these to avoid type errors but not using them
    cursorPosition,
    updateCursorPosition,
    isLoading: loadingCodeSession,
    session,
  } = useSharedCodeEditor<CodeLanguage>(
    interviewId,
    "", 
    "javascript"
  );

  // Simplified editor mounting function without cursor tracking
  const handleEditorDidMount = useCallback((editor: any) => {
    setEditorRef(editor);
    // No cursor position tracking logic
  }, []);

  // Get the currently selected question based on ID
  const selectedQuestion = useMemo(() => {
    if (!questions.length) return null;
    
    if (selectedQuestionId) {
      return questions.find(q => q.id === selectedQuestionId) || questions[0];
    }
    return questions[0];
    
  }, [questions, selectedQuestionId]);
  
  // Set initial question if none selected
  useEffect(() => {
    if (questions.length > 0 && !selectedQuestionId && updateSelectedQuestion) {
      updateSelectedQuestion(questions[0].id);
      
      // Update code with starter code for the selected question
      if (questions[0].starterCode && questions[0].starterCode[language]) {
        updateCode(questions[0].starterCode[language]);
      }
    }
  }, [questions, selectedQuestionId, language, updateSelectedQuestion, updateCode]);

  // Removed cursor update effect
  
  // When question changes
  const handleQuestionChange = useCallback((questionId: string) => {
    if (!updateSelectedQuestion) return;
    
    updateSelectedQuestion(questionId);
    
    // Find the selected question and update code
    const question = questions.find((q) => q.id === questionId);
    if (question && question.starterCode && question.starterCode[language]) {
      updateCode(question.starterCode[language]);
    }
  }, [questions, language, updateSelectedQuestion, updateCode]);
  
  // Language change handler
  // const handleLanguageChange = useCallback((newLanguage: CodeLanguage) => {
  //   if (!selectedQuestion || !updateLanguage) return;
    
  //   if (selectedQuestion.starterCode && selectedQuestion.starterCode[newLanguage]) {
  //     updateLanguage(newLanguage);
  //   }
  // }, [selectedQuestion, updateLanguage]);
// New Handle language change
  const handleLanguageChange = useCallback((newLanguage: CodeLanguage) => {
  if (!selectedQuestion || !updateLanguage || !updateCode) return;

  updateLanguage(newLanguage);

  // update the editor with the corresponding starter code
  const newStarterCode = selectedQuestion.starterCode?.[newLanguage];
  if (newStarterCode) {
    updateCode(newStarterCode);
  }
}, [selectedQuestion, updateLanguage, updateCode]);

  
  // Code runner integration
  const { runCode } = useCodeRunner();
  
  const languageIdMap = {
    python: 71,
    javascript: 63,
    java: 62,
    cpp: 54,
  };
  
  // Run code and share results
  const handleRunClick = useCallback(async () => {
    if (!updateExecutionResult) return;
    
    setExecutionLoading(true);
    try {
      const result = await runCode({
        language_id: languageIdMap[language],
        source_code: code,
        stdin: stdin,
      });
      
      // Share execution results with other participants
      updateExecutionResult({
        output: result,
        stdin: stdin,
        error: null,
      });
    } catch (err: any) {
      // Share error with other participants
      updateExecutionResult({
        output: null,
        stdin: stdin,
        error: err.message,
      });
    } finally {
      setExecutionLoading(false);
    }
  }, [code, language, stdin, runCode, updateExecutionResult]);
  
  // Handle stdin changes - synchronize with other participants
  const handleStdinChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (updateStdin) {
      updateStdin(e.target.value);
    }
  }, [updateStdin]);
  
  if (loadingQuestions || !selectedQuestion || loadingCodeSession) {
    return <LoaderUI />;
  }
  
  // Get display output from execution results
  const displayOutput = executionResult?.output;
  const displayError = executionResult?.error;
  
  return (
    <ResizablePanelGroup direction="vertical" className="min-h-[calc-100vh-4rem-1px]">
      {/* QUESTION SECTION */}
      <ResizablePanel>
        <ScrollArea className="h-full">
          <div className="p-6">
            <div className="max-w-4xl mx-auto space-y-6">
              {/* HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {selectedQuestion.title}
                    </h2>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Choose your language and solve the problem
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Select 
                    value={selectedQuestion.id} 
                    onValueChange={handleQuestionChange}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select question" />
                    </SelectTrigger>
                    <SelectContent>
                      {questions.map((q) => (
                        <SelectItem key={q.id} value={q.id}>
                          {q.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select 
                    value={language} 
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-[150px]">
                      <SelectValue>
                        <div className="flex items-center gap-2">
                          <img
                            src={`/${language}.png`}
                            alt={language}
                            className="w-5 h-5 object-contain"
                          />
                          {LANGUAGES.find((l) => l.id === language)?.name}
                        </div>
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {LANGUAGES.map((lang) => (
                        <SelectItem key={lang.id} value={lang.id}>
                          <div className="flex items-center gap-2">
                            <img
                              src={`/${lang.id}.png`}
                              alt={lang.name}
                              className="w-5 h-5 object-contain"
                            />
                            {lang.name}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* PROBLEM DESC. */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <BookIcon className="h-5 w-5 text-primary/80" />
                  <CardTitle>Problem Description</CardTitle>
                </CardHeader>
                <CardContent className="text-sm leading-relaxed">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <p className="whitespace-pre-line">{selectedQuestion.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* PROBLEM EXAMPLES */}
              <Card>
                <CardHeader className="flex flex-row items-center gap-2">
                  <LightbulbIcon className="h-5 w-5 text-yellow-500" />
                  <CardTitle>Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-full w-full rounded-md border">
                    <div className="p-4 space-y-4">
                      {selectedQuestion.examples.map((example, index) => (
                        <div key={index} className="space-y-2">
                          <p className="font-medium text-sm">Example {index + 1}:</p>
                          <ScrollArea className="h-full w-full rounded-md">
                            <pre className="bg-muted/50 p-3 rounded-lg text-sm font-mono">
                              <div>Input: {example.input}</div>
                              <div>Output: {example.output}</div>
                              {example.explanation && (
                                <div className="pt-2 text-muted-foreground">
                                  Explanation: {example.explanation}
                                </div>
                              )}
                            </pre>
                            <ScrollBar orientation="horizontal" />
                          </ScrollArea>
                        </div>
                      ))}
                    </div>
                    <ScrollBar />
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* CONSTRAINTS */}
              {selectedQuestion.constraints && (
                <Card>
                  <CardHeader className="flex flex-row items-center gap-2">
                    <AlertCircleIcon className="h-5 w-5 text-blue-500" />
                    <CardTitle>Constraints</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-1.5 text-sm marker:text-muted-foreground">
                      {selectedQuestion.constraints.map((constraint, index) => (
                        <li key={index} className="text-muted-foreground">
                          {constraint}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
          <ScrollBar />
        </ScrollArea>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* CODE EDITOR - Everyone can edit */}
      <ResizablePanel defaultSize={60} maxSize={100}>
        <div className="h-full relative">
          <Editor
            height={"100%"}
            language={language}
            theme="vs-dark"
            value={code}
            onChange={(value) => updateCode(value || "")}
            onMount={handleEditorDidMount}
            options={{
              minimap: { enabled: false },
              fontSize: 18,
              lineNumbers: "on",
              scrollBeyondLastLine: false,
              automaticLayout: true,
              padding: { top: 16, bottom: 16 },
              wordWrap: "on",
              wrappingIndent: "indent",
              // Removed readOnly option so everyone can edit
            }}
          />
        </div>
      </ResizablePanel>
            
      {/* Stdin Input - Everyone can edit */}
      <div className="px-4 pt-2">
        <label className="text-sm font-medium block mb-1">Custom Input (stdin)</label>
        <textarea
          value={stdin}
          onChange={handleStdinChange}
          className="w-full h-24 p-2 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-zinc-900 text-sm"
          placeholder="Enter your input here..."
          // Removed disabled property so everyone can edit
        />
      </div>

      {/* Run button - Everyone can run code */}
      <div className="px-4 py-2 space-y-2">
        <Button 
          onClick={handleRunClick} 
          disabled={executionLoading}
        >
          {executionLoading ? "Running..." : "Run Code"}
        </Button>

        {displayOutput && (
          <pre className="bg-black text-white p-4 rounded w-full max-h-[200px] overflow-auto">
            {displayOutput.stderr || displayOutput.compile_output || displayOutput.stdout || "No output."}
          </pre>
        )}

        {displayError && (
          <p className="text-red-500 mt-2">{displayError}</p>
        )}
      </div>
    </ResizablePanelGroup>
  );
}

export default CodeEditor;
