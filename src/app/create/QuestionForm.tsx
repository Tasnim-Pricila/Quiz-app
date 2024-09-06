"use client";

import React, { useState } from "react";
import { Category } from "../categories/[categoryId]/type";

const CreateQuestion = ({ categories }: { categories: Category[] }) => {
  const [formData, setFormData] = useState({
    questionText: "",
    categoryId: "",
    answers: [
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
      { text: "", isCorrect: false },
    ],
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOptionChange = (
    index: number,
    field: string,
    value: string | boolean
  ) => {
    const newAnswers = [...formData.answers];
    newAnswers[index] = { ...newAnswers[index], [field]: value };
    setFormData({ ...formData, answers: newAnswers });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/quiz/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // Clear form or show success message
        console.log("Question submitted successfully!");
        setFormData({
          questionText: "",
          categoryId: "",
          answers: [
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
            { text: "", isCorrect: false },
          ],
        });
      } else {
        console.error("Failed to submit question.");
      }
    } catch (error) {
      console.error("Error submitting question:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Create New Question
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Question:
            </label>
            <input
              type="text"
              name="questionText"
              value={formData.questionText}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Category:
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category: Category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 font-bold mb-2">
              Options:
            </label>
            {formData.answers.map((answer, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row items-center mb-2"
              >
                <input
                  type="text"
                  value={answer.text}
                  className="w-full sm:flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mr-0 sm:mr-2 mb-2 sm:mb-0"
                  onChange={(e) =>
                    handleOptionChange(index, "text", e.target.value)
                  }
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={answer.isCorrect}
                    onChange={(e: any) =>
                      handleOptionChange(index, "isCorrect", e.target.checked)
                    }
                    className="mr-2"
                  />
                  <span className="text-gray-700">Correct</span>
                </label>
              </div>
            ))}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
          >
            Submit Question
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateQuestion;
