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
}

/**
 * Quiz Container Component
 * Design: Clean, focused interface with clear question hierarchy
 * - Progress bar at top showing quiz progress
 * - Large, readable question text
 * - Clear answer options (multiple choice or text input)
 * - Navigation buttons for moving through questions
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
}: QuizContainerProps) {
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const isAnswered = currentAnswer !== null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header with progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-3">
            <h1 className="text-2xl font-bold text-gray-800">CFA Employee Quiz</h1>
            <span className="text-lg font-semibold text-[#d62300]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-lg border-0">
          {/* Question Text */}
          <h2 className="text-2xl font-bold text-gray-800 mb-8 leading-tight">
            {currentQuestion.question}
          </h2>

          {/* Answer Options */}
          <div className="mb-8">
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
                        className="text-lg cursor-pointer flex-1 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors"
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
                  className="text-lg p-4 border-2 border-gray-300 rounded-lg focus:border-[#d62300] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-4 justify-between">
            <Button
              onClick={onPrevious}
              disabled={currentQuestionIndex === 0}
              variant="outline"
              className="px-6 py-2"
            >
              ← Previous
            </Button>

            <div className="flex gap-3">
              {!isLastQuestion ? (
                <Button
                  onClick={onNext}
                  variant="outline"
                  className="px-6 py-2"
                >
                  Skip →
                </Button>
              ) : null}

              {isLastQuestion ? (
                <Button
                  onClick={onFinish}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Submit Quiz
                </Button>
              ) : (
                <Button
                  onClick={onNext}
                  disabled={!isAnswered}
                  className="bg-[#d62300] hover:bg-[#c41e00] text-white px-8 py-2 font-bold"
                >
                  Next →
                </Button>
              )}
            </div>
          </div>
        </Card>

        {/* Question Navigator */}
        <Card className="p-6 shadow-lg border-0">
          <h3 className="text-sm font-bold text-gray-600 mb-4 uppercase">Quick Navigation</h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  // This would require additional state management in parent
                }}
                className={`w-full aspect-square rounded text-xs font-bold transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-[#d62300] text-white"
                    : answers[index] !== null
                      ? "bg-blue-900 text-white"
                      : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                }`}
                title={`Question ${index + 1}`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
