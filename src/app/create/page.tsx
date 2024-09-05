import React from "react";
import QuestionForm from "./QuestionForm";

async function getCategories() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/quiz/categories`);
  return response.json();
}
const CreateQuestion = async () => {
  const categories = await getCategories();
  return (
    <div>
      <QuestionForm categories={categories} />
    </div>
  );
};

export default CreateQuestion;
