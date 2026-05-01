import questionsData from "@/data/questions.json";

export interface Question {
  id: number;
  question: string;
  type: "multiple_choice" | "text";
  weight: number;
  options?: string[];
  correctAnswer: number | string;
  caseSensitive?: boolean;
}

export interface QuizState {
  currentQuestionIndex: number;
  answers: (number | string | null)[];
  isComplete: boolean;
}

export interface ScoreResult {
  score: number;
  maxScore: number;
  percentage: number;
  rank: string;
  rankColor: string;
  correctCount: number;
  totalCount: number;
  details: AnswerDetail[];
}

export interface AnswerDetail {
  questionId: number;
  question: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  weight: number;
  type: "multiple_choice" | "text";
}

const RANK_CONFIG = [
  { min: 0, max: 20, name: "In Training", color: "#22c55e" },
  { min: 21, max: 45, name: "Team Member", color: "#ef4444" },
  { min: 46, max: 59, name: "Trainer", color: "#f97316" },
  { min: 60, max: 70, name: "Team Leader", color: "#dc2626" },
  { min: 71, max: 84, name: "Shift Leader", color: "#2563eb" },
  { min: 85, max: 96, name: "Coordinator", color: "#374151" },
  { min: 97, max: 98, name: "Director", color: "#000000" },
  { min: 100, max: 100, name: "Operator", color: "#fbbf24" },
];

export function getRandomQuestions(count: number): Question[] {
  const allQuestions = questionsData.questions as Question[];
  const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, allQuestions.length));
}

export function calculateScore(
  questions: Question[],
  answers: (number | string | null)[]
): ScoreResult {
  let totalScore = 0;
  let maxScore = 0;
  let correctCount = 0;
  const details: AnswerDetail[] = [];

  questions.forEach((question, index) => {
    const userAnswer = answers[index];
    const weight = question.weight || 1;
    maxScore += weight;

    let isCorrect = false;
    let correctAnswerStr = "";
    let userAnswerStr = "";

    if (question.type === "multiple_choice") {
      correctAnswerStr = question.options?.[question.correctAnswer as number] || "";
      userAnswerStr = userAnswer !== null ? (question.options?.[userAnswer as number] || "") : "";
      isCorrect = userAnswer === question.correctAnswer;
    } else {
      correctAnswerStr = String(question.correctAnswer);
      userAnswerStr = String(userAnswer || "");

      if (question.caseSensitive === false) {
        isCorrect = userAnswerStr.toLowerCase().trim() === correctAnswerStr.toLowerCase().trim();
      } else {
        isCorrect = userAnswerStr.trim() === correctAnswerStr.trim();
      }
    }

    if (isCorrect) {
      totalScore += weight;
      correctCount++;
    }

    details.push({
      questionId: question.id,
      question: question.question,
      userAnswer: userAnswerStr,
      correctAnswer: correctAnswerStr,
      isCorrect,
      weight,
      type: question.type,
    });
  });

  const percentage = Math.round((totalScore / maxScore) * 100);
  const rankConfig = RANK_CONFIG.find((r) => percentage >= r.min && percentage <= r.max);

  return {
    score: totalScore,
    maxScore,
    percentage,
    rank: rankConfig?.name || "Unknown",
    rankColor: rankConfig?.color || "#000000",
    correctCount,
    totalCount: questions.length,
    details,
  };
}

export function getRankColor(percentage: number): string {
  const rankConfig = RANK_CONFIG.find((r) => percentage >= r.min && percentage <= r.max);
  return rankConfig?.color || "#000000";
}

export function getRankName(percentage: number): string {
  const rankConfig = RANK_CONFIG.find((r) => percentage >= r.min && percentage <= r.max);
  return rankConfig?.name || "Unknown";
}
