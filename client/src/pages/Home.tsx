import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizContainer } from "@/components/QuizContainer";
import { ResultsContainer } from "@/components/ResultsContainer";
import { getRandomQuestions, calculateScore, type Question, type ScoreResult } from "@/lib/quizUtils";

/**
 * Design Philosophy: Premium CFA Brand Experience
 * - Chick-fil-A Red (#d62300) as primary accent
 * - Clean, professional layout with generous whitespace
 * - Playfair Display for headings (elegant, authoritative)
 * - Lato for body text (readable, modern)
 * - Celebratory, motivational tone throughout
 */

export default function Home() {
  const [quizState, setQuizState] = useState<"landing" | "quiz" | "results">("landing");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | string | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);

  // Initialize quiz on landing page
  const startQuiz = () => {
    const randomQuestions = getRandomQuestions(50);
    setQuestions(randomQuestions);
    setAnswers(new Array(randomQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setQuizState("quiz");
  };

  // Handle answer selection (for multiple choice only - auto-advances)
  const handleAnswer = (answer: number | string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);

    // Only auto-advance for multiple choice
    if (questions[currentQuestionIndex].type === "multiple_choice") {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        // Quiz complete
        const result = calculateScore(questions, newAnswers);
        setScoreResult(result);
        setQuizState("results");
      }
    }
  };

  // Handle text answer change (doesn't auto-advance)
  const handleTextAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Handle skipping to next question
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Handle going back to previous question
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle finishing quiz
  const handleFinish = () => {
    const result = calculateScore(questions, answers);
    setScoreResult(result);
    setQuizState("results");
  };

  // Handle retaking quiz
  const handleRetakeQuiz = () => {
    setQuizState("landing");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScoreResult(null);
  };

  if (quizState === "landing") {
    return <LandingPage onStart={startQuiz} />;
  }

  if (quizState === "quiz" && questions.length > 0) {
    return (
      <QuizContainer
        questions={questions}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        onAnswer={handleAnswer}
        onTextAnswer={handleTextAnswer}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onFinish={handleFinish}
      />
    );
  }

  if (quizState === "results" && scoreResult) {
    return <ResultsContainer scoreResult={scoreResult} onRetake={handleRetakeQuiz} />;
  }

  return null;
}

function LandingPage({ onStart }: { onStart: () => void }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663551914781/dnLoL6oxhAMfsN3ckdnPtw/cfa-hero-background-3vUSox6GfUomfoPcbHrNhZ.webp')",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-black/20"></div>

        {/* Content */}
        <div className="relative z-10 text-center px-4 max-w-2xl">
          <div className="mb-8">
            <h1 className="text-6xl md:text-7xl font-bold text-white mb-4">
              CFA Employee Excellence Quiz
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-2">
              Test Your Knowledge. Prove Your Expertise.
            </p>
            <p className="text-lg text-white/80">
              50 questions to gauge your mastery of Chick-fil-A operations and values
            </p>
          </div>

          <Button
            onClick={onStart}
            size="lg"
            className="bg-white text-[#d62300] hover:bg-gray-100 font-bold text-lg px-8 py-6 rounded-lg shadow-lg"
          >
            Start Quiz
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-6 border-t-4 border-t-[#d62300] shadow-md">
              <h3 className="text-2xl font-bold text-[#d62300] mb-3">50 Questions</h3>
              <p className="text-gray-600">
                Randomly selected from our comprehensive question bank covering all aspects of CFA operations
              </p>
            </Card>

            <Card className="p-6 border-t-4 border-t-[#d62300] shadow-md">
              <h3 className="text-2xl font-bold text-[#d62300] mb-3">Weighted Scoring</h3>
              <p className="text-gray-600">
                Questions have different weights based on importance. Demonstrate mastery of critical concepts
              </p>
            </Card>

            <Card className="p-6 border-t-4 border-t-[#d62300] shadow-md">
              <h3 className="text-2xl font-bold text-[#d62300] mb-3">Instant Ranking</h3>
              <p className="text-gray-600">
                Get your rank from In Training to Operator, with detailed feedback on your performance
              </p>
            </Card>
          </div>

          <div className="mt-12 bg-gray-50 p-8 rounded-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">How It Works</h2>
            <ul className="space-y-3 text-gray-700">
              <li className="flex items-start">
                <span className="text-[#d62300] font-bold mr-3">1.</span>
                <span>Answer 50 randomly selected questions about Chick-fil-A operations and culture</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d62300] font-bold mr-3">2.</span>
                <span>Choose from multiple choice or type your answer for text-based questions</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d62300] font-bold mr-3">3.</span>
                <span>Review your results with detailed feedback on each question</span>
              </li>
              <li className="flex items-start">
                <span className="text-[#d62300] font-bold mr-3">4.</span>
                <span>Discover your rank and celebrate your achievement!</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
