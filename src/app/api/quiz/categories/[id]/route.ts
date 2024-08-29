// app/api/quiz/categories/[id]/route.ts

import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "../../../../../lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const categoriesCollection = db.collection("categories");

    // Extract the ID from the route parameters
    const { id } = params;

    // Validate the ID and ensure it is a valid ObjectId
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid category ID" },
        { status: 400 }
      );
    }

    // Find the category by its ID
    const category = await categoriesCollection.findOne({
      _id: new ObjectId(id),
    });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch category details" },
      { status: 500 }
    );
  }
}
