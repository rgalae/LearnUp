import FeatureCard from "../../components/ui/FeatureCard";

function Home() {
  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-hidden">
      <section className="relative px-6 py-32 max-w-7xl mx-auto text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.15),transparent_40%)]" />

        <div className="relative z-10">
          <p className="text-indigo-400 mb-6 uppercase tracking-[0.2em] text-sm">
            Modern Learning Platform
          </p>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight max-w-5xl mx-auto">
            Learn Smarter.
            <br />
            Grow Faster.
          </h1>

          <p className="text-gray-400 text-lg mt-8 max-w-2xl mx-auto leading-relaxed">
            LearnUp helps students access premium courses, quizzes, dashboards
            and learning experiences in one modern platform.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="px-8 py-4 rounded-2xl bg-indigo-500 hover:bg-indigo-400 transition-all font-semibold">
              Get Started
            </button>

            <button className="px-8 py-4 rounded-2xl border border-white/10 hover:border-indigo-400 transition-all">
              Explore Courses
            </button>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-8">
        <FeatureCard
          title="Interactive Courses"
          description="Premium course experiences with structured lessons and progress tracking."
        />

        <FeatureCard
          title="Smart Quizzes"
          description="Challenge yourself with interactive quizzes and real-time scoring."
        />

        <FeatureCard
          title="Student Dashboard"
          description="Track your learning journey with elegant dashboards and analytics."
        />
      </section>
    </div>
  );
}

export default Home;
