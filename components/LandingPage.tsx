import React from 'react';
import { MapPin, Bell, BrainCircuit, ChevronRight, Layout, Users, Zap, Calendar } from 'lucide-react';

interface LandingPageProps {
  onLaunch: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLaunch }) => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo(0, 0)}>
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-sm">C</div>
              <span className="font-bold text-xl tracking-tight text-slate-900">CampusSpot</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
              <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How it Works</a>
              <button 
                onClick={onLaunch}
                className="px-5 py-2.5 bg-slate-900 text-white rounded-full hover:bg-slate-800 transition-colors font-semibold shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                Launch App
              </button>
            </div>

             {/* Mobile Button Placeholder (Simple) */}
             <div className="md:hidden">
                <button onClick={onLaunch} className="text-indigo-600 font-bold text-sm">Launch</button>
             </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16 pb-24 lg:pt-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-50 via-slate-50 to-white"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm">
                <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                Now Live for Spring Semester
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
                Find your space <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">on campus.</span>
            </h1>
            
            <p className="mt-6 text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Stop wandering the halls. Locate empty classrooms, quiet study zones, and faculty offices instantly with our AI-powered campus utility.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button 
                    onClick={onLaunch}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                    Get Started Now <ChevronRight size={20} />
                </button>
                <button 
                    onClick={onLaunch}
                    className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-xl font-bold text-lg hover:bg-slate-50 transition-colors w-full sm:w-auto"
                >
                    View Demo
                </button>
            </div>

            {/* Mockup / Visual */}
            <div className="mt-16 relative mx-auto max-w-5xl">
                <div className="bg-slate-900 rounded-2xl p-2 shadow-2xl">
                    <div className="bg-slate-800 rounded-xl overflow-hidden aspect-[16/9] relative opacity-90">
                        <div className="absolute inset-0 flex items-center justify-center text-slate-500">
                             {/* Abstract UI representation */}
                             <div className="w-full h-full bg-slate-100 flex">
                                <div className="w-1/4 h-full border-r border-slate-200 bg-white p-4 space-y-4 hidden md:block">
                                    <div className="h-8 bg-slate-100 rounded w-3/4"></div>
                                    <div className="h-4 bg-slate-100 rounded w-1/2"></div>
                                    <div className="space-y-2 mt-8">
                                        <div className="h-12 bg-indigo-50 rounded-lg border border-indigo-100"></div>
                                        <div className="h-12 bg-white rounded-lg border border-slate-100"></div>
                                        <div className="h-12 bg-white rounded-lg border border-slate-100"></div>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 grid grid-cols-2 gap-4">
                                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"></div>
                                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"></div>
                                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"></div>
                                     <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4"></div>
                                </div>
                             </div>
                             <div className="absolute inset-0 flex items-center justify-center bg-black/5">
                                <span className="text-xl font-bold text-slate-400">Interactive Dashboard Preview</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div id="features" className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why CampusSpot?</h2>
                <p className="text-slate-500 mt-4 text-lg max-w-2xl mx-auto">
                    Designed for students and faculty to make university life seamless and efficient.
                </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <FeatureCard 
                    icon={<Layout className="text-indigo-600" />}
                    title="Real-time Availability"
                    desc="Check which classrooms, labs, and seminar halls are vacant right now based on live university schedules."
                    color="bg-indigo-50"
                />
                 <FeatureCard 
                    icon={<BrainCircuit className="text-purple-600" />}
                    title="AI Smart Search"
                    desc="Just ask: 'Where can I find a quiet room with a projector for 5 people?' and get instant, smart recommendations."
                    color="bg-purple-50"
                />
                 <FeatureCard 
                    icon={<Bell className="text-orange-600" />}
                    title="Smart Notifications"
                    desc="Subscribe to specific categories like 'Career Fairs' or 'Sports' and get timely alerts for what matters to you."
                    color="bg-orange-50"
                />
                 <FeatureCard 
                    icon={<MapPin className="text-emerald-600" />}
                    title="Interactive Maps"
                    desc="Visual floor plans help you navigate complex engineering and science blocks with ease."
                    color="bg-emerald-50"
                />
                 <FeatureCard 
                    icon={<Zap className="text-amber-500" />}
                    title="Amenity Filtering"
                    desc="Need a whiteboard? A quiet zone? Air conditioning? Filter spaces by the amenities you actually need."
                    color="bg-amber-50"
                />
                 <FeatureCard 
                    icon={<Calendar className="text-blue-500" />}
                    title="Schedule Planning"
                    desc="View upcoming availability for rooms to plan your study sessions or group meetings in advance."
                    color="bg-blue-50"
                />
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
               <div className="w-6 h-6 bg-slate-900 rounded-md flex items-center justify-center text-white font-bold text-xs">C</div>
               <span className="font-bold text-lg text-slate-900">CampusSpot</span>
            </div>
            <p className="text-slate-500 text-sm">© 2025 CampusSpot University Utility. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc, color }: { icon: React.ReactNode, title: string, desc: string, color: string }) => (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
        <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
            {React.cloneElement(icon as React.ReactElement<any>, { size: 28 })}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
);

export default LandingPage;