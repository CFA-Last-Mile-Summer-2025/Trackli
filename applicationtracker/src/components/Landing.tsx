import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import gradientBg from "@/assets/gradientBg.svg";
import { Briefcase, Search, Sparkles } from "lucide-react";


export default function Landing() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="font-sans text-white antialiased min-h-screen">
      {/* Navbar */}
      <header
        className={`fixed w-full z-40 top-0 left-0 transition-all duration-300 ${
          isScrolled
            ? "bg-white/10 backdrop-blur-md shadow-sm"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight">trackli</div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-white/80 hidden sm:inline">
              Already have an account?
            </span>
            <Link
              to="/signup"
              className="px-4 py-2 rounded-md bg-white/20 hover:bg-white/30 transition-colors"
            >
              Log In
            </Link>
          </div>
        </div>
      </header>

        {/* Hero */}
        <section className="relative overflow-hidden min-h-screen flex items-center">
          {/* Background */}
          <div
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${gradientBg})` }}
          />
          <div className="absolute inset-0 bg-black/20" />

          {/* Hero content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-3 drop-shadow-[0_6px_18px_rgba(0,0,0,0.35)]">
              trackli
            </h1>
            <p className="text-lg md:text-xl text-white/90 font-medium mb-6">
              Application Tracking Made Simple
            </p>
            <p className="mx-auto max-w-2xl text-sm md:text-base text-white/80 mb-8">
              Transform your job search with AI-powered resume optimization,
              intelligent application tracking, and seamless workflow
              management. Track every application from discovery to offer.
            </p>
            <button className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm transition text-sm font-semibold">
              Explore Features
            </button>
            <div className="mt-8 text-sm text-white/60">↓ Scroll to explore</div>
          </div>
</section>
      {/* Features Section */}
      <section className="bg-gradient-to-b from-[#5b5dc0] to-[#524b88] py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h3 className="text-center text-2xl font-bold mb-12">
            Powerful Features for Job Seekers
          </h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-2">Smart Job Tracking</h4>
              <p className="text-gray-300 text-sm">
                Organize applications with list and progress views. Track each
                job from application to interview with various status tags.
              </p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-2">AI Resume Builder</h4>
              <p className="text-gray-300 text-sm">Filler description</p>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 shadow-lg">
              <h4 className="font-semibold mb-2">Job Discovery</h4>
              <p className="text-gray-300 text-sm">Filler description</p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="bg-gradient-to-b from-[#524b88] to-[#4b4477] py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-center text-2xl font-bold mb-12">
            Your Job Search Workflow
          </h3>
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-xl font-bold">1</p>
              <p className="text-gray-300 text-sm">
                Find relevant jobs through our listings
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">2</p>
              <p className="text-gray-300 text-sm">
                Use AI to help you create a resume if you don’t already have one
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">3</p>
              <p className="text-gray-300 text-sm">
                Submit applications and easily track them in your pipeline
              </p>
            </div>
            <div>
              <p className="text-xl font-bold">4</p>
              <p className="text-gray-300 text-sm">
                Monitor progress through interviews to offers with visual
                dashboards
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-b from-[#4b4477] to-[#3b345f] py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Transform Your Job Search?
          </h3>
          <p className="text-gray-300 mb-8">
            Apply smarter not harder, with a little help from us :)
          </p>
          <Link to="/signup" className="px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md transition">
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#3b345f] text-center py-6 text-gray-400 text-sm">
        © 2025 trackli
      </footer>
    </div>
  );
}