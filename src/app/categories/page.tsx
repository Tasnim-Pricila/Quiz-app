// "use client";

interface Category {
  _id: string;
  name: string;
}

// import Loading from "@/components/Loading";
import Link from "next/link";
import { Suspense } from "react";
import Loading from "../loading";
// import { useEffect, useState } from "react";

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/quiz/categories`);
  return response.json();
}

async function Categories() {
  const categories = await getCategories();

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-bold my-6 mb-16 text-center">
        Quiz Categories
      </h2>
      <Suspense fallback={<Loading />}>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories?.map((category: Category) => (
            <Link
              href={`/categories/${category?._id}`}
              key={category?._id}
              className="block"
            >
              <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 text-center cursor-pointer">
                <h3 className="text-lg font-semibold">{category?.name}</h3>
              </div>
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
}

export default Categories;
