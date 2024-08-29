// // src/app/api/quiz/refreshToken/route.ts
// import { NextRequest, NextResponse } from "next/server";
// import jwt from "jsonwebtoken";
// import clientPromise from "@/lib/mongodb";

// const SECRET_KEY = "your_secret_key_54456445";
// const REFRESH_SECRET_KEY = "your_refresh_secret_key_123456";

// export async function POST(req: NextRequest) {
//     try {
//       console.log(req.cookies)
//     // Extract the refresh token from the cookies
//     const refreshToken = req.cookies.get("refreshToken") || ""; // Default to empty string if undefined

//     if (!refreshToken) {
//       return NextResponse.json(
//         { error: "Refresh token not provided" },
//         { status: 401 }
//       );
//     }

//     // Verify the refresh token
//     let userId;
//     try {
//       const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
//       userId = (decoded as { userId: string }).userId;
//     } catch (err) {
//       return NextResponse.json(
//         { error: "Invalid refresh token" },
//         { status: 403 }
//       );
//     }

//     // Check if user exists (assuming MongoDB)
//     const client = await clientPromise;
//     const db = client.db("quiz-app");
//     const usersCollection = db.collection("users");
//     const user = await usersCollection.findOne({
//       _id: new jwt.ObjectId(userId),
//     });

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     // Generate a new access token
//     const newAccessToken = jwt.sign(
//       { userId: user._id.toString() },
//       SECRET_KEY,
//       {
//         expiresIn: "1h",
//       }
//     );

//     return NextResponse.json({ accessToken: newAccessToken }, { status: 200 });
//   } catch (error) {
//     console.error("Error refreshing token:", error);
//     return NextResponse.json(
//       { error: "Internal Server Error" },
//       { status: 500 }
//     );
//   }
// }
