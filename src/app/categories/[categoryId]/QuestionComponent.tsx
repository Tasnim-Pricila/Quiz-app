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
    const interval = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    if (timer === 0) {
      handleNextQuestion();
    }

    return () => clearInterval(interval);
  }, [timer]);

  const handleAnswerSelection = (answer: Answer) => {
    setSelectedAnswer(answer);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer) {
      const isCorrect = selectedAnswer.isCorrect;
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
        <h2>Quiz Results</h2>
        <p>
          Correct Answers: {correctAnswersCount} out of {data.length}
        </p>
        <ul>
          {results.map((result, index) => (
            <li
              key={index}
              style={{ marginBottom: "20px", listStyleType: "none" }}
            >
              <strong>
                Question {index + 1}: {result.question.questionText}
              </strong>
              <ul>
                {result.question.answers.map((answer, idx) => {
                  const isCorrectAnswer = answer.isCorrect;
                  const isSelectedAnswer =
                    result.selected?.text === answer.text;
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
                      {answer.text}
                    </li>
                  );
                })}
              </ul>
              {result.isCorrect ? (
                <span style={{ color: "green" }}>Correct</span>
              ) : (
                <span style={{ color: "red" }}>Incorrect</span>
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
    <div>
      <h2>
        Question {currentQuestionIndex + 1}/{data.length}
      </h2>
      <p>{currentQuestion?.questionText}</p>
      <ul>
        {currentQuestion?.answers?.map((answer, index) => (
          <li key={index}>
            <button
              onClick={() => handleAnswerSelection(answer)}
              disabled={!!selectedAnswer}
              style={{
                backgroundColor:
                  selectedAnswer === answer ? "lightblue" : "white",
                padding: "10px",
                borderRadius: "5px",
                border: "1px solid #ddd",
                marginBottom: "5px",
                width: "100%",
                textAlign: "left",
              }}
            >
              {answer.text}
            </button>
          </li>
        ))}
      </ul>
      <p>Time remaining: {timer} seconds</p>
      <button onClick={handleNextQuestion} disabled={!selectedAnswer}>
        {currentQuestionIndex === data.length - 1 ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuestionComponent;
