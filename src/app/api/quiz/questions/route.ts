import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const questionsCollection = db.collection("questions");

    // Parse request body
    const body = await req.json();

    // Validate request body
    const { categoryId, questionText, answers } = body;
    if (
      !categoryId ||
      !questionText ||
      !Array.isArray(answers) ||
      answers.length !== 3
    ) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Ensure that exactly one answer is marked as correct
    const hasCorrectAnswer = answers.some((answer) => answer.isCorrect);
    if (!hasCorrectAnswer) {
      return NextResponse.json(
        { error: "At least one answer must be marked as correct" },
        { status: 400 }
      );
    }

    // Insert the question into the database
    await questionsCollection.insertOne({
      categoryId,
      questionText,
      answers,
    });

    return NextResponse.json(
      { message: "Question added successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add question" },
      { status: 500 }
    );
  }
}
