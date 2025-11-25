import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

// 初始化 Anthropic 客户端
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// 系统提示词
const SYSTEM_PROMPT = `你是 MindReShape 的 AI 助手，专门帮助用户探索和改善他们的思维模式。

你的核心能力：
1. 识别和解释各种认知偏差（确认偏差、可得性偏差、锚定效应等）
2. 分析用户的决策过程和思维模式
3. 提供实用的批判性思维训练建议
4. 帮助用户建立更理性、客观的思维习惯

对话风格：
- 友好、专业、富有同理心
- 使用简洁易懂的语言，避免过度学术化
- 通过提问引导用户自我反思
- 提供具体的例子和实践建议
- 鼓励用户分享真实的想法和经历

当用户提到测试结果时，基于结果数据提供个性化的分析和建议。
始终保持客观中立，不带价值判断，尊重用户的观点。`;

export async function POST(request: NextRequest) {
  try {
    const { conversationId, message, history } = await request.json();

    if (!message || !conversationId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // 验证用户
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 验证对话属于该用户
    const { data: conversation } = await supabase
      .from("chat_conversations")
      .select("*, user_id")
      .eq("id", conversationId)
      .single();

    if (!conversation || conversation.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // 获取用户的最近测试结果（用于个性化）
    const { data: recentResults } = await supabase
      .from("assessment_results")
      .select(
        `
        *,
        assessments (title)
      `
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(3);

    // 构建上下文
    let contextInfo = "";
    if (recentResults && recentResults.length > 0) {
      contextInfo = "\n\n用户的最近测试结果：\n";
      recentResults.forEach((result: any) => {
        const percentage = Math.round(
          (result.total_score / result.max_score) * 100
        );
        contextInfo += `- ${result.assessments?.title}: ${percentage}分\n`;
        if (result.dimension_scores) {
          contextInfo += `  维度: ${JSON.stringify(result.dimension_scores)}\n`;
        }
      });
    }

    // 构建消息历史
    const messages: Anthropic.MessageParam[] = [];

    // 添加历史消息（最近10条）
    const recentHistory = history?.slice(-10) || [];
    recentHistory.forEach((msg: any) => {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    // 添加当前用户消息
    messages.push({
      role: "user",
      content: message,
    });

    // 调用 Claude API
    const response = await anthropic.messages.create({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 2048,
      system: SYSTEM_PROMPT + contextInfo,
      messages: messages,
    });

    const aiMessage = response.content[0].type === "text"
      ? response.content[0].text
      : "";
    const tokens = response.usage.input_tokens + response.usage.output_tokens;

    return NextResponse.json({
      message: aiMessage,
      model: response.model,
      tokens: tokens,
    });
  } catch (error: any) {
    console.error("Error in chat API:", error);

    // 处理 Anthropic API 错误
    if (error.status === 429) {
      return NextResponse.json(
        { error: "API rate limit exceeded" },
        { status: 429 }
      );
    }

    if (error.status === 401) {
      return NextResponse.json(
        { error: "Invalid API key" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
