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

  const handleOptionChange = (index: number, field: string, value: string) => {
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
    <div>
      <h1>Create New Question</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Question:</label>
          <input
            type="text"
            name="questionText"
            value={formData.questionText}
            onChange={handleChange}
            className="border"
            required
          />
        </div>
        <div>
          <label>Category:</label>
          <select
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="border"
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
        <div>
          <label>Options:</label>
          {formData.answers.map((answer, index) => (
            <div key={index} className="flex items-center">
              <input
                type="text"
                value={answer.text}
                className="border mr-2"
                onChange={(e) =>
                  handleOptionChange(index, "text", e.target.value)
                }
                required
              />
              <label>
                <input
                  type="checkbox"
                  checked={answer.isCorrect}
                  onChange={(e: any) =>
                    handleOptionChange(index, "isCorrect", e.target.checked)
                  }
                />
                Correct
              </label>
            </div>
          ))}
        </div>
        <button type="submit" className="border">
          Submit Question
        </button>
      </form>
    </div>
  );
};

export default CreateQuestion;
