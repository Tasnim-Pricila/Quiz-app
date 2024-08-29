import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb"; // Assuming you have this file configured for MongoDB connection
import bcrypt from "bcrypt"; // To hash passwords

export async function POST(req: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const usersCollection = db.collection("users");

    const body = await req.json();

    const { name, email, password } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    // Check if the user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user into the database
    await usersCollection.insertOne({
      name,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to register user:", error);
    return NextResponse.json(
      { error: "Failed to register user" },
      { status: 500 }
    );
  }
}
