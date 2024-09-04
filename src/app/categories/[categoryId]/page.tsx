import bgImage from "../../../../public/assets/images/bg.jpg";
import QuestionComponent from "./QuestionComponent";
import { Category, Question } from "./type";

const shuffleArray = (array: any[]) => {
  return array.sort(() => Math.random() - 0.5);
};

export async function generateStaticParams() {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/quiz/categories`);
  const data = await response.json();
  return data?.map((category: Category) => ({
    categoryId: category?._id,
  }));
}

async function getCategoryQuestion(categoryId: string) {
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const response = await fetch(`${baseUrl}/api/quiz/questions/${categoryId}`);
  const data = await response.json();

  // Shuffle the questions and pick the first 20
  const shuffledQuestions = data.sort(() => 0.5 - Math.random());
  const limitedQuestions = shuffledQuestions.slice(0, 20);

  // Shuffle the answers for each question
  const questionsWithShuffledAnswers = limitedQuestions.map(
    (question: Question) => ({
      ...question,
      answers: shuffleArray(question.answers),
    })
  );
  return questionsWithShuffledAnswers;
}

async function CategoryWiseQuestion({ params }: { params: any }) {
  const data = await getCategoryQuestion(params?.categoryId);

  return (
    <div className="flex justify-center flex-col items-center">
      <QuestionComponent data={data} />
    </div>
  );
}

export default CategoryWiseQuestion;
