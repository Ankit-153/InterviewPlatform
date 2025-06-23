// hooks/useCodeRunner.ts
import { useState } from "react";
import axios from "axios";

// const apiKey = "e00a19c8admshf9ed60a0aa89a8dp189c13jsn14bd9e4e36bb";
const apiKey = "048f855597mshd67964b12ed4c02p149dfejsn9d9f019f82db";

type RunCodeOptions = {
  language_id: number;
  source_code: string;
  stdin?: string;
};

type RunCodeResponse = {
  token: string;
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  status: { id: number; description: string };
};

export function useCodeRunner() {
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<RunCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const runCode = async ({ language_id, source_code, stdin = "" }: RunCodeOptions) => {

    if (!language_id || !source_code?.trim()) {
        setError("Missing language or source code");
        return null;
    }

    setLoading(true);
    setOutput(null);
    setError(null);

    try {
        console.log(stdin);
      const res = await axios.post<RunCodeResponse>(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          language_id,
          source_code,
          stdin,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": apiKey,  // 🔁 Replace this
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      setOutput(res.data);
      return res.data;
    } catch (err: any) {
      console.error("Error running code:", err);
    //   console.log("api key is ",process.env.RAPIDAPI_KEY);
      setError("Something went wrong while executing the code.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { runCode, output, loading, error };
}
