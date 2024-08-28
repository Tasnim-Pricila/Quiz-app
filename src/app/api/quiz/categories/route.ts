// app/api/quiz/categories/route.ts

import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app"); // replace with your database name
    const categoriesCollection = db.collection("categories");
    const categories = await categoriesCollection.find({}).toArray();
    return NextResponse.json(categories);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const categoriesCollection = db.collection("categories");

    const body = await req.json();
    await categoriesCollection.insertOne(body);

    return NextResponse.json(
      { message: "Category created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}
