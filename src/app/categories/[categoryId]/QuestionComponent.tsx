"use client";

import { useState, useEffect } from "react";
import { Answer, Question } from "./type";
import Loading from "@/components/Loading";

const QuestionComponent = ({ data }: { data: Question[] }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<Answer | null>(null);
  const [timer, setTimer] = useState(60);
  const [results, setResults] = useState<
    { question: Question; selected: Answer | null; isCorrect: boolean }[]
  >([]);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (timer === 0) {
      handleNextQuestion();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswerSelection = (answer: Answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    const isCorrect = selectedAnswer?.isCorrect || false;
    const result = {
      question: data[currentQuestionIndex],
      selected: selectedAnswer,
      isCorrect,
    };

    setResults((prevResults) => [...prevResults, result]);
    setSelectedAnswer(null);
    setTimer(60);

    if (currentQuestionIndex < data.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleSubmit = () => {
    handleNextQuestion(); // To store the last question's answer
    setShowResults(true);
  };

  if (showResults) {
    const correctAnswersCount = results.filter(
      (result) => result.isCorrect
    ).length;
    return (
      <div>
        <h1 className="text-3xl font-bold mb-4 mt-10">Quiz Completed!</h1>
        <p className="text-xl underline font-bold">
          You got
          <span className="text-green-600 font-bold">
            {" "}
            {correctAnswersCount}
          </span>
          /<span className="text-green-600 font-bold">{data?.length} </span>
        </p>

        <ul className="mt-6">
          {results.map((result, index) => (
            <li
              key={index}
              style={{ marginBottom: "20px", listStyleType: "none" }}
            >
              <strong className="mb-2 block">
                Ques {index + 1}: {result?.question?.questionText}
              </strong>
              <ul>
                {result.question.answers.map((answer, idx) => {
                  const isCorrectAnswer = answer?.isCorrect;
                  const isSelectedAnswer =
                    result.selected?.text === answer?.text;
                  const backgroundColor = isCorrectAnswer
                    ? "lightgreen"
                    : isSelectedAnswer && !isCorrectAnswer
                    ? "lightcoral"
                    : "white";

                  return (
                    <li
                      key={idx}
                      style={{
                        backgroundColor,
                        padding: "10px",
                        borderRadius: "5px",
                        border: "1px solid #ddd",
                        marginBottom: "5px",
                      }}
                    >
                      {answer?.text}
                    </li>
                  );
                })}
              </ul>
              {result.isCorrect ? (
                <span style={{ color: "green", fontWeight: 600 }}>Correct</span>
              ) : (
                <span style={{ color: "red", fontWeight: 600 }}>Incorrect</span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  if (data.length === 0) {
    return <Loading />;
  }

  const currentQuestion = data[currentQuestionIndex];

  return (
    <div className="h-screen w-screen p-10 flex justify-center items-center">
      <div>
        <h2 className="font-semibold text-center text-xl mb-4">
          Question {currentQuestionIndex + 1}/{data?.length}
        </h2>
        <p className="text-lg mb-4 text-center">
          Time Left: <span className="text-red-600 font-bold"> {timer} </span>{" "}
          seconds
        </p>
        <p className="text-2xl font-semibold py-4">
          {currentQuestion?.questionText}
        </p>
        <ul>
          {currentQuestion?.answers?.map((answer, index) => (
            <li key={index}>
              <button
                onClick={() => handleAnswerSelection(answer)}
                disabled={!!selectedAnswer}
                className={`rounded cursor-pointer px-10 py-4 text-lg font-medium mb-5 border w-full text-left ${
                  selectedAnswer === answer ? "bg-blue-100" : "bg-white"
                }`}
              >
                {answer?.text}
              </button>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            onClick={handleNextQuestion}
            className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded ${
              !selectedAnswer ? "opacity-50 cursor-not-allowed" : ""
            }
            ${
              currentQuestionIndex === data?.length - 1
                ? "bg-blue-500"
                : "bg-green-500"
            }`}
            disabled={!selectedAnswer}
          >
            {currentQuestionIndex === data?.length - 1
              ? "Submit"
              : "Next Question"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionComponent;
