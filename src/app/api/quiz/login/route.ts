import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import clientPromise from "@/lib/mongodb";

const ACCESS_TOKEN_SECRET = "your_access_token_secret";
const REFRESH_TOKEN_SECRET = "your_refresh_token_secret";

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db("quiz-app");
    const usersCollection = db.collection("users");

    const { email, password } = await req.json();

    // Find user by email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Compare provided password with the hashed password in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Create access token
    const accessToken = jwt.sign(
      { userId: user._id, email: user.email },
      ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1h" } // Access token valid for 1 hour
    );

    // Create refresh token
    const refreshToken = jwt.sign(
      { userId: user._id, email: user.email },
      REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" } // Refresh token valid for 7 days
    );

    // Store the refresh token in the database (optional, for tracking and revoking)
    await usersCollection.updateOne(
      { _id: user._id },
      { $set: { refreshToken: refreshToken } }
    );

    return NextResponse.json(
      {
        message: "Login successful",
        accessToken,
        refreshToken,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
