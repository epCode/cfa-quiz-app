import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { QuizContainer } from "@/components/QuizContainer";
import { ResultsContainer } from "@/components/ResultsContainer";
import { NameEntry } from "@/components/NameEntry";
import Leaderboard from "@/pages/Leaderboard";
import { getRandomQuestions, calculateScore, type Question, type ScoreResult } from "@/lib/quizUtils";
import {
  saveQuizProgress,
  getQuizProgress,
  clearQuizProgress,
  saveQuizResult,
  hasActiveQuizProgress,
  type QuizProgress,
} from "@/lib/storageUtils";
import { nanoid } from "nanoid";

/**
 * Design Philosophy: Premium CFA Brand Experience
 * - Chick-fil-A Red (#d62300) as primary accent
 * - Clean, professional layout with generous whitespace
 * - Playfair Display for headings (elegant, authoritative)
 * - Lato for body text (readable, modern)
 * - Celebratory, motivational tone throughout
 */

export default function Home() {
  const [appState, setAppState] = useState<"landing" | "name-entry" | "quiz" | "results" | "leaderboard">("landing");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | string | null)[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [scoreResult, setScoreResult] = useState<ScoreResult | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [secondTries, setSecondTries] = useState<Set<number>>(new Set()); // Track which questions used second try
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [hasActiveProgress, setHasActiveProgress] = useState(false);

  // Check for active quiz progress on mount
  useEffect(() => {
    const activeProgress = hasActiveQuizProgress();
    setHasActiveProgress(activeProgress);
  }, []);

  // Initialize quiz with name
  const startQuizWithName = (first: string, last: string) => {
    setFirstName(first);
    setLastName(last);
    const randomQuestions = getRandomQuestions(Infinity); // Get all questions
    setQuestions(randomQuestions);
    setAnswers(new Array(randomQuestions.length).fill(null));
    setCurrentQuestionIndex(0);
    setShowFeedback(false);
    setAppState("quiz");

    // Save initial progress
    const progress: QuizProgress = {
      firstName: first,
      lastName: last,
      startedAt: Date.now(),
      currentQuestionIndex: 0,
      answers: new Array(randomQuestions.length).fill(null),
    };
    saveQuizProgress(progress);
  };

  // Resume quiz from progress
  const resumeQuiz = () => {
    const progress = getQuizProgress();
    if (progress) {
      setFirstName(progress.firstName);
      setLastName(progress.lastName);
      const randomQuestions = getRandomQuestions(Infinity);
      setQuestions(randomQuestions);
      setAnswers(progress.answers);
      setCurrentQuestionIndex(progress.currentQuestionIndex);
      setShowFeedback(false);
      setAppState("quiz");
    }
  };

  // Handle answer selection (for multiple choice only - requires submission)
  const handleAnswer = (answer: number | string) => {
    // Don't allow changing answer if feedback is already shown
    if (showFeedback) {
      return;
    }

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Handle answer submission
  const handleSubmitAnswer = () => {
    if (answers[currentQuestionIndex] === null) {
      return; // No answer selected
    }

    const currentQuestion = questions[currentQuestionIndex];
    const userAnswer = answers[currentQuestionIndex];
    let isCorrect = false;

    if (currentQuestion.type === "multiple_choice") {
      isCorrect = userAnswer === currentQuestion.correctAnswer;
    }

    // Show feedback if incorrect
    if (!isCorrect) {
      setShowFeedback(true);
      return; // Don't advance yet
    }

    // Only auto-advance for multiple choice if correct
    if (questions[currentQuestionIndex].type === "multiple_choice") {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setShowFeedback(false);
        setSecondTries(new Set()); // Reset second tries for new question

        // Save progress
        const newAnswersArray = [...answers];
        const progress: QuizProgress = {
          firstName,
          lastName,
          startedAt: Date.now(),
          currentQuestionIndex: currentQuestionIndex + 1,
          answers: newAnswersArray,
        };
        saveQuizProgress(progress);
      } else {
        // Quiz complete
        const result = calculateScore(questions, answers);
        setScoreResult(result);
        setAppState("results");

        // Save result to leaderboard
        const quizResult = {
          id: nanoid(),
          firstName,
          lastName,
          score: result.score,
          maxScore: result.maxScore,
          percentage: result.percentage,
          rank: result.rank,
          completedAt: Date.now(),
        };
        saveQuizResult(quizResult);
        clearQuizProgress();
      }
    }
  };

  // Handle second try for incorrect answer
  const handleSecondTry = () => {
    setShowFeedback(false);
    setSecondTries((prev) => new Set(prev).add(currentQuestionIndex));
    // Clear answer to allow retry
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = null;
    setAnswers(newAnswers);
  };

  // Handle text answer change (doesn't auto-advance)
  const handleTextAnswer = (answer: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answer;
    setAnswers(newAnswers);
  };

  // Handle skipping to next question
  const handleNext = () => {
    setShowFeedback(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);

      // Save progress
      const progress: QuizProgress = {
        firstName,
        lastName,
        startedAt: Date.now(),
        currentQuestionIndex: currentQuestionIndex + 1,
        answers,
      };
      saveQuizProgress(progress);
    }
  };

  // Handle going back to previous question
  const handlePrevious = () => {
    setShowFeedback(false);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle finishing quiz
  const handleFinish = () => {
    const result = calculateScore(questions, answers);
    setScoreResult(result);
    setAppState("results");

    // Save result to leaderboard
    const quizResult = {
      id: nanoid(),
      firstName,
      lastName,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      rank: result.rank,
      completedAt: Date.now(),
    };
    saveQuizResult(quizResult);
    clearQuizProgress();
  };

  // Handle retaking quiz
  const handleRetakeQuiz = () => {
    setAppState("landing");
    setCurrentQuestionIndex(0);
    setAnswers([]);
    setScoreResult(null);
    setFirstName("");
    setLastName("");
    clearQuizProgress();
  };

  // Handle going to leaderboard
  const handleViewLeaderboard = () => {
    setAppState("leaderboard");
  };

  // Handle returning from leaderboard
  const handleReturnHome = () => {
    setAppState("landing");
  };

  if (appState === "landing") {
    return <LandingPage onStart={() => setAppState("name-entry")} onLeaderboard={handleViewLeaderboard} hasActiveProgress={hasActiveProgress} onResume={resumeQuiz} />;
  }

  if (appState === "name-entry") {
    return (
      <NameEntry
        onStart={startQuizWithName}
        onCancel={() => setAppState("landing")}
      />
    );
  }

  if (appState === "quiz" && questions.length > 0) {
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
        showFeedback={showFeedback}
        onSubmitAnswer={handleSubmitAnswer}
        onSecondTry={handleSecondTry}
        hasUsedSecondTry={secondTries.has(currentQuestionIndex)}
      />
    );
  }

  if (appState === "results" && scoreResult) {
    return (
      <ResultsContainer
        scoreResult={scoreResult}
        onRetake={handleRetakeQuiz}
        onLeaderboard={handleViewLeaderboard}
      />
    );
  }

  if (appState === "leaderboard") {
    return <Leaderboard onReturnHome={handleReturnHome} />;
  }

  return null;
}

