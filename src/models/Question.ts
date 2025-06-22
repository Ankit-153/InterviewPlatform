// models/Question.ts
import mongoose from "mongoose";

const ExampleSchema = new mongoose.Schema({
  input: { type: String, required: true },
  output: { type: String, required: true },
  explanation: { type: String },
});

const StarterCodeSchema = new mongoose.Schema({
  javascript: { type: String, default: "" },
  python: { type: String, default: "" },
  java: { type: String, default: "" },
  cpp: { type: String, default: "" },
});

const QuestionSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  examples: [ExampleSchema],
  starterCode: StarterCodeSchema,
  constraints: [String],
});

export const Question =
  mongoose.models.Question || mongoose.model("Question", QuestionSchema);
