import React, { useState, useEffect } from 'react';
import { Moon, Sun, MapPin, Calendar, Clock, CheckCircle, ChevronRight, Mail, User, Briefcase, Hash, Terminal, Cpu, Globe, Linkedin, Twitter, Instagram } from 'lucide-react';

export default function GDGPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', org: '', interest: 'AI/ML' });
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  // Toggle Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Countdown Logic
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  useEffect(() => {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 14); // Event in 14 days
    targetDate.setHours(9, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
      } else {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('submitting');
    // Simulate API call
    setTimeout(() => {
      setFormStatus('success');
      setFormData({ name: '', email: '', org: '', interest: 'AI/ML' });
    }, 1500);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      
      {/* Navigation */}
      <nav className={`fixed w-full z-50 backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-white/80 border-slate-100'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold tracking-tighter">
                <span className="text-google-blue">G</span>
                <span className="text-google-red">D</span>
                <span className="text-google-yellow">G</span>
                <span className={`ml-2 ${darkMode ? 'text-white' : 'text-slate-700'}`}>Galgotias</span>
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 font-medium text-sm">
              {['About', 'Speakers', 'Schedule', 'Location'].map((item) => (
                <a 
                  key={item} 
                  href={`#${item.toLowerCase()}`}
                  className={`hover:text-google-blue transition-colors ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}
                >
                  {item}
                </a>
              ))}
              <a 
                href="#register" 
                className="px-5 py-2 bg-google-blue text-white rounded-full hover:bg-blue-600 transition-all shadow-md hover:shadow-lg"
              >
                Register Now
              </a>
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-slate-800 text-yellow-400' : 'bg-slate-100 text-slate-600'}`}
              >
                {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            </div>
            
            {/* Mobile Menu Toggle (Simplified) */}
            <div className="md:hidden flex items-center gap-4">
               <button onClick={() => setDarkMode(!darkMode)} className={darkMode ? 'text-yellow-400' : 'text-slate-600'}>
                  {darkMode ? <Sun size={20} /> : <Moon size={20} />}
               </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className={`absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${darkMode ? 'from-slate-800 via-slate-900 to-slate-950' : 'from-blue-50 via-white to-white'}`}></div>
        
        <div className="max-w-7xl mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700"
                 style={{ borderColor: darkMode ? '#334155' : '#e2e8f0', background: darkMode ? 'rgba(30, 41, 59, 0.5)' : 'white' }}>
                 <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-google-red opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-google-red"></span>
                 </span>
                 <span className={`text-xs font-bold uppercase tracking-wider ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Upcoming Event</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
              Build the Future with <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-google-blue via-google-red to-google-yellow">Google AI</span>
            </h1>
            
            <p className={`text-xl md:text-2xl max-w-3xl mx-auto mb-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Join us for a day of innovation, coding, and networking at GDG Galgotias. 
              Master Generative AI, Cloud Computing, and Mobile Dev.
            </p>

            {/* Countdown */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 mb-12 animate-in zoom-in duration-700 delay-300">
              {[
                { label: 'Days', value: timeLeft.days },
                { label: 'Hours', value: timeLeft.hours },
                { label: 'Minutes', value: timeLeft.minutes },
                { label: 'Seconds', value: timeLeft.seconds }
              ].map((item) => (
                <div key={item.label} className={`flex flex-col items-center justify-center w-20 h-24 md:w-24 md:h-28 rounded-2xl border backdrop-blur-sm ${darkMode ? 'bg-slate-800/50 border-slate-700' : 'bg-white/80 border-slate-200 shadow-lg'}`}>
                  <span className={`text-3xl md:text-4xl font-bold font-mono ${darkMode ? 'text-white' : 'text-slate-800'}`}>
                    {item.value.toString().padStart(2, '0')}
                  </span>
                  <span className={`text-xs uppercase tracking-wider font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                    {item.label}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
               <a href="#register" className="px-8 py-4 bg-google-blue text-white rounded-xl font-bold text-lg hover:bg-blue-600 transition-transform hover:-translate-y-1 shadow-lg shadow-blue-500/30">
                 Reserve Your Spot
               </a>
               <a href="#schedule" className={`px-8 py-4 rounded-xl font-bold text-lg border transition-colors ${darkMode ? 'border-slate-700 text-white hover:bg-slate-800' : 'border-slate-200 text-slate-700 hover:bg-slate-50'}`}>
                 View Schedule
               </a>
            </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section id="about" className={`py-20 ${darkMode ? 'bg-slate-800/50' : 'bg-slate-50'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Event Highlights</h2>
              <p className={`max-w-2xl mx-auto ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Get ready for an immersive experience covering the latest in technology.
              </p>
           </div>

           <div className="grid md:grid-cols-3 gap-8">
              <HighlightCard 
                icon={<Terminal className="text-google-blue" />}
                title="GenAI Workshop"
                desc="Hands-on session with Gemini API. Build your own smart apps in 2 hours."
                darkMode={darkMode}
              />
              <HighlightCard 
                icon={<Cpu className="text-google-red" />}
                title="Cloud Hero"
                desc="Compete in a gamified cloud infrastructure challenge on Google Cloud Platform."
                darkMode={darkMode}
              />
              <HighlightCard 
                icon={<Globe className="text-google-green" />}
                title="Tech Networking"
                desc="Connect with industry experts, alumni, and fellow developers over lunch."
                darkMode={darkMode}
              />
           </div>
        </div>
      </section>

      {/* Schedule Section */}
      <section id="schedule" className="py-24 overflow-hidden">
         <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold mb-16 text-center">Event Schedule</h2>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-google-blue via-google-red to-google-yellow before:opacity-30 before:rounded-full">
               <ScheduleItem time="09:00 AM" title="Registration & Breakfast" desc="Check-in at the main hall." icon={<CheckCircle size={20} />} darkMode={darkMode} />
               <ScheduleItem time="10:00 AM" title="Keynote: Future of AI" desc="Speaker: Jane Doe, GDE Machine Learning." icon={<Briefcase size={20} />} darkMode={darkMode} />
               <ScheduleItem time="11:30 AM" title="Technical Breakout Sessions" desc="Track A: Mobile (Flutter) | Track B: Cloud (GCP)" icon={<Cpu size={20} />} darkMode={darkMode} />
               <ScheduleItem time="01:00 PM" title="Networking Lunch" desc="Food court area." icon={<User size={20} />} darkMode={darkMode} />
               <ScheduleItem time="02:00 PM" title="Hackathon Kickoff" desc="Build solutions for local problems." icon={<Terminal size={20} />} darkMode={darkMode} />
            </div>
         </div>
      </section>

      {/* Location Section */}
      <section id="location" className={`py-20 ${darkMode ? 'bg-slate-800' : 'bg-slate-900'} text-white`}>
         <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-2 gap-12 items-center">
            <div>
               <div className="inline-block p-3 bg-white/10 rounded-xl mb-6">
                 <MapPin className="text-google-red" size={32} />
               </div>
               <h2 className="text-3xl md:text-4xl font-bold mb-6">Find Us Here</h2>
               <div className="space-y-4 text-slate-300 mb-8">
                  <div className="flex items-start gap-3">
                     <MapPin className="shrink-0 mt-1" size={20} />
                     <p>Galgotias University, Block C Auditorium<br/>Plot No.2, Sector 17-A<br/>Yamuna Expressway, Greater Noida</p>
                  </div>
                  <div className="flex items-center gap-3">
                     <Calendar className="shrink-0" size={20} />
                     <p>April 15, 2025 • 09:00 AM - 05:00 PM</p>
                  </div>
               </div>
               <a href="https://maps.google.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-google-blue hover:text-white transition-colors font-semibold">
                 Get Directions <ChevronRight size={16} />
               </a>
            </div>
            
            <div className="h-80 w-full rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
               {/* Simple Placeholder for Map to avoid API key requirement for demo */}
               <iframe 
                 title="Galgotias University Map"
                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3506.8407425553666!2d77.52587931507925!3d28.36142658252554!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc74620f36759%3A0xd6f74d08a54d36dd!2sGalgotias%20University!5e0!3m2!1sen!2sin!4v1625634561234!5m2!1sen!2sin" 
                 width="100%" 
                 height="100%" 
                 style={{ border: 0, filter: darkMode ? 'invert(90%) hue-rotate(180deg)' : 'none' }} 
                 loading="lazy">
               </iframe>
            </div>
         </div>
      </section>

      {/* Registration Form */}
      <section id="register" className={`py-20 ${darkMode ? 'bg-slate-900' : 'bg-white'}`}>
        <div className="max-w-xl mx-auto px-4">
           <div className={`p-8 rounded-3xl shadow-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
              <div className="text-center mb-8">
                 <h2 className="text-2xl font-bold mb-2">Secure Your Spot</h2>
                 <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Limited seats available. First come, first served.</p>
              </div>

              {formStatus === 'success' ? (
                <div className="text-center py-12 animate-in zoom-in duration-300">
                   <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                   </div>
                   <h3 className="text-2xl font-bold text-green-600 mb-2">You're In!</h3>
                   <p className={darkMode ? 'text-slate-300' : 'text-slate-600'}>
                     Registration successful. Check your email for the ticket QR code.
                   </p>
                   <button 
                     onClick={() => setFormStatus('idle')}
                     className="mt-8 text-sm font-bold text-google-blue hover:underline"
                   >
                     Register another person
                   </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                   <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Full Name</label>
                      <div className="relative">
                         <User className="absolute left-3 top-3 text-slate-400" size={18} />
                         <input 
                           type="text" required 
                           value={formData.name}
                           onChange={(e) => setFormData({...formData, name: e.target.value})}
                           className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-google-blue ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                           placeholder="Anshul"
                         />
                      </div>
                   </div>

                   <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Email Address</label>
                      <div className="relative">
                         <Mail className="absolute left-3 top-3 text-slate-400" size={18} />
                         <input 
                           type="email" required 
                           value={formData.email}
                           onChange={(e) => setFormData({...formData, email: e.target.value})}
                           className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-google-blue ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                           placeholder="anshul@university.edu"
                         />
                      </div>
                   </div>

                   <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>College / Organization</label>
                      <div className="relative">
                         <Briefcase className="absolute left-3 top-3 text-slate-400" size={18} />
                         <input 
                           type="text" required 
                           value={formData.org}
                           onChange={(e) => setFormData({...formData, org: e.target.value})}
                           className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-google-blue ${darkMode ? 'bg-slate-700 border-slate-600 text-white placeholder-slate-400' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                           placeholder="Galgotias University"
                         />
                      </div>
                   </div>

                   <div>
                      <label className={`block text-sm font-medium mb-1 ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>Area of Interest</label>
                      <div className="relative">
                         <Hash className="absolute left-3 top-3 text-slate-400" size={18} />
                         <select 
                           value={formData.interest}
                           onChange={(e) => setFormData({...formData, interest: e.target.value})}
                           className={`w-full pl-10 pr-4 py-2.5 rounded-xl border outline-none focus:ring-2 focus:ring-google-blue appearance-none ${darkMode ? 'bg-slate-700 border-slate-600 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'}`}
                         >
                            <option>AI / Machine Learning</option>
                            <option>Web Development</option>
                            <option>Cloud Computing</option>
                            <option>Mobile Development</option>
                            <option>Blockchain</option>
                            <option>Cybersecurity</option>
                            <option>Data Science</option>
                            <option>DevOps</option>
                            <option>UI/UX Design</option>
                            <option>Other</option>
                         </select>
                      </div>
                   </div>

                   <button 
                     type="submit"
                     disabled={formStatus === 'submitting'}
                     className="w-full py-3 bg-google-blue text-white rounded-xl font-bold text-lg shadow-lg hover:bg-blue-600 disabled:opacity-70 disabled:cursor-not-allowed transition-all mt-4"
                   >
                     {formStatus === 'submitting' ? 'Registering...' : 'Confirm Registration'}
                   </button>
                </form>
              )}
           </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 border-t ${darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'}`}>
         <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
               <h3 className={`text-lg font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>GDG Galgotias</h3>
               <p className="text-sm mt-1">Building a better community, one line of code at a time.</p>
            </div>
            
            <div className="flex gap-6">
               <SocialLink href="#" icon={<Twitter size={20} />} />
               <SocialLink href="#" icon={<Linkedin size={20} />} />
               <SocialLink href="#" icon={<Instagram size={20} />} />
            </div>
         </div>
      </footer>
    </div>
  );
}

const HighlightCard = ({ icon, title, desc, darkMode }: { icon: React.ReactNode, title: string, desc: string, darkMode: boolean }) => (
   <div className={`p-8 rounded-2xl border transition-all hover:-translate-y-2 hover:shadow-xl ${darkMode ? 'bg-slate-800 border-slate-700 hover:shadow-slate-900/50' : 'bg-white border-slate-100 shadow-sm hover:shadow-slate-200'}`}>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${darkMode ? 'bg-slate-700' : 'bg-slate-50'}`}>
         {React.cloneElement(icon as React.ReactElement<any>, { size: 24 })}
      </div>
      <h3 className={`text-xl font-bold mb-3 ${darkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
      <p className={`leading-relaxed ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>{desc}</p>
   </div>
);

const ScheduleItem = ({ time, title, desc, icon, darkMode }: { time: string, title: string, desc: string, icon: React.ReactNode, darkMode: boolean }) => (
   <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group cursor-default">
      {/* Icon Node */}
      <div className={`flex items-center justify-center w-12 h-12 rounded-full border-4 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-transform duration-300 group-hover:scale-110 ${darkMode ? 'bg-slate-800 border-slate-900 text-google-blue' : 'bg-white border-slate-50 text-google-blue shadow-lg'}`}>
         {React.cloneElement(icon as React.ReactElement<any>, { className: 'transition-transform duration-300 group-hover:rotate-12' })}
      </div>
      
      {/* Card */}
      <div className={`w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-google-blue/30 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
         <div className="flex items-center justify-between space-x-2 mb-2">
            <div className={`font-bold text-lg ${darkMode ? 'text-white' : 'text-slate-800'}`}>{title}</div>
            <time className="font-mono text-xs font-bold text-google-blue bg-blue-50/10 px-2 py-1 rounded">{time}</time>
         </div>
         <div className={`text-slate-500 text-sm leading-relaxed ${darkMode ? 'text-slate-400' : ''}`}>{desc}</div>
      </div>
   </div>
);

const SocialLink = ({ href, icon }: { href: string, icon: React.ReactNode }) => (
  <a href={href} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors bg-slate-200/50 hover:bg-google-blue hover:text-white">
    {icon}
  </a>
);