import { connectDB } from "@/lib/db";
import { Question } from "@/models/Question";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const questions = await Question.find({});
  return NextResponse.json(questions);
}

export async function POST(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const question = await Question.create(body);
    return NextResponse.json({ message: "Question added", question }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "Failed to add question", error: err }, { status: 500 });
  }
}