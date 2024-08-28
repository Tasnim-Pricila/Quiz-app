// components/CategoryList.tsx
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const Categories = () => {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("/api/quiz/categories");
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <div>
      <h2>Quiz Categories</h2>
      <ul>
        {categories.map((category) => (
          <Link href={`/categories/${category?._id}`} key={category._id}>
            <li className="bg-blue-500 mb-2 text-center">{category.name}</li>
          </Link>
        ))}
      </ul>
    </div>
  );
};

export default Categories;
