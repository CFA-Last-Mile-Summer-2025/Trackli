import React from 'react';
import herobg from '@/assets/herobg.png';
import landingimg from '@/assets/landingimg.png';
import workflowbg from '@/assets/workflowbg.png';
import { BotIcon, ChartBarBig, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const TrackliLanding: React.FC = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative min-h-screen bg-no-repeat bg-cover bg-center"
            style={{ backgroundImage: `url(${herobg})` }}>
        <div className="absolute top-0 left-0 right-0 flex justify-end items-center p-6 mt-5 mr-5">
          <div className="text-white text-md mr-5">Already have an account?</div>
          <Link to="/signup" className="bg-white backdrop-blur-sm text-secondary-foreground text-bold px-10 py-2 rounded-full border border-white/30 hover:bg-white/75 transition-colors shadow-lg">
            Log In
          </Link>
        </div>
        <div className="flex items-center justify-left min-h-screen pl-20">
          <div className="max-w-2xl text-left text-white">
            <h1 className="text-9xl font-dm-serif mb-8 italic">trackli</h1>
            <p className="text-2xl leading-relaxed mb-8 opacity-90">
              Transform your job search with AI-powered resume <br/>
              optimization, intelligent application tracking, and seamless <br/> 
              workflow management. Track every application <br/>
              from discovery to offer.
            </p>
          <Link to="/signup" className="bg-white backdrop-blur-sm text-secondary-foreground text-bold px-5 py-3 rounded-full border border-white/30 hover:bg-white/75 transition-colors shadow-lg">
            Get Started
          </Link>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto text-secondary-foreground">
          <h2 className="text-4xl font-light text-center mb-16 italic font-dm-serif">
            Ready to Transform Your Job Search?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              {/* Make into component for landing page */}
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#8B7EC8] to-[#C8A8E9]">
                <ChartBarBig color='white'/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Smart Job Tracking</h3>
              <p className="text-gray-600 leading-relaxed">
                Organize applications with full and integrated workflow. Track each job from application to interview with various status indicators.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#8B7EC8] to-[#C8A8E9]">
                <BotIcon color='white'/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">AI Resume Builder</h3>
              <p className="text-gray-600 leading-relaxed">
                Use AI to help you create a resume if you don't already have one. Get professional, tailored resumes in minutes.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 bg-gradient-to-br from-[#8B7EC8] to-[#C8A8E9]">
                <Search color='white'/>
              </div>
              <h3 className="text-2xl font-semibold mb-4">Job Discovery</h3>
              <p className="text-gray-600 leading-relaxed">
                Find relevant opportunities based on your skills and preferences. Never miss the perfect job match again.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-light font-dm-serif text-secondary-foreground mb-6 italic">
                Perfect Your Resume with AI
              </h2>
              <p className="text-gray-600 leading-relaxed mb-8">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
          <Link to="/resumebuilder" className="bg-secondary-foreground backdrop-blur-sm text-secondary-foreground text-bold text-white px-5 py-3 rounded-full border border-secondary-foreground/30 hover:bg-secondary-foreground/75 transition-colors shadow-lg">
            Try Resume Builder
          </Link>
            </div>
            <div className="lg:pl-12">
              <img src={landingimg} alt="Person holding a laptop" className="w-full h-auto rounded-lg shadow-lg" />
            </div>
          </div>
        </div>
      </div>

      <div className="py-20 w-full items-center  bg-gradient-to-br from-[#8B7EC8] to-[#C8A8E9]">

        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-light font-dm-serif text-center text-white mb-16 italic">
            Your Job Search Workflow
          </h2>
          
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-secondary-foreground">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Discover</h3>
              <p className="text-md opacity-90 leading-relaxed">
                Find relevant jobs through our listings and recommendations.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-secondary-foreground">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Optimize</h3>
              <p className="text-md opacity-90 leading-relaxed">
                Use AI to help you create a resume if you don't have one yet from scratch.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-secondary-foreground">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Apply</h3>
              <p className="text-md opacity-90 leading-relaxed">
                Submit applications and keep track to avoid missing deadlines.
              </p>
            </div>

            <div className="text-center text-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-3xl font-bold text-secondary-foreground">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-4">Track</h3>
              <p className="text-md opacity-90 leading-relaxed">
                Monitor progress through intelligent automation to reach your dream interview.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="py-35 bg-gradient-to-br from-[#8B7EC8] via-[#8B7EC8] to-[#C8A8E9]">
        <div className="mx-w-4xl mx-auto text-center text-white">
          <h2 className="text-5xl mb-6 font-dm-serif">
            START YOUR SUCCESS STORY TODAY!
          </h2>
          <p className="text-2xl mb-8 opacity-90">
            Work smarter not harder, with a little help from us :)
          </p>
          <Link to="/signup" className="bg-white backdrop-blur-sm text-secondary-foreground text-bold px-5 py-3 rounded-full border border-white/30 hover:bg-white/75 transition-colors shadow-lg">
            Get Started
          </Link>
        </div>
      </div>

      <div className="py-6 px-6 bg-[#6E5E99] text-center">
        <p className="text-white text-md">© 2025 trackli</p>
      </div>
    </div>
  );
};

export default TrackliLanding;