import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            重塑你的
            <span className="text-primary"> 思维模式</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            通过 AI 驱动的认知偏差分析与实践记录，
            <br />
            帮助你探索并建立更健康的思维方式
          </p>

          <div className="flex gap-4 justify-center">
            <Link
              href="/signup"
              className="px-8 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              开始探索
            </Link>
            <Link
              href="/login"
              className="px-8 py-4 border-2 border-primary text-primary rounded-lg font-semibold hover:bg-primary/5 transition"
            >
              登录
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">🧠</div>
            <h3 className="text-xl font-semibold mb-2">AI 偏差分析</h3>
            <p className="text-gray-600">
              智能识别你的认知偏差，提供个性化的思维重构建议
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold mb-2">科学测评</h3>
            <p className="text-gray-600">
              通过专业的心理测评，深入了解你的思维模式
            </p>
          </div>

          <div className="p-8 bg-white rounded-xl shadow-sm hover:shadow-md transition">
            <div className="text-4xl mb-4">✍️</div>
            <h3 className="text-xl font-semibold mb-2">实践追踪</h3>
            <p className="text-gray-600">
              记录你的思维转变过程，可视化你的成长轨迹
            </p>
          </div>
        </div>

        {/* Social Proof */}
        <div className="mt-20 text-center">
          <p className="text-gray-600 mb-4">已有 1,000+ 用户开始了思维探索之旅</p>
          <div className="flex justify-center gap-8 text-gray-500">
            <div>
              <div className="text-3xl font-bold text-primary">10k+</div>
              <div className="text-sm">完成测试</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">5k+</div>
              <div className="text-sm">实践记录</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">95%</div>
              <div className="text-sm">用户满意度</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t py-8 mt-20">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 MindReShape. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
