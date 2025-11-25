"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface QuestionOption {
  id: string;
  option_text: string;
  order_num: number;
}

interface Question {
  id: string;
  question_text: string;
  type: string;
  order_num: number;
  options: QuestionOption[];
}

interface QuestionCardProps {
  question: Question;
  selectedOptions: string[];
  onAnswer: (optionIds: string[]) => void;
}

export function QuestionCard({
  question,
  selectedOptions,
  onAnswer,
}: QuestionCardProps) {
  const handleOptionClick = (optionId: string) => {
    if (question.type === "single") {
      // 单选题：直接替换
      onAnswer([optionId]);
    } else if (question.type === "multiple") {
      // 多选题：切换选中状态
      if (selectedOptions.includes(optionId)) {
        onAnswer(selectedOptions.filter((id) => id !== optionId));
      } else {
        onAnswer([...selectedOptions, optionId]);
      }
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl">{question.question_text}</CardTitle>
        {question.type === "multiple" && (
          <p className="text-sm text-gray-500 mt-2">多选题（可选择多个答案）</p>
        )}
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => {
            const isSelected = selectedOptions.includes(option.id);

            return (
              <button
                key={option.id}
                onClick={() => handleOptionClick(option.id)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-start">
                  {/* 选择指示器 */}
                  <div className="flex-shrink-0 mr-3 mt-0.5">
                    {question.type === "single" ? (
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2 h-2 rounded-full bg-white"></div>
                        )}
                      </div>
                    ) : (
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                          isSelected
                            ? "border-primary bg-primary"
                            : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <svg
                            className="w-3 h-3 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={3}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 选项文本 */}
                  <div className="flex-1">
                    <p
                      className={`text-base ${
                        isSelected ? "text-primary font-medium" : "text-gray-700"
                      }`}
                    >
                      {option.option_text}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
