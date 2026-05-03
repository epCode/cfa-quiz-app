import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { type Question } from "@/lib/quizUtils";

interface QuizContainerProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: (number | string | null)[];
  onAnswer: (answer: number | string) => void;
  onTextAnswer: (answer: string) => void;
  onNext: () => void;
  onPrevious: () => void;
  onFinish: () => void;
  showFeedback: boolean;
  onSubmitAnswer: () => void;
  onSecondTry: () => void;
  hasUsedSecondTry: boolean;
}

/**
 * Quiz Container Component
 * Design: Clean, focused interface with clear question hierarchy
 * - Progress bar at top showing quiz progress
 * - Large, readable question text with points display
 * - Clear answer options (multiple choice or text input)
 * - Submission button for multiple choice (no auto-advance)
 * - Second try option for half points
 */

export function QuizContainer({
  questions,
  currentQuestionIndex,
  answers,
  onAnswer,
  onTextAnswer,
  onNext,
  onPrevious,
  onFinish,
  showFeedback,
  onSubmitAnswer,
  onSecondTry,
  hasUsedSecondTry,
}: QuizContainerProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = currentAnswer !== null;
  const pointsValue = hasUsedSecondTry ? Math.floor(currentQuestion.weight / 2) : currentQuestion.weight;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">CFA Employee Quiz</h1>
            <span className="text-lg font-semibold text-[#d62300]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-lg border-0 bg-white dark:bg-gray-800">
          {/* Question Text with Points */}
          <div className="flex justify-between items-start mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white leading-tight flex-1">
              {currentQuestion.question}
            </h2>
            <div className="ml-4 text-right">
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Points</p>
              <p className="text-3xl font-bold text-[#d62300]">
                {pointsValue}
              </p>
              {hasUsedSecondTry && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">(Second try)</p>
              )}
            </div>
          </div>

          {/* Answer Options */}
          <div className="mb-8">
            {showFeedback && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-300 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400 font-semibold mb-2">❌ Incorrect</p>
                <p className="text-red-600 dark:text-red-300">
                  <span className="font-semibold">Correct answer:</span>{" "}
                  {currentQuestion.type === "multiple_choice"
                    ? currentQuestion.options?.[currentQuestion.correctAnswer as number]
                    : currentQuestion.correctAnswer}
                </p>
              </div>
            )}
            <div>
              {currentQuestion.type === "multiple_choice" ? (
                <RadioGroup
                  value={currentAnswer !== null ? String(currentAnswer) : ""}
                  onValueChange={(value) => onAnswer(parseInt(value))}
                >
                  <div className="space-y-4">
                    {currentQuestion.options?.map((option, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <RadioGroupItem value={String(index)} id={`option-${index}`} />
                        <Label
                          htmlFor={`option-${index}`}
                          className="text-lg cursor-pointer flex-1 py-2 px-4 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
                        >
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              ) : (
                <div>
                  <Input
                    type="text"
                    placeholder="Type your answer here..."
                    value={currentAnswer || ""}
                    onChange={(e) => onTextAnswer(e.target.value)}
                    className="text-lg p-4 border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-[#d62300] focus:outline-none bg-white dark:bg-gray-700 text-gray-800 dark:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between flex-wrap">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="px-6 py-2"
            >
              ← Previous
            </Button>

            <div className="flex gap-3 flex-wrap">
              {/* Submit button for multiple choice */}
              {currentQuestion.type === "multiple_choice" && !showFeedback ? (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Submit
                </Button>
              ) : null}

              {/* Skip button for text questions */}
              {!isLastQuestion && !showFeedback && currentQuestion.type !== "multiple_choice" ? (
                <Button
                  onClick={onNext}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Skip →
                </Button>
              ) : null}


              {/* Continue button after feedback */}
              {showFeedback && !isLastQuestion && (
                <Button
                  onClick={onNext}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Continue →
                </Button>
              )}

              {/* Submit/Next buttons for last question */}
              {isLastQuestion && currentQuestion.type === "multiple_choice" && !showFeedback ? (
                <Button
                  onClick={onSubmitAnswer}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Submit Answer
                </Button>
              ) : isLastQuestion && currentQuestion.type !== "multiple_choice" && !showFeedback ? (
                <Button
                  onClick={onFinish}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Submit Quiz
                </Button>
              ) : !showFeedback && currentQuestion.type !== "multiple_choice" ? (
                <Button
                  onClick={onNext}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Next →
                </Button>
              ) : isLastQuestion && showFeedback ? (
                <Button
                  onClick={onFinish}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Submit Quiz
                </Button>
              ) : null}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
