// app/api/quiz/levels/route.ts

import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Assuming you have a MongoDB utility

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app"); // replace with your database name
    const levelsCollection = db.collection("levels");
    const levels = await levelsCollection.find({}).toArray();
    return NextResponse.json(levels);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch levels" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const levelsCollection = db.collection("levels");

    const body = await req.json();
    await levelsCollection.insertOne(body);

    return NextResponse.json(
      { message: "Level created successfully" },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create level" },
      { status: 500 }
    );
  }
}
