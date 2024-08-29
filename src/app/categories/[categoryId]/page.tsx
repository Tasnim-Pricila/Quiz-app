"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import bgImage from "../../../../public/assets/images/bg.jpg";

interface Answer {
  text: string;
  isCorrect: boolean;
}
interface Category {
  _id: string;
  name: string;
}

interface Question {
  _id: string;
  questionText: string;
  answers: Answer[];
}

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

const CategoryWiseQuestion = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categoryDetails, setCategoryDetails] = useState<Category>();
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(string | null)[]>([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [quizCompleted, setQuizCompleted] = useState(false);

  useEffect(() => {
    if (categoryId) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`/api/quiz/questions/${categoryId}`);
          const data = await response.json();

          // Shuffle the questions and pick the first 20
          const shuffledQuestions = data.sort(() => 0.5 - Math.random());
          const limitedQuestions = shuffledQuestions.slice(0, 20);

          // Shuffle the answers for each question
          const questionsWithShuffledAnswers = limitedQuestions.map(
            (question: Question) => ({
              ...question,
              answers: shuffleArray(question.answers), // Shuffle answers
            })
          );

          setQuestions(questionsWithShuffledAnswers);
          setSelectedAnswers(
            new Array(questionsWithShuffledAnswers.length).fill(null)
          );
        } catch (error) {
          console.error("Failed to fetch questions:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [categoryId]);

  useEffect(() => {
    if (categoryId) {
      const fetchQuestions = async () => {
        try {
          const response = await fetch(`/api/quiz/categories/${categoryId}`);
          const data = await response.json();
          setCategoryDetails(data);
        } catch (error) {
          console.error("Failed to fetch category:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchQuestions();
    }
  }, [categoryId]);

  useEffect(() => {
    if (quizCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 1) {
          handleNextQuestion();
          return 10; // Reset timer for next question
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentQuestionIndex, quizCompleted]);

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions?.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(10); // Reset time for the next question
    } else {
      setQuizCompleted(true);
    }
  };

  const handleAnswerSelect = (index: number) => {
    if (selectedAnswers[currentQuestionIndex] === null) {
      const newSelectedAnswers = [...selectedAnswers];
      newSelectedAnswers[currentQuestionIndex] =
        questions[currentQuestionIndex]?.answers[index]?.text;
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const calculateResults = () => {
    let correctCount = 0;
    questions?.forEach((question, index) => {
      const selectedAnswer = selectedAnswers[index];
      const correctAnswer = question?.answers?.find(
        (answer) => answer?.isCorrect
      )?.text;
      if (selectedAnswer === correctAnswer) {
        correctCount++;
      }
    });
    return correctCount;
  };

  if (loading) return <p>Loading...</p>;

  if (quizCompleted) {
    const correctCount = calculateResults();
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-4">Quiz Completed!</h1>
        <p>
          You got {correctCount} out of {questions?.length} questions correct.
        </p>
        <h2 className="text-xl font-semibold mt-4">Review Questions:</h2>
        <ul className="space-y-4">
          {questions?.map((question, index) => (
            <li
              key={question._id}
              className="p-4 bg-white shadow-lg rounded-lg"
            >
              <h2 className="text-lg font-semibold mb-2">
                {index + 1}. {question?.questionText}
              </h2>
              <ul className="space-y-2">
                {question?.answers?.map((answer, answerIndex) => (
                  <li
                    key={answerIndex}
                    className={`p-2 rounded ${
                      answer?.isCorrect ? "bg-green-100" : "bg-gray-100"
                    } ${
                      selectedAnswers[index] === answer?.text &&
                      !answer?.isCorrect
                        ? "bg-red-100"
                        : ""
                    }`}
                  >
                    {answer?.text}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions?.length - 1;
  const isAnswerSelected = selectedAnswers[currentQuestionIndex] !== null;

  return (
    <div
      className="p-6 border flex justify-center flex-col items-center"
      style={{
        background: `url(${bgImage})`,
        height: "100vh", // or any other height you prefer
        backgroundSize: "cover", // Ensures the image covers the entire div
        backgroundPosition: "center", // Centers the image
        backgroundRepeat: "no-repeat", // Prevents the image from repeating
      }}
    >
      <h1 className="text-3xl font-bold mb-4">
        Questions for {categoryDetails?.name}
      </h1>
      {currentQuestion ? (
        <div>
          <p className="text-lg mb-4 text-center">
            Time Left:{" "}
            <span className="text-red-600 font-bold"> {timeLeft} </span> seconds
          </p>
          <div className="p-10 bg-white shadow-lg rounded-lg">
            <h2 className="text-2xl font-semibold mb-10 px-10 py-6">
              {`${currentQuestionIndex + 1}. ${currentQuestion?.questionText}`}
            </h2>
            <ul className="space-y-2">
              {currentQuestion?.answers?.map((answer, index) => (
                <li
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`rounded cursor-pointer px-10 py-4 text-center text-lg font-semibold ${
                    selectedAnswers[currentQuestionIndex] === answer?.text
                      ? "bg-blue-100"
                      : "bg-gray-100"
                  }`}
                >
                  {answer?.text}
                </li>
              ))}
            </ul>
          </div>
          {isLastQuestion ? (
            <div className="flex justify-end">
              <button
                onClick={() => setQuizCompleted(true)}
                className={`mt-4 bg-green-500 text-white px-4 py-2  ${
                  !isAnswerSelected
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-green-600"
                }`}
                disabled={!isAnswerSelected}
              >
                Complete Quiz
              </button>
            </div>
          ) : (
            <div className=" flex justify-end">
              <button
                onClick={handleNextQuestion}
                className={`mt-4 bg-blue-500 text-white px-4 py-2 rounded ${
                  !isAnswerSelected
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-blue-600"
                }`}
                disabled={!isAnswerSelected}
              >
                Next Question
              </button>
            </div>
          )}
        </div>
      ) : (
        <p>No questions found</p>
      )}
    </div>
  );
};

export default CategoryWiseQuestion;
