import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, Mail, ArrowRight, BookOpen, CheckCircle2, MapPin, 
  Phone, Globe, Award, TrendingUp, Target, Rocket, FlaskConical, 
  ChevronRight, School, Brain, Cpu, ShieldCheck, Layout, ChevronUp, 
  ExternalLink, Star, Zap, Camera, Menu, X, Sparkles, Building,
  GraduationCap, Calendar, Clock, FileText, Check
} from 'lucide-react';
import { getAssetPath } from "@/lib/utils";
import { departmentData } from '../data/departmentData';
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";

const LandingPage = () => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id) => {
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  const facultyList = [
    { name: 'Prof. Pawar V.K.', role: 'Head of Department & Asst. Prof.', qual: 'M.Tech (CSE)', exp: '14+ Yrs', photo: 'faculty/Pawar V.K..webp' },
    { name: 'Prof. Bais P. G.', role: 'Class Teacher & Asst. Prof.', qual: 'M.Tech (CSE)', exp: '10+ Yrs', photo: 'faculty/Bais P. G..webp' },
    { name: 'Prof. Magar A. R.', role: 'Assistant Professor', qual: 'M.Tech (CSE)', exp: '9+ Yrs', photo: 'faculty/Magar A. R..webp' },
    { name: 'Prof. Devkar R. S.', role: 'Assistant Professor', qual: 'M.Tech (CSE)', exp: '8+ Yrs', photo: 'faculty/Devkar R. S..webp' },
    { name: 'Prof. Shelke S. B.', role: 'Assistant Professor', qual: 'M.Tech (CSE)', exp: '7+ Yrs', photo: 'faculty/Shelke S. B..webp' },
    { name: 'Prof. Panchalwar D. A.', role: 'Assistant Professor', qual: 'M.Tech (CSE)', exp: '6+ Yrs', photo: 'faculty/Panchalwar D. A.webp' },
  ];

  const highlights = [
    { title: 'NAAC A+ Accreditation', desc: 'Recognized for high academic standards and student-centered curriculum delivery.', icon: Award, color: 'text-amber-500 bg-amber-500/10' },
    { title: 'Industry-Aligned Labs', desc: 'High-speed gigabit workstations equipped with modern Python, AI/ML, and Java frameworks.', icon: Cpu, color: 'text-blue-500 bg-blue-500/10' },
    { title: 'Consistent University Results', desc: 'Consistently high pass rates and University toppers in Dr. BATU regional merit lists.', icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
    { title: 'Active Placement Cell', desc: 'Over 85% placement and internship placement rate with major IT services and product firms.', icon: Rocket, color: 'text-purple-500 bg-purple-500/10' },
  ];

  const notices = [
    { id: 1, title: 'Continuous Assessment (CA-1) Examination Schedule 2026', date: '02 Oct 2026', category: 'Exam Cell', urgent: true },
    { id: 2, title: 'Submission of Industry Internship Synopses for TY-CSE', date: '30 Sep 2026', category: 'Academic', urgent: false },
    { id: 3, title: 'Smart India Hackathon 2026 Departmental Selection Round', date: '28 Sep 2026', category: 'Innovation', urgent: false },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-600 selection:text-white">
      {/* 1. STICKY RESPONSIVE NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-xl border-b border-slate-200/80 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Identity */}
          <Link to="/" className="flex items-center space-x-3.5 group">
            <img 
              src={getAssetPath("images/ssiems-logo.png")} 
              alt="SSIEMS Logo" 
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
            <div className="hidden sm:block">
              <span className="font-black text-slate-950 text-sm md:text-base tracking-tight block leading-tight">
                Department of Computer Science & Engineering
              </span>
              <span className="text-[11px] font-bold text-slate-500 tracking-tight block">
                SSIEMS Institute, Affiliated to DBATU
              </span>
            </div>
          </Link>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center space-x-7 text-xs font-bold uppercase tracking-wider text-slate-600">
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-blue-600 transition-colors">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="hover:text-blue-600 transition-colors">
              Department
            </button>
            <button onClick={() => scrollToSection('faculty')} className="hover:text-blue-600 transition-colors">
              Faculty
            </button>
            <Link to="/gallery" className="hover:text-blue-600 transition-colors">
              Gallery
            </Link>
            <button onClick={() => scrollToSection('contact')} className="hover:text-blue-600 transition-colors">
              Contact
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center space-x-3">
            <Button
              onClick={() => navigate('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider px-6 py-2.5 rounded-xl shadow-md shadow-blue-600/25 transition-all hover:scale-105"
            >
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-6 py-5 shadow-xl animate-in slide-in-from-top-4 duration-200 space-y-3">
            <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setIsMobileMenuOpen(false); }} className="block w-full text-left py-2 font-bold text-slate-700 hover:text-blue-600 text-sm">
              Home
            </button>
            <button onClick={() => scrollToSection('about')} className="block w-full text-left py-2 font-bold text-slate-700 hover:text-blue-600 text-sm">
              Department
            </button>
            <button onClick={() => scrollToSection('faculty')} className="block w-full text-left py-2 font-bold text-slate-700 hover:text-blue-600 text-sm">
              Faculty
            </button>
            <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-left py-2 font-bold text-slate-700 hover:text-blue-600 text-sm">
              Gallery
            </Link>
            <button onClick={() => scrollToSection('contact')} className="block w-full text-left py-2 font-bold text-slate-700 hover:text-blue-600 text-sm">
              Contact
            </button>
            <Button
              onClick={() => { setIsMobileMenuOpen(false); navigate('/login'); }}
              className="w-full bg-blue-600 text-white font-bold text-xs uppercase tracking-wider py-2.5 rounded-xl mt-2"
            >
              Sign In
            </Button>
          </div>
        )}
      </header>

      {/* 2. HERO SECTION (USING ACTUAL INSTITUTE CAMPUS PHOTOGRAPH) */}
      <section className="relative min-h-[620px] lg:min-h-[680px] flex items-center justify-center text-white overflow-hidden pb-12 pt-8">
        {/* Background Campus Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getAssetPath("images/ssiems-campus.webp")} 
            alt="SSIEMS Campus Building" 
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 animate-in fade-in duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/85 to-slate-950/80 backdrop-blur-[0.5px]"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-slate-200 text-xs font-bold tracking-wider shadow-inner">
            <span>NAAC 'B' Grade | ISO 9001:2015 | AICTE Approved</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Shaping Future <br />
            <span className="text-blue-400">
              Technology Leaders
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-slate-200 text-sm sm:text-base lg:text-lg font-medium leading-relaxed">
            Empowering students with cutting-edge education in Computer Science and Engineering through innovation, research, and excellence.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button
              onClick={() => navigate('/login')}
              className="w-full sm:w-auto px-8 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all hover:scale-105 flex items-center gap-2"
            >
              <span>Sign In to Academic Portal</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => scrollToSection('about')}
              variant="outline"
              className="w-full sm:w-auto px-8 py-3.5 bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold text-xs uppercase tracking-wider rounded-xl backdrop-blur-md transition-all hover:scale-105"
            >
              Explore CSE Department
            </Button>
          </div>

          {/* 4 FEATURE PILLS MATCHING MOCKUP */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-3.5 max-w-4xl mx-auto">
            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white shrink-0">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">Quality Education</div>
                <div className="text-[10px] text-slate-300 font-medium">With Industry Relevance</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white shrink-0">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">Research & Innovation</div>
                <div className="text-[10px] text-slate-300 font-medium">Real-World Problem Solving</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">Skilled Faculty</div>
                <div className="text-[10px] text-slate-300 font-medium">Experienced Mentors</div>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 text-left">
              <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center text-white shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-black text-white">Bright Future</div>
                <div className="text-[10px] text-slate-300 font-medium">Placement & Opportunities</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DEPARTMENT OVERVIEW & HOD DESK */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                <Brain className="w-4 h-4" />
                <span>Department Overview</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
                Center for Excellence in Computing & Emerging Technologies
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                The Computer Science & Engineering department started in 2010 with the inception of SSIEMS. Presently headed by <strong>Prof. Pawar V.K.</strong> along with experienced and dedicated faculty members, the department has grown into a premier hub for technical education, competitive coding, and applied research.
              </p>
              <p className="text-slate-600 text-sm leading-relaxed">
                Our curriculum aligns with the present-day requirements of IT industries, fostering practical hands-on software development, machine learning, cloud architectures, and algorithmic problem-solving.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {[
                  'State-of-the-art computational infrastructure',
                  'Rigorous Continuous Assessment (CA) tracking',
                  'Project-based learning and internship mentorship',
                  'Active student technical associations (C-Cube)',
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center space-x-2.5 text-xs font-bold text-slate-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* HOD Profile Card */}
            <div className="lg:col-span-5">
              <Card className="rounded-3xl border border-slate-200/80 shadow-xl overflow-hidden bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-7 space-y-5">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-600/30 border border-indigo-400/40 p-1 shrink-0 overflow-hidden">
                    <img 
                      src={getAssetPath("faculty/Pawar V.K..webp")} 
                      alt="Prof. Pawar V.K." 
                      className="w-full h-full object-cover rounded-xl"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">Prof. Pawar V.K.</h3>
                    <p className="text-xs font-semibold text-indigo-300">Head of Department (CSE)</p>
                    <p className="text-[11px] text-slate-400">M.Tech (CSE) • 14+ Years Experience</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs italic text-slate-300 leading-relaxed">
                  "Our mission is to nurture engineers who don't just consume technology, but architect solutions that address real-world socio-economic and industrial challenges with professional integrity."
                </div>

                <div className="flex items-center justify-between text-xs text-slate-300 pt-2 border-t border-white/10">
                  <span>Contact: head.cse@ssiems.in</span>
                  <span className="font-bold text-amber-400">Ext: 201</span>
                </div>
              </Card>
            </div>

          </div>
        </div>
      </section>

      {/* 4. VISION & MISSION */}
      <section className="py-16 bg-slate-100/70 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Institutional Philosophy</div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Our Vision & Mission</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Vision */}
            <Card className="rounded-3xl border border-slate-200/80 shadow-md bg-white p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Department Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {departmentData.vision}
              </p>
            </Card>

            {/* Mission */}
            <Card className="rounded-3xl border border-slate-200/80 shadow-md bg-white p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-slate-900">Department Mission</h3>
              <ul className="space-y-2 text-slate-600 text-sm leading-relaxed">
                {departmentData.mission.map((m, idx) => (
                  <li key={idx} className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-1" />
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* 5. ACADEMIC PROGRAMS & CURRICULUM */}
      <section id="academics" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Curriculum & Degrees</div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Academic Offerings</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Structured semester pathways affiliated to Dr. Babasaheb Ambedkar Technological University (DBATU)</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'B.Tech in Computer Science & Engineering',
                duration: '4 Years (8 Semesters)',
                intake: '60 Approved Seats',
                desc: 'Comprehensive degree covering data structures, software engineering, machine learning, networks, databases, and compiler design.',
                tag: 'Flagship Under-Graduate Program'
              },
              {
                title: 'Direct Second Year (DSE) Admission',
                duration: '3 Years (6 Semesters)',
                intake: 'Lateral Diploma Entry',
                desc: 'Specialized accelerated entry pathway for Polytechnic diploma holders in Computer, Information Technology, and related streams.',
                tag: 'Lateral Entry'
              },
              {
                title: 'Honors & Minors Certification',
                duration: 'Integrated with B.Tech',
                intake: 'Merit-Based Elective',
                desc: 'Advanced elective tracks in Artificial Intelligence & Data Science, Cloud Computing, Cyber Security, and Full-Stack Engineering.',
                tag: 'Industry Specialization'
              }
            ].map((prog, idx) => (
              <Card key={idx} className="rounded-3xl border border-slate-200/80 shadow-md p-6 flex flex-col justify-between hover:shadow-xl transition-all">
                <div className="space-y-3">
                  <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700">
                    {prog.tag}
                  </span>
                  <h3 className="text-lg font-black text-slate-900">{prog.title}</h3>
                  <div className="text-xs font-bold text-slate-500 flex justify-between pt-1 border-t border-slate-100">
                    <span>{prog.duration}</span>
                    <span className="text-indigo-600">{prog.intake}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed pt-2">
                    {prog.desc}
                  </p>
                </div>
                <div className="pt-5">
                  <Button 
                    onClick={() => navigate('/login')}
                    variant="outline" 
                    className="w-full text-xs font-bold rounded-xl hover:bg-indigo-50 hover:text-indigo-700"
                  >
                    View Syllabus & Course Outcomes
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 6. DEPARTMENT HIGHLIGHTS */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-400">Institutional Stature</div>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Department Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {highlights.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-3 hover:bg-white/10 transition-all">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-base font-black text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 7. FACULTY MEMBERS */}
      <section id="faculty" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Distinguished Academicians</div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Our Faculty Team</h2>
            <p className="text-slate-500 text-xs sm:text-sm">Experienced educators and mentors dedicated to technical excellence</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {facultyList.map((fac, idx) => (
              <Card key={idx} className="rounded-3xl border border-slate-200/80 shadow-md p-6 hover:shadow-xl transition-all">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200">
                    <img 
                      src={getAssetPath(fac.photo)} 
                      alt={fac.name} 
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">{fac.name}</h3>
                    <p className="text-xs font-semibold text-indigo-600">{fac.role}</p>
                    <p className="text-[11px] text-slate-500">{fac.qual} • {fac.exp}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center pt-4">
            <Link to="/faculty" className="inline-flex items-center text-xs font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800">
              View Detailed Faculty Profiles & Publications <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 8. LABORATORIES & INFRASTRUCTURE */}
      <section className="py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Research & Practice</div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Laboratories & Computing Facilities</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Software Engg & Competitive Lab', incharge: 'Prof. Panchalwar D.A.', area: '70 sq.m', software: 'Java, Turbo C++, Python 3.11' },
              { name: 'Data Structures & Algorithms Lab', incharge: 'Prof. Magar A. R.', area: '70 sq.m', software: 'Linux, GCC, Eclipse, VS Code' },
              { name: 'Database & Cloud Computing Lab', incharge: 'Prof. Devkar R. S.', area: '70 sq.m', software: 'Oracle 11g, MySQL, MongoDB, AWS SDK' },
              { name: 'AI & Machine Learning Lab', incharge: 'Prof. Pawar V. K.', area: '70 sq.m', software: 'TensorFlow, PyTorch, Jupyter, Scikit' },
            ].map((lab, idx) => (
              <Card key={idx} className="rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-3 bg-white">
                <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-black">
                  <FlaskConical className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-black text-slate-900">{lab.name}</h3>
                <div className="text-[11px] text-slate-500 space-y-1 pt-1 border-t border-slate-100">
                  <p>In-Charge: <strong>{lab.incharge}</strong></p>
                  <p>Lab Area: {lab.area}</p>
                  <p className="text-indigo-600 font-semibold">{lab.software}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 9. NOTICES & ANNOUNCEMENTS */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-indigo-600">Official Circulars</div>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Latest Department Notices</h2>
            </div>
            <Button
              onClick={() => navigate('/login')}
              className="bg-indigo-600 text-white font-bold text-xs rounded-xl"
            >
              Access Notice Board
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notices.map((n) => (
              <Card key={n.id} className="rounded-3xl border border-slate-200/80 shadow-md p-6 space-y-3">
                <div className="flex items-center justify-between text-[10px] font-black uppercase">
                  <span className="text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{n.category}</span>
                  {n.urgent && <span className="text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">Urgent</span>}
                </div>
                <h3 className="text-sm font-bold text-slate-900 leading-snug">{n.title}</h3>
                <p className="text-[11px] text-slate-400">{n.date} • Issued by HOD Office</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* 10. PHOTO GALLERY TEASER */}
      <section className="py-20 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-indigo-400">Campus Life & Infrastructure</div>
              <h2 className="text-3xl font-black text-white tracking-tight">Department Photo Gallery</h2>
            </div>
            <Link to="/gallery" className="text-xs font-black uppercase tracking-wider text-indigo-400 hover:text-indigo-300 inline-flex items-center">
              View All Photos <ArrowRight className="w-4 h-4 ml-1.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((num) => (
              <div key={num} className="h-48 rounded-2xl overflow-hidden bg-slate-800 border border-white/10 group">
                <img 
                  src={getAssetPath(`images/gallery/${num}.webp`)} 
                  alt={`Campus gallery ${num}`} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. CONTACT & INSTITUTION FOOTER */}
      <footer id="contact" className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-800 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <img src={getAssetPath("images/ssiems-logo.png")} alt="SSIEMS" className="h-10 w-auto" />
              <span className="font-black text-white text-base">SSIEMS Parbhani</span>
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Shri Shivaji Institute of Engineering & Management Studies. Approved by AICTE, New Delhi, Affiliated to Dr. BATU, Lonere.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-white text-xs">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => scrollToSection('about')} className="hover:text-white">About Department</button></li>
              <li><button onClick={() => scrollToSection('academics')} className="hover:text-white">Academic Degrees</button></li>
              <li><Link to="/faculty" className="hover:text-white">Faculty Directory</Link></li>
              <li><Link to="/gallery" className="hover:text-white">Campus Gallery</Link></li>
              <li><Link to="/login" className="hover:text-white text-indigo-400 font-bold">Academic Portal Sign In</Link></li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-white text-xs">Head of Department</h4>
            <p className="text-slate-300 font-bold">Prof. Pawar V.K.</p>
            <p>HOD, Computer Science & Engineering</p>
            <p>Email: head.cse@ssiems.in</p>
            <p>Campus Phone: +91 9876543201</p>
          </div>

          <div className="space-y-3">
            <h4 className="font-black uppercase tracking-wider text-white text-xs">Campus Address</h4>
            <p className="flex items-start space-x-2">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Vasmat Road, Near Railway Station, Parbhani - 431401, Maharashtra, India.</span>
            </p>
            <p className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>www.ssiems.org.in</span>
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 Department of Computer Science & Engineering, SSIEMS. All rights reserved.</p>
          <p className="text-slate-500 font-medium">GradeFlow Academic Portal • Autonomous ERP System</p>
        </div>
      </footer>

      {/* Floating Scroll-to-Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-6 right-6 z-40 p-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full shadow-2xl transition-all hover:scale-110"
          title="Back to Top"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default LandingPage;