function LandingPage({
  onStart,
  onLeaderboard,
  hasActiveProgress,
  onResume,
}: {
  onStart: () => void;
  onLeaderboard: () => void;
  hasActiveProgress: boolean;
  onResume: () => void;
}) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <div
        className="relative w-full h-screen bg-cover bg-center flex items-center justify-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=1200&h=600&fit=crop')`,
          backgroundBlendMode: "overlay",
          backgroundColor: "rgba(214, 35, 0, 0.5)",
        }}
      >
        <div className="text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4" style={{ fontFamily: "Playfair Display" }}>
            CFA Employee Excellence Quiz
          </h1>
          <p className="text-2xl mb-4">Test Your Knowledge. Prove Your Expertise.</p>
          <p className="text-lg mb-8">
            All questions to gauge your mastery of Chick-fil-A operations and values
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Button
              onClick={onStart}
              className="bg-white text-[#d62300] hover:bg-gray-100 px-8 py-3 font-bold text-lg"
            >
              Start Quiz
            </Button>
            <Button
              onClick={onLeaderboard}
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-[#d62300] px-8 py-3 font-bold text-lg"
            >
              View Leaderboard
            </Button>
          </div>

          {hasActiveProgress && (
            <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900/30 bg-opacity-90 rounded-lg inline-block">
              <p className="text-yellow-900 dark:text-yellow-200 font-semibold mb-2">
                You have an active quiz in progress
              </p>
              <Button
                onClick={onResume}
                className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-2 font-bold"
              >
                Resume Quiz
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
