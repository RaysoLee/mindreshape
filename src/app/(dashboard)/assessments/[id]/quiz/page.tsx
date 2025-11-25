"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { QuestionCard } from "@/components/assessments/question-card";

interface Question {
  id: string;
  question_text: string;
  type: string;
  order_num: number;
  options: {
    id: string;
    option_text: string;
    order_num: number;
  }[];
}

export default function QuizPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    initializeQuiz();
  }, []);

  const initializeQuiz = async () => {
    try {
      // 获取用户
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      // 获取题目
      const { data: questionsData, error: questionsError } = await supabase
        .from("questions")
        .select(
          `
          id,
          question_text,
          type,
          order_num,
          question_options (
            id,
            option_text,
            order_num
          )
        `
        )
        .eq("assessment_id", params.id)
        .order("order_num", { ascending: true });

      if (questionsError) throw questionsError;

      // 转换数据格式
      const formattedQuestions = questionsData.map((q: any) => ({
        id: q.id,
        question_text: q.question_text,
        type: q.type,
        order_num: q.order_num,
        options: q.question_options.sort(
          (a: any, b: any) => a.order_num - b.order_num
        ),
      }));

      setQuestions(formattedQuestions);

      // 检查是否有进行中的会话
      const { data: existingSession } = await supabase
        .from("user_assessment_sessions")
        .select("*")
        .eq("assessment_id", params.id)
        .eq("user_id", user.id)
        .eq("status", "in_progress")
        .single();

      if (existingSession) {
        setSessionId(existingSession.id);

        // 加载已保存的答案
        const { data: savedAnswers } = await supabase
          .from("user_answers")
          .select("question_id, answer_data")
          .eq("session_id", existingSession.id);

        if (savedAnswers) {
          const answersMap: Record<string, string[]> = {};
          savedAnswers.forEach((answer) => {
            answersMap[answer.question_id] = answer.answer_data.option_ids || [];
          });
          setAnswers(answersMap);
        }
      } else {
        // 创建新会话
        const { data: newSession, error: sessionError } = await supabase
          .from("user_assessment_sessions")
          .insert({
            user_id: user.id,
            assessment_id: params.id,
            status: "in_progress",
          })
          .select()
          .single();

        if (sessionError) throw sessionError;
        setSessionId(newSession.id);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error initializing quiz:", error);
      alert("加载测试失败，请重试");
      router.push(`/assessments/${params.id}`);
    }
  };

  const handleAnswer = async (questionId: string, optionIds: string[]) => {
    if (!sessionId) return;

    // 更新本地状态
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIds,
    }));

    // 保存到数据库
    try {
      await supabase.from("user_answers").upsert(
        {
          session_id: sessionId,
          question_id: questionId,
          answer_data: { option_ids: optionIds },
        },
        {
          onConflict: "session_id,question_id",
        }
      );
    } catch (error) {
      console.error("Error saving answer:", error);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    // 检查是否所有题目都已回答
    const unansweredCount = questions.filter(
      (q) => !answers[q.id] || answers[q.id].length === 0
    ).length;

    if (unansweredCount > 0) {
      const confirmed = window.confirm(
        `还有 ${unansweredCount} 道题未作答，确定要提交吗？`
      );
      if (!confirmed) return;
    }

    setSubmitting(true);

    try {
      // 更新会话状态为已完成
      await supabase
        .from("user_assessment_sessions")
        .update({
          status: "completed",
          completed_at: new Date().toISOString(),
        })
        .eq("id", sessionId);

      // 计算分数（这里简化处理，实际应该在服务端计算）
      let totalScore = 0;
      let maxScore = 0;
      const dimensionScores: Record<string, number> = {};

      for (const question of questions) {
        const selectedOptionIds = answers[question.id] || [];

        for (const optionId of selectedOptionIds) {
          // 获取选项信息来计算分数
          const { data: optionData } = await supabase
            .from("question_options")
            .select("score, dimension")
            .eq("id", optionId)
            .single();

          if (optionData) {
            totalScore += optionData.score || 0;

            if (optionData.dimension) {
              dimensionScores[optionData.dimension] =
                (dimensionScores[optionData.dimension] || 0) +
                (optionData.score || 0);
            }
          }
        }

        // 计算最大可能分数
        const { data: maxOption } = await supabase
          .from("question_options")
          .select("score")
          .eq("question_id", question.id)
          .order("score", { ascending: false })
          .limit(1)
          .single();

        if (maxOption) {
          maxScore += maxOption.score || 0;
        }
      }

      // 获取用户信息
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 保存结果
      await supabase.from("assessment_results").insert({
        session_id: sessionId,
        user_id: user?.id,
        assessment_id: params.id,
        total_score: totalScore,
        max_score: maxScore,
        dimension_scores: dimensionScores,
      });

      // 跳转到结果页面
      router.push(`/assessments/${params.id}/results/${sessionId}`);
    } catch (error) {
      console.error("Error submitting quiz:", error);
      alert("提交失败，请重试");
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">暂无题目</p>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">
              题目 {currentQuestionIndex + 1} / {questions.length}
            </span>
            <span className="text-sm text-gray-600">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8 max-w-3xl">
        <QuestionCard
          question={currentQuestion}
          selectedOptions={answers[currentQuestion.id] || []}
          onAnswer={(optionIds) => handleAnswer(currentQuestion.id, optionIds)}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
          >
            上一题
          </Button>

          <div className="flex gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-8 h-8 rounded-full text-xs font-medium transition-colors ${
                  index === currentQuestionIndex
                    ? "bg-primary text-white"
                    : answers[questions[index].id]?.length > 0
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === questions.length - 1 ? (
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? "提交中..." : "提交测试"}
            </Button>
          ) : (
            <Button onClick={handleNext}>下一题</Button>
          )}
        </div>
      </main>
    </div>
  );
}
