// pages/index.js
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center p-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz App</h1>
        <p className="text-gray-600 mb-6">
          Test your knowledge with our online quizzes.
        </p>
        <Link
          href="/categories"
          className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
        >
          Start Quiz
        </Link>
      </div>
    </div>
  );
}