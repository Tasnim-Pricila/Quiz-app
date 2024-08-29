
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { checkAuthStatus } from "./utils/checkAuth";

const Home = () => {
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    const fetchAuthStatus = async () => {
      const status = await checkAuthStatus();
      setAuthenticated(status.authenticated);

      // Optionally redirect if not authenticated
      // if (!status.authenticated) {
      //   router.push("/login");
      // }
    };

    fetchAuthStatus();
  }, [router]);

  console.log(authenticated)

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center rounded-lg">
        <h1 className="text-3xl font-bold mb-4">Welcome to the Quiz App</h1>
        <p className="text-gray-600 mb-10">
          Test your knowledge with our online quizzes.
        </p>
        <div className="flex gap-4 justify-center">
          {authenticated ? (
            <Link
              href="/categories"
              className="bg-blue-500 text-white px-6 py-3 rounded-full text-lg hover:bg-blue-600 transition"
            >
              Start Quiz
            </Link>
          ) : (
            <p>Please log in to start the quiz.</p>
          )}
          <Link
            href="/login"
            className="bg-green-500 text-white px-6 py-3 rounded-full text-lg hover:bg-green-600 transition"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="bg-purple-500 text-white px-6 py-3 rounded-full text-lg hover:bg-purple-600 transition"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
