import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { type ScoreResult } from "@/lib/quizUtils";
import { ChevronDown, ChevronUp, Check, X } from "lucide-react";

interface ResultsContainerProps {
  scoreResult: ScoreResult;
  onRetake: () => void;
}

/**
 * Results Container Component
 * Design: Celebratory, motivational results display
 * - Large rank display with color-coded styling
 * - Percentage score with visual emphasis
 * - Detailed answer review with correct/incorrect indicators
 * - Rank progression visualization
 */

export function ResultsContainer({ scoreResult, onRetake }: ResultsContainerProps) {
  const [expandedAnswers, setExpandedAnswers] = useState<Set<number>>(new Set());

  const toggleAnswerExpand = (questionId: number) => {
    const newExpanded = new Set(expandedAnswers);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedAnswers(newExpanded);
  };

  // Determine rank styling
  const getRankStyle = (rank: string) => {
    switch (rank) {
      case "In Training":
        return { bg: "bg-green-500", text: "text-green-600" };
      case "Team Member":
        return { bg: "bg-red-500", text: "text-red-600" };
      case "Trainer":
        return { bg: "bg-orange-500", text: "text-orange-600" };
      case "Team Leader":
        return { bg: "bg-red-700", text: "text-red-700", pattern: "striped-red" };
      case "Shift Leader":
        return { bg: "bg-blue-700", text: "text-blue-700", pattern: "striped-blue" };
      case "Coordinator":
        return { bg: "bg-gray-700", text: "text-gray-700" };
      case "Director":
        return { bg: "bg-black", text: "text-black" };
      case "Operator":
        return { bg: "bg-yellow-400", text: "text-yellow-600", glow: true };
      default:
        return { bg: "bg-gray-500", text: "text-gray-600" };
    }
  };

  const rankStyle = getRankStyle(scoreResult.rank);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Results Section */}
      <div
        className="relative w-full bg-cover bg-center py-20 px-4"
        style={{
          backgroundImage:
            "url('https://d2xsxph8kpxj0f.cloudfront.net/310519663551914781/dnLoL6oxhAMfsN3ckdnPtw/cfa-results-celebration-ZCDqYqb3huzpYBuDKSG6wR.webp')",
          backgroundPosition: "center",
        }}
      >
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30"></div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Quiz Complete!</h1>
          <p className="text-xl md:text-2xl mb-8">Here are your results</p>
        </div>
      </div>

      {/* Results Cards Section */}
      <div className="bg-gray-50 py-12 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Main Score Card */}
          <Card className="p-8 mb-8 shadow-xl border-0">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Score Display */}
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">Your Score</p>
                <div className="text-6xl font-bold text-[#d62300] mb-2">
                  {scoreResult.percentage}%
                </div>
                <p className="text-gray-600 text-sm">
                  {scoreResult.score} / {scoreResult.maxScore} Points
                </p>
              </div>

              {/* Rank Display */}
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-4">Your Rank</p>
                <div
                  className={`inline-block px-8 py-6 rounded-xl font-bold text-3xl mb-4 ${
                    rankStyle.glow
                      ? "bg-gradient-to-r from-yellow-300 to-yellow-500 text-gray-900 shadow-2xl"
                      : rankStyle.pattern === "striped-red"
                        ? "bg-red-700 text-white"
                        : rankStyle.pattern === "striped-blue"
                          ? "bg-blue-700 text-white"
                          : `${rankStyle.bg} text-white`
                  }`}
                  style={
                    rankStyle.glow
                      ? {
                          boxShadow: "0 0 30px rgba(251, 191, 36, 0.6), inset 0 1px 0 rgba(255,255,255,0.2)",
                        }
                      : {}
                  }
                >
                  {scoreResult.rank}
                </div>
                <p className="text-gray-600">
                  {getRankDescription(scoreResult.rank)}
                </p>
              </div>
            </div>
          </Card>



          {/* Answer Review */}
          <Card className="p-8 mb-8 shadow-lg border-0">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Answer Review</h2>
            <div className="space-y-3">
              {scoreResult.details.map((detail, index) => (
                <div key={detail.questionId} className="border border-gray-200 rounded-lg">
                  <button
                    onClick={() => toggleAnswerExpand(detail.questionId)}
                    className="w-full p-4 flex items-start justify-between hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-4 flex-1">
                      <div
                        className={`mt-1 flex-shrink-0 ${
                          detail.isCorrect ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {detail.isCorrect ? <Check size={20} /> : <X size={20} />}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-semibold text-gray-800">
                          Question {index + 1}
                        </p>
                        <p className="text-gray-600 text-sm mt-1">{detail.question}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-gray-400">
                      {expandedAnswers.has(detail.questionId) ? (
                        <ChevronUp size={20} />
                      ) : (
                        <ChevronDown size={20} />
                      )}
                    </div>
                  </button>

                  {expandedAnswers.has(detail.questionId) && (
                    <div className="px-4 pb-4 border-t border-gray-200 bg-gray-50">
                      <div className="mt-4 space-y-3">
                        <div>
                          <p className="text-sm font-semibold text-gray-600">Your Answer:</p>
                          <p
                            className={`text-sm mt-1 p-2 rounded ${
                              detail.isCorrect
                                ? "bg-green-50 text-green-700"
                                : "bg-red-50 text-red-700"
                            }`}
                          >
                            {detail.userAnswer || "(No answer provided)"}
                          </p>
                        </div>
                        {!detail.isCorrect && (
                          <div>
                            <p className="text-sm font-semibold text-gray-600">Correct Answer:</p>
                            <p className="text-sm mt-1 p-2 rounded bg-green-50 text-green-700">
                              {detail.correctAnswer}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center mb-8">
            <Button
              onClick={onRetake}
              className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-3 font-bold text-lg"
            >
              Retake Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function getRankDescription(rank: string): string {
  const descriptions: Record<string, string> = {
    "In Training": "You're just getting started. Keep learning!",
    "Team Member": "You have foundational knowledge. Study more to advance.",
    "Trainer": "You're on the right track. A bit more practice needed.",
    "Team Leader": "You're demonstrating solid expertise.",
    "Shift Leader": "You're showing strong leadership knowledge.",
    "Coordinator": "You're an expert in CFA operations.",
    "Director": "You're at the top of your game.",
    "Operator": "🎉 Perfect Score! You're a CFA Master! 🎉",
  };
  return descriptions[rank] || "Great job!";
}
