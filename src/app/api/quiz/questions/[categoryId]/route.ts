import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { categoryId: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const questionsCollection = db.collection("questions");

    const { categoryId } = params;

    if (!categoryId) {
      return NextResponse.json(
        { error: "Category ID is required" },
        { status: 400 }
      );
    }

    const questions = await questionsCollection.find({ categoryId }).toArray();
    return NextResponse.json(questions);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch questions" },
      { status: 500 }
    );
  }
}
