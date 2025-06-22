// src/pages/api/questions/index.ts
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const questions = await Question.find({});
    return res.status(200).json(questions);
  }

  if (req.method === "POST") {
    try {
      const question = await Question.create(req.body);
      return res.status(201).json({ message: "Question added", question });
    } catch (err) {
      return res.status(500).json({ message: "Failed to add question", error: err });
    }
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
