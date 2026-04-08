import React from 'react';
import { Link } from 'react-router-dom';
import CollegeHeader from './CollegeHeader';
import { 
  GraduationCap, 
  Calendar, 
  Users, 
  Shield, 
  ChevronRight, 
  Globe, 
  Mail, 
  ArrowRight,
  BookOpen,
  Award,
  CheckCircle2,
  ExternalLink,
  Search,
  Settings,
  Lock,
  FolderOpen
} from 'lucide-react';
import { getAssetPath } from "@/lib/utils";

const LandingPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      <CollegeHeader />
      
      {/* Navigation Header - Restructured */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 py-4 px-6 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-2.5 rounded-xl shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform duration-300">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold text-slate-900 leading-none tracking-tight">SSIEMS</span>
              <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-widest">Academic System</span>
            </div>
          </div>
          
          <nav className="hidden md:flex gap-8 items-center">
            {[
              { name: 'Home', href: '#' },
              { name: 'Portals', href: '#modules' }
            ].map((item) => (
              <a 
                key={item.name}
                href={item.href} 
                className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors relative group py-2"
              >
                {item.name}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
            <Link 
              to="/gradeflow" 
              className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md transition-all hover:translate-y-[-1px] active:translate-y-0"
            >
              Secure Login
            </Link>
          </nav>

          <button className="md:hidden p-2 text-slate-600">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
          </button>
        </div>
      </header>

      {/* Hero Section - With Campus Background */}
      <section className="relative overflow-hidden pt-32 pb-40 px-6 border-b border-slate-200">
        {/* Fixed Background Image */}
        <div 
          className="absolute inset-0 z-0 bg-slate-900"
          style={{
            backgroundImage: `url(${getAssetPath("images/ssiems-campus.webp")})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        ></div>
        
        {/* Dark Glass Overlay for striking image visibility */}
        <div className="absolute inset-0 bg-slate-900/60 z-0"></div>
        {/* Smooth gradient blend into the modules section below */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-slate-50 to-transparent z-0"></div>

        <div className="max-w-4xl mx-auto text-center space-y-10 relative z-10">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold shadow-lg">
              <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.8)]"></span>
              SSIEMS Academic System
            </div>
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-2xl">
              Empowering <span className="text-blue-400">Students & Staff</span>
            </h1>
            <p className="text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-md">
              The unified digital ecosystem for academic management, digital examinations, and institutional resources.
            </p>
          </div>

        </div>
      </section>

      {/* System Modules Section - Refined */}
      <main id="modules" className="max-w-7xl mx-auto py-32 px-6 flex-grow">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">System Modules</h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
            Choose a specialized portal to access relevant academic services and tools.
          </p>
          <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-16">
          {/* GradeFlow Module */}
          <div className="group bg-white rounded-[2.5rem] p-10 border border-slate-200 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all duration-500 flex flex-col items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>
            
            <div className="bg-indigo-600 text-white p-5 rounded-2xl mb-8 shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform duration-500">
              <BookOpen className="h-10 w-10" />
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">GradeFlow</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
              Digital examination management & evaluation system. Securely manage student marks, 
              upload digital answer sheets, and generate automated performance reports.
            </p>
            
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10 w-full">
              {[
                'Digital Answer Sheet Evaluation',
                'Instant Result Sheet Generation',
                'Secure Faculty & Student Dashboards',
                'Performance Analytics & Trends'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-indigo-600 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 w-full mt-auto">
              <Link to="/gradeflow" className="group/btn bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 text-center flex items-center justify-center gap-2">
                Launch Portal <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </Link>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Shield className="h-3 w-3" /> Secure Access Required
              </div>
            </div>
          </div>

          {/* Academic Resources Module */}
          <div className="group bg-white rounded-[2.5rem] p-10 border border-slate-200 hover:border-sky-200 hover:shadow-2xl hover:shadow-sky-100/50 transition-all duration-500 flex flex-col items-start relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-full -z-10 group-hover:scale-150 transition-transform duration-700 opacity-50"></div>

            <div className="bg-sky-600 text-white p-5 rounded-2xl mb-8 shadow-lg shadow-sky-100 group-hover:scale-110 transition-transform duration-500">
              <Calendar className="h-10 w-10" />
            </div>
            
            <h3 className="text-3xl font-bold text-slate-900 mb-4 tracking-tight">Academic Resources</h3>
            <p className="text-slate-600 text-lg mb-8 leading-relaxed font-medium">
              View updated school, class, and lecturer timetables, and access examination schedules, calendars, and academic materials.
            </p>

            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 mb-10 w-full">
              {[
                'Year-wise Class Timetables',
                'Examination Schedules',
                'Official Academic Calendar',
                'Holiday & Event Notifications'
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-slate-600 font-semibold text-sm">
                  <div className="h-1.5 w-1.5 rounded-full bg-sky-600 flex-shrink-0"></div>
                  {feature}
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-4 w-full mt-auto">
              <button 
                onClick={() => window.location.href = '/timetable/pages/resources.html'}
                className="group/btn bg-sky-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-sky-700 transition-all shadow-lg shadow-sky-100 text-center flex items-center justify-center gap-2"
              >
                Access Hub <ArrowRight className="h-5 w-5 group-hover/btn:translate-x-1 transition-transform" />
              </button>
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <Globe className="h-3 w-3" /> Publicly Accessible
              </div>
            </div>
          </div>
        </div>
      </main>




      {/* Footer - Restructured */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-16 text-sm mb-20">
          <div className="col-span-1 md:col-span-1 space-y-8 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="bg-blue-600 p-2 rounded-xl">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-xl font-black tracking-tighter">SSIEMS Academic System</span>
            </div>
            <p className="text-slate-400 leading-relaxed font-medium">
              Empowering Students & Staff with all-in-one tools for academic excellence and efficient management.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              {['facebook', 'twitter', 'linkedin'].map((social) => (
                <a key={social} href="#" className="bg-slate-900 p-3 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-slate-500">
                  <Globe className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Quick Links</h4>
            <ul className="space-y-4 text-slate-400 font-semibold">
              <li><Link to="/" className="hover:text-blue-400 transition-colors">Home</Link></li>
              <li><a href="#modules" className="hover:text-blue-400 transition-colors">Modules</a></li>
              <li><Link to="/gradeflow" className="hover:text-blue-400 transition-colors">Login</Link></li>
            </ul>
          </div>

          <div id="support" className="text-center md:text-left">
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">Contact Info</h4>
            <ul className="space-y-4 text-slate-400 font-semibold">
              <li className="flex items-start justify-center md:justify-start gap-3">
                <Mail className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>info@ssiems.org.in</span>
              </li>
              <li className="flex items-start justify-center md:justify-start gap-3">
                <Globe className="h-5 w-5 text-blue-500 flex-shrink-0" />
                <span>Parbhani, Maharashtra,<br />India - 431401</span>
              </li>
            </ul>
          </div>

          <div className="text-center md:text-left bg-slate-900/50 p-8 rounded-3xl border border-slate-800/50">
            <h4 className="text-white font-bold mb-4">System Status</h4>
            <p className="text-slate-500 mb-6 font-medium">All systems are operational. Academic portals are online.</p>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="font-bold text-emerald-500 uppercase tracking-widest text-[10px]">Operational</span>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-slate-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-bold text-xs uppercase tracking-widest">
          <p>&copy; 2026 SSIEMS Academic System. MSPM Parbhani.</p>
          <div className="flex gap-8">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Use</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
