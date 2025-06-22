// pages/api/questions/index.ts
import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectDB();

  if (req.method === "GET") {
    const questions = await Question.find({});
    return res.status(200).json(questions);
  }

  res.status(405).json({ message: "Method Not Allowed" });
}
