import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Users, 
  Mail, 
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MapPin,
  Phone,
  Globe,
  Award,
  TrendingUp,
  Target,
  Rocket,
  FlaskConical,
  ChevronRight,
  School,
  Brain,
  Cpu,
  ShieldCheck,
  Layout,
  ChevronUp,
  ExternalLink,
  Star,
  Zap,
  Coffee,
  Heart,
  Camera,
  Menu,
  X
} from 'lucide-react';
import { getAssetPath } from "@/lib/utils";
import { departmentData } from '../data/departmentData';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

const LandingPage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("dept-overview");
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const sectionRefs = {
    "dept-overview": useRef(null),
    "dept-academics": useRef(null),
    "dept-laboratories": useRef(null),
    "dept-results": useRef(null),
    "dept-placements": useRef(null),
    "dept-association": useRef(null),
    "dept-staff": useRef(null),
    "dept-mous": useRef(null),
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, options);

    Object.values(sectionRefs).forEach((ref) => {
      if (ref.current) observer.observe(ref.current);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const handleStart = () => {
    navigate('/login');
  };

  const navItems = [
    { id: 'dept-overview', label: 'Overview', icon: BookOpen },
    { id: 'dept-academics', label: 'Academics', icon: Brain },
    { id: 'dept-laboratories', label: 'Laboratories', icon: FlaskConical },
    { id: 'dept-results', label: 'Results', icon: Award },
    { id: 'dept-placements', label: 'Placements', icon: TrendingUp },
    { id: 'dept-association', label: 'Association', icon: Users },
    { id: 'dept-staff', label: 'Staff', icon: ShieldCheck },
    { id: 'dept-mous', label: 'MOUs', icon: Globe },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src={getAssetPath("images/ssiems-logo.png")} 
              alt="SSIEMS Logo" 
              className="h-14 w-auto object-contain"
            />
            <div className="h-12 w-px bg-slate-200"></div>
            <div>
              <h1 className="text-sm md:text-base font-bold text-slate-900 tracking-tight leading-tight">
                Department of Computer Science & Engineering
              </h1>
              <p className="text-[10px] md:text-xs text-slate-500 font-semibold"> SSIEMS Institute, Affiliated to DBATU</p>
            </div>
          </div>
          
          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('department')} 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Department
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Contact
            </button>
            <Link 
              to="/gallery" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Gallery
            </Link>
            <Link 
              to="/faculty" 
              className="text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
            >
              Faculty
            </Link>
            <button 
              onClick={handleStart}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
            >
              Sign In
            </button>
          </nav>
        </div>

        {/* Mobile Navigation Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-20 left-0 right-0 bg-white border-b border-slate-200 shadow-xl animate-in slide-in-from-top duration-300">
            <div className="flex flex-col p-6 gap-4">
              <button 
                onClick={() => { scrollToSection('department'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:text-blue-600 p-3 hover:bg-slate-50 rounded-xl transition-all"
              >
                <School className="h-5 w-5 text-blue-500" />
                Department
              </button>
              <button 
                onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} 
                className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:text-blue-600 p-3 hover:bg-slate-50 rounded-xl transition-all"
              >
                <Mail className="h-5 w-5 text-blue-500" />
                Contact
              </button>
              <Link 
                to="/gallery" 
                className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:text-blue-600 p-3 hover:bg-slate-50 rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Camera className="h-5 w-5 text-blue-500" />
                Gallery
              </Link>
              <Link 
                to="/faculty" 
                className="flex items-center gap-3 text-lg font-bold text-slate-700 hover:text-blue-600 p-3 hover:bg-slate-50 rounded-xl transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Users className="h-5 w-5 text-blue-500" />
                Faculty
              </Link>
              <div className="h-px bg-slate-100 my-2"></div>
              <button 
                onClick={() => { handleStart(); setIsMobileMenuOpen(false); }}
                className="w-full bg-blue-600 text-white py-4 rounded-xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-3"
              >
                Sign In to Portal <ArrowRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="relative py-16 md:py-32 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url("${getAssetPath("images/ssiems-campus.webp")}")` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/95 via-indigo-900/90 to-slate-900/95"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 text-center text-white">
          <div className="inline-block bg-white/10 backdrop-blur-md px-4 sm:px-6 py-2 rounded-full mb-6 md:mb-8 border border-white/20">
            <p className="text-xs sm:text-sm font-bold tracking-wider">NAAC 'B' Grade | ISO 9001:2015 | AICTE Approved</p>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black mb-4 md:mb-6 tracking-tight leading-tight">
            Shaping Future
            <br />
            <span className="bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              Technology Leaders
            </span>
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-slate-200 max-w-2xl mx-auto font-medium leading-relaxed mb-8 md:mb-10 tracking-normal">
            Empowering students with cutting-edge education in Computer Science and Engineering through innovation, research, and excellence.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={handleStart}
              className="w-full sm:w-auto bg-white text-blue-900 px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-blue-50 transition-all shadow-2xl shadow-blue-900/50 flex items-center justify-center gap-3"
            >
              Sign In to Academic Portal <ArrowRight className="h-5 md:h-6 w-5 md:w-6" />
            </button>
            <button 
              onClick={() => scrollToSection('department')}
              className="w-full sm:w-auto bg-white/10 backdrop-blur-md text-white px-6 md:px-10 py-3 md:py-4 rounded-xl font-bold text-base md:text-lg hover:bg-white/20 transition-all border-2 border-white/30"
            >
              Learn More About CSE
            </button>
          </div>
        </div>
      </section>

      {/* Department Section */}
      <section id="department" className="py-12 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col items-center text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 text-xs sm:text-sm font-black uppercase tracking-widest mb-4">
              <School className="h-4 w-4" />
              Academic Excellence
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Department of <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">CSE</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
              Leading the way in computer science education since 2010. We combine technical rigor with innovation to shape the tech leaders of tomorrow.
            </p>
          </div>

          <div className="grid xl:grid-cols-12 gap-8 md:gap-12 items-start relative">
            {/* Sticky Sidebar Navigation (Visible on Large Screens 1280px+) */}
            <aside className="xl:col-span-3 sticky top-28 hidden xl:block space-y-2 p-4 bg-white/50 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 shadow-sm">
              <div className="px-4 py-2 mb-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Menu</p>
              </div>
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 group ${
                    activeSection === item.id
                      ? 'bg-blue-600 text-white shadow-lg translate-x-1'
                      : 'text-slate-500 hover:bg-white hover:text-blue-600 hover:shadow-md hover:translate-x-1'
                  }`}
                >
                  <item.icon className={`h-5 w-5 transition-transform duration-300 group-hover:scale-110 ${activeSection === item.id ? 'text-blue-100' : 'text-slate-400 group-hover:text-blue-500'}`} />
                  <span className="tracking-tight">{item.label}</span>
                </button>
              ))}
            </aside>

            {/* Tablet/Mobile Sticky Menu (Below 1280px) */}
            <div className="xl:hidden col-span-12 sticky top-20 z-40 bg-white/95 backdrop-blur-2xl py-4 -mx-4 sm:-mx-6 px-4 sm:px-6 border-b border-slate-200/60 shadow-sm">
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600/10 p-1.5 rounded-lg">
                    <Layout className="h-4 w-4 text-blue-600" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Navigation</p>
                  <div className="h-px flex-1 bg-slate-100"></div>
                </div>
                <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-2 px-2 pb-1">
                  {navItems.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-300 border ${
                        activeSection === item.id
                          ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-100'
                          : 'bg-white text-slate-500 border-slate-100 hover:border-blue-200 hover:text-blue-600'
                      }`}
                    >
                      <item.icon className={`h-3.5 w-3.5 ${activeSection === item.id ? 'text-white' : 'text-slate-400'}`} />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Main Content Sections (Infinite Scroll) */}
            <div className="xl:col-span-9 space-y-16 md:space-y-24 pb-16 md:pb-24">

              {/* Overview Section */}
              <section id="dept-overview" ref={sectionRefs["dept-overview"]} className="scroll-mt-32 space-y-8 md:space-y-12">
                <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
                  <Card className="lg:col-span-2 border border-slate-200/60 shadow-xl rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden group hover:border-blue-300/50 transition-all duration-500">
                    <div className="bg-gradient-to-br from-blue-700 via-indigo-700 to-slate-900 p-6 md:p-10 text-white relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-400/10 rounded-full -mr-48 -mt-48 blur-[100px]"></div>
                      <CardHeader className="p-0 mb-4 md:mb-6 relative z-10">
                        <CardTitle className="flex items-center gap-3 md:gap-4 text-2xl md:text-3xl font-black tracking-tight">
                          <BookOpen className="h-8 md:h-10 w-8 md:w-10 text-blue-200" />
                          About the Department
                        </CardTitle>
                      </CardHeader>
                      <p className="text-blue-50/90 text-base md:text-lg leading-relaxed font-medium relative z-10">
                        {departmentData.about}
                      </p>
                    </div>
                    <CardContent className="p-6 md:p-10 grid md:grid-cols-2 gap-8 md:gap-10 bg-white">
                      <div className="space-y-4 md:space-y-6">
                        <h4 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                          <Rocket className="h-5 md:h-6 w-5 md:w-6 text-blue-600" />
                          Our Vision
                        </h4>
                        <div className="relative pl-5 md:pl-6">
                          <div className="absolute left-0 top-0 bottom-0 w-1 md:w-1.5 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                          <p className="text-slate-700 text-sm md:text-base font-bold italic leading-relaxed">
                            "{departmentData.vision}"
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4 md:space-y-6">
                        <h4 className="text-lg md:text-xl font-black text-slate-900 flex items-center gap-3 tracking-tight">
                          <Target className="h-5 md:h-6 w-5 md:w-6 text-indigo-600" />
                          Our Mission
                        </h4>
                        <ul className="space-y-3 md:space-y-4">
                          {departmentData.mission.map((m, i) => (
                            <li key={i} className="flex items-start gap-3 group/item">
                              <div className="h-5 md:h-6 w-5 md:w-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover/item:bg-indigo-600 transition-colors duration-300">
                                <CheckCircle2 className="h-3 md:h-4 w-3 md:w-4 text-indigo-600 group-hover/item:text-white transition-colors" />
                              </div>
                              <span className="text-slate-700 text-xs md:text-sm font-bold leading-relaxed">{m}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="space-y-6 md:space-y-8">
                    <Card className="border border-slate-200/60 shadow-lg rounded-[1.5rem] md:rounded-[2rem] overflow-hidden hover:border-blue-300/50 transition-all duration-500 bg-slate-50/30">
                      <CardHeader className="p-6 md:p-8 border-b border-slate-100 bg-white">
                        <CardTitle className="flex items-center gap-2 md:gap-3 text-xl md:text-2xl font-black text-slate-900 tracking-tight">
                          <Award className="h-6 md:h-7 w-6 md:w-7 text-blue-600" />
                          Core Objectives
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-6 md:p-8">
                        <ul className="space-y-4 md:space-y-6">
                          {departmentData.objectives.map((obj, i) => (
                            <li key={i} className="flex items-start gap-3 md:gap-4">
                              <div className="h-7 md:h-8 w-7 md:w-8 rounded-lg md:rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs md:text-sm font-black flex-shrink-0 shadow-lg">
                                {i + 1}
                              </div>
                              <span className="text-slate-700 text-xs md:text-sm font-bold leading-relaxed">{obj}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card className="border border-blue-100 shadow-xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden bg-gradient-to-br from-white to-blue-50/50 group cursor-pointer" onClick={() => navigate('/gallery')}>
                      <CardContent className="p-6 md:p-8 text-center space-y-3 md:space-y-4">
                        <div className="mx-auto w-12 md:w-16 h-12 md:h-16 bg-blue-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 group-hover:scale-110 transition-transform">
                          <Camera className="h-6 md:h-8 w-6 md:w-8" />
                        </div>
                        <h4 className="text-lg md:text-xl font-black text-slate-900 tracking-tight">Campus Life Gallery</h4>
                        <p className="text-slate-500 text-xs md:text-sm font-medium">Explore our state-of-the-art infrastructure and vibrant student activities.</p>
                        <div className="inline-flex items-center gap-2 text-blue-600 font-bold text-xs md:text-sm">
                          View All Photos <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-center gap-4 md:gap-6">
                    <h3 className="text-xl md:text-2xl font-black text-slate-900 uppercase tracking-widest">Strategic Goals</h3>
                    <div className="h-px flex-1 bg-gradient-to-r from-slate-200 to-transparent"></div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {departmentData.shortRangeGoals.map((goal, i) => (
                      <div key={i} className="flex items-start gap-3 md:gap-4 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-white border-2 border-slate-100 hover:border-blue-400 hover:shadow-2xl transition-all group">
                        <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                          <ChevronRight className="h-4 md:h-5 w-4 md:w-5" />
                        </div>
                        <span className="text-slate-700 font-bold text-xs md:text-sm leading-relaxed">{goal}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Academics Section */}
              <section id="dept-academics" ref={sectionRefs["dept-academics"]} className="scroll-mt-32 space-y-12">
                <div className="flex flex-col items-center text-center mb-12">
                  <h3 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">Academic Framework</h3>
                  <div className="h-1.5 w-24 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
                </div>

                <div className="grid lg:grid-cols-2 gap-12">
                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-blue-600 to-blue-700 text-white rounded-[1.5rem] shadow-lg">
                        <Brain className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">PEO</h4>
                        <p className="text-blue-600 font-black uppercase tracking-widest text-xs">Educational Objectives</p>
                      </div>
                    </div>
                    <div className="grid gap-6">
                      {departmentData.peos.map((peo) => (
                        <div key={peo.id} className="p-8 bg-white border border-slate-100 rounded-[2rem] hover:border-blue-400/50 transition-all duration-500 hover:shadow-lg group relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-bl-full -mr-12 -mt-12 group-hover:bg-blue-600 transition-colors duration-500"></div>
                          <div className="relative z-10 text-[10px] font-black text-blue-600 mb-2 tracking-[0.2em] uppercase group-hover:text-white/80 transition-colors">{peo.id}</div>
                          <p className="relative z-10 text-slate-700 font-bold text-lg leading-relaxed group-hover:text-slate-900 transition-colors">{peo.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  <section className="space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="p-4 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-[1.5rem] shadow-lg">
                        <Cpu className="h-8 w-8" />
                      </div>
                      <div>
                        <h4 className="text-2xl font-black text-slate-900 tracking-tight">PO</h4>
                        <p className="text-indigo-600 font-black uppercase tracking-widest text-xs">Programme Outcomes</p>
                      </div>
                    </div>
                    <div className="grid gap-4">
                      {departmentData.pos.map((po) => (
                        <div key={po.id} className="flex gap-5 p-6 bg-white border border-slate-100 rounded-2xl hover:border-indigo-400/50 transition-all duration-500 hover:shadow-md group">
                          <div className="h-12 w-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black text-base flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm">
                            {po.id.replace('PO', '')}
                          </div>
                          <p className="text-slate-700 text-base font-bold leading-relaxed group-hover:text-slate-900 transition-colors">{po.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                <div className="pt-12 md:pt-16 border-t border-slate-100">
                  <div className="flex items-center gap-4 md:gap-5 mb-8 md:mb-12">
                    <div className="p-3 md:p-4 bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-2xl md:rounded-[1.5rem] shadow-lg">
                      <Globe className="h-6 md:h-8 w-6 md:w-8" />
                    </div>
                    <div>
                      <h4 className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">PSO</h4>
                      <p className="text-cyan-600 font-black uppercase tracking-widest text-[10px] md:text-xs">Program Specific Outcomes</p>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {departmentData.psos.map((pso) => (
                      <Card key={pso.id} className="border border-slate-100 shadow-sm hover:border-cyan-400/50 transition-all duration-500 hover:shadow-xl rounded-[1.5rem] md:rounded-[2rem] overflow-hidden group">
                        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 h-1.5 md:h-2 w-full"></div>
                        <CardHeader className="p-6 md:p-8 pb-3 md:pb-4">
                          <CardTitle className="text-xl md:text-2xl font-black text-slate-900">{pso.id}</CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 md:p-8 pt-0">
                          <p className="text-slate-700 font-bold leading-relaxed text-xs md:text-sm">{pso.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </section>

              {/* Laboratories Section */}
              <section id="dept-laboratories" ref={sectionRefs["dept-laboratories"]} className="scroll-mt-32 space-y-8 md:space-y-12">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">World-Class Laboratories</h3>
                  <p className="text-base md:text-lg text-slate-500 max-w-2xl leading-relaxed">
                    Practical exposure to cutting-edge technologies with state-of-the-art infrastructure and dedicated research facilities.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 md:gap-10">
                  {departmentData.laboratories.map((lab, i) => (
                    <Card key={i} className="border border-slate-200/60 shadow-lg rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden hover:border-blue-400/50 transition-all duration-500 group bg-white">
                      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-6 md:p-8 flex items-center justify-between relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-blue-600/20 transition-all duration-700"></div>
                        <CardTitle className="text-xl md:text-2xl font-black text-white flex items-center gap-3 md:gap-4 relative z-10 tracking-tight">
                          <FlaskConical className="h-6 md:h-8 w-6 md:w-8 text-blue-400" />
                          {lab.name}
                        </CardTitle>
                        <div className="h-10 md:h-12 w-10 md:w-12 bg-white/10 rounded-xl md:rounded-2xl flex items-center justify-center text-white/40 font-black text-lg md:text-xl border border-white/10 relative z-10">
                          {String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <CardContent className="p-6 md:p-10">
                        {lab.area ? (
                          <div className="space-y-6 md:space-y-8">
                            <div className="grid grid-cols-2 gap-6 md:gap-10">
                              <div className="space-y-1 md:space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lab Area</span>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{lab.area}</p>
                              </div>
                              <div className="space-y-1 md:space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Platform</span>
                                <p className="text-xl md:text-2xl font-black text-slate-900 tracking-tight">{lab.os}</p>
                              </div>
                            </div>
                            <div className="p-4 md:p-6 bg-slate-50 rounded-xl md:rounded-2xl border border-slate-100 relative group-hover:bg-blue-50/50 transition-colors duration-500">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 md:mb-3 block">Hardware Specifications</span>
                              <p className="text-sm md:text-base font-bold text-slate-600 leading-relaxed italic">
                                {lab.hardware}
                              </p>
                            </div>
                            <div className="grid grid-cols-2 gap-6 md:gap-10 pt-4 md:pt-6 border-t border-slate-100">
                              <div className="space-y-1 md:space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Software Stack</span>
                                <p className="text-base md:text-lg font-black text-blue-600 tracking-tight">{lab.software}</p>
                              </div>
                              <div className="space-y-1 md:space-y-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In-charge</span>
                                <p className="text-base md:text-lg font-black text-indigo-600 tracking-tight">{lab.incharge}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="py-12 md:py-20 flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-100 rounded-2xl md:rounded-3xl bg-slate-50/50">
                            <Layout className="h-12 md:h-16 w-12 md:w-16 mb-4 md:mb-6 opacity-20" />
                            <p className="font-bold text-base md:text-lg italic text-center px-6 md:px-10 leading-relaxed">Detailed inventory records maintained at department office</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </section>

              {/* Results Section */}
              <section id="dept-results" ref={sectionRefs["dept-results"]} className="scroll-mt-32 space-y-12 md:space-y-24">
                <div className="flex flex-col items-center text-center mb-8 md:mb-12">
                  <div className="p-4 md:p-5 bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl md:rounded-[2rem] shadow-lg mb-4 md:mb-6">
                    <Award className="h-8 md:h-10 w-8 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Meritorious Toppers</h3>
                  <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Celebrating Academic Excellence</p>
                </div>

                <div className="grid gap-12 md:gap-24">
                  {Object.entries(departmentData.toppers).reverse().map(([year, students]) => (
                    <div key={year} className="space-y-6 md:space-y-10">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="bg-slate-900 text-white px-6 md:px-10 py-3 md:py-4 rounded-[1rem] md:rounded-[1.5rem] text-lg md:text-2xl font-black tracking-tight shadow-xl">
                          Academic Year {year}
                        </div>
                        <div className="h-1 flex-1 bg-gradient-to-r from-slate-200 to-transparent rounded-full"></div>
                      </div>
                      <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden">
                        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                          <Table>
                            <TableHeader className="bg-slate-50/80">
                              <TableRow>
                                <TableHead className="py-6 md:py-8 pl-6 md:pl-10 font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Class</TableHead>
                                <TableHead className="font-black text-slate-500 uppercase tracking-widest text-[10px] text-center whitespace-nowrap">Semester</TableHead>
                                <TableHead className="font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Full Name</TableHead>
                                <TableHead className="font-black text-slate-500 uppercase tracking-widest text-[10px] text-center whitespace-nowrap">Score</TableHead>
                                <TableHead className="text-right pr-6 md:pr-10 font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Merit</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {students.map((student, idx) => (
                                <TableRow key={idx} className="hover:bg-blue-50/40 transition-colors border-b border-slate-50 last:border-0 group">
                                  <TableCell className="py-6 md:py-8 pl-6 md:pl-10 font-black text-blue-700 text-lg md:text-xl tracking-tight whitespace-nowrap">{student.class}</TableCell>
                                  <TableCell className="font-bold text-slate-400 text-center text-base md:text-lg whitespace-nowrap">{student.sem}</TableCell>
                                  <TableCell className="font-black text-slate-900 text-lg md:text-xl group-hover:text-blue-600 transition-colors tracking-tight whitespace-nowrap">{student.name}</TableCell>
                                  <TableCell className="font-black text-xl md:text-2xl text-slate-900 text-center tracking-tight whitespace-nowrap">{student.cgpa || student.sgpa}</TableCell>
                                  <TableCell className="text-right pr-6 md:pr-10">
                                    <span className={`inline-flex items-center px-4 md:px-8 py-2 md:py-3 rounded-xl md:rounded-2xl text-[10px] font-black tracking-widest uppercase shadow-sm border-2 whitespace-nowrap ${
                                      student.rank === 'Ist' || student.rank === '1st' 
                                        ? 'bg-amber-50 text-amber-700 border-amber-200 shadow-amber-100' 
                                        : student.rank === '2nd' 
                                          ? 'bg-slate-50 text-slate-700 border-slate-200' 
                                          : 'bg-orange-50 text-orange-700 border-orange-200'
                                    }`}>
                                      {student.rank} Rank
                                    </span>
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-16 md:pt-24 border-t border-slate-100">
                  <div className="flex flex-col items-center text-center mb-12 md:mb-16">
                    <div className="p-4 md:p-5 bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-[1.5rem] md:rounded-[2rem] shadow-lg mb-6">
                      <TrendingUp className="h-8 md:h-10 w-8 md:w-10" />
                    </div>
                    <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">Result Analytics</h3>
                    <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Passing Statistics & Trends</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                    {Object.entries(departmentData.results).reverse().map(([year, stats]) => (
                      <div key={year} className="space-y-6 md:space-y-8">
                        <div className="flex items-center gap-4">
                          <h4 className="text-xl md:text-2xl font-black text-slate-900 bg-emerald-50 px-6 md:px-8 py-3 md:py-4 rounded-[1.2rem] md:rounded-[1.5rem] inline-block border border-emerald-100 shadow-sm">Batch {year}</h4>
                          <div className="h-1 flex-1 bg-emerald-100/50 rounded-full"></div>
                        </div>
                        <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/60 shadow-lg overflow-hidden">
                          <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                            <Table>
                              <TableHeader className="bg-slate-50/80">
                                <TableRow>
                                  <TableHead className="py-6 md:py-8 pl-6 md:pl-8 font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Class & Sem</TableHead>
                                  <TableHead className="text-center font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Appeared</TableHead>
                                  <TableHead className="text-center font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Passed</TableHead>
                                  <TableHead className="text-right pr-6 md:pr-8 font-black text-slate-500 uppercase tracking-widest text-[10px] whitespace-nowrap">Passing %</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {stats.map((stat, idx) => (
                                  <TableRow key={idx} className="hover:bg-emerald-50/40 transition-colors border-b border-slate-50 last:border-0 group">
                                    <TableCell className="py-4 md:py-6 pl-6 md:pl-8 font-black text-slate-900 text-base md:text-lg tracking-tight whitespace-nowrap">{stat.class} - {stat.sem}</TableCell>
                                    <TableCell className="text-center font-bold text-slate-600 text-lg md:text-xl tracking-tight">{stat.appeared}</TableCell>
                                    <TableCell className="text-center font-black text-emerald-600 text-lg md:text-xl tracking-tight">{stat.passed}</TableCell>
                                    <TableCell className="text-right pr-6 md:pr-8">
                                      <div className="flex flex-col items-end gap-2">
                                        <span className="font-black text-xl md:text-2xl text-slate-900 tracking-tight">{stat.percentage}%</span>
                                        <div className="w-24 md:w-32 h-2 md:h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/50">
                                          <div 
                                            className={`h-full rounded-full transition-all duration-1000 ${stat.percentage > 85 ? 'bg-emerald-500' : stat.percentage > 60 ? 'bg-blue-500' : 'bg-amber-500'}`}
                                            style={{ width: `${stat.percentage}%` }}
                                          ></div>
                                        </div>
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* Placements Section */}
              <section id="dept-placements" ref={sectionRefs["dept-placements"]} className="scroll-mt-32 space-y-8 md:space-y-16">
                <div className="flex flex-col items-center text-center mb-8 md:mb-16">
                  <div className="p-4 md:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl md:rounded-[2rem] shadow-lg mb-4 md:mb-6">
                    <TrendingUp className="h-8 md:h-10 w-8 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Placement Hall of Fame</h3>
                  <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Industry Partnerships & Global Careers</p>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-[3rem] border border-slate-200/60 shadow-xl overflow-hidden">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <Table>
                      <TableHeader className="bg-slate-900">
                        <TableRow>
                          <TableHead className="py-5 md:py-10 pl-6 md:pl-10 font-black text-white/40 uppercase tracking-widest text-[10px] whitespace-nowrap">Student Name</TableHead>
                          <TableHead className="font-black text-white/40 uppercase tracking-widest text-[10px] whitespace-nowrap">Recruiting Company</TableHead>
                          <TableHead className="font-black text-white/40 uppercase tracking-widest text-[10px] text-center whitespace-nowrap">Package (CTC)</TableHead>
                          <TableHead className="text-right pr-6 md:pr-10 font-black text-white/40 uppercase tracking-widest text-[10px] whitespace-nowrap">Batch</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentData.placements.map((placement, idx) => (
                          <TableRow key={idx} className="hover:bg-slate-50 transition-all duration-300 border-b border-slate-50 last:border-0 group">
                            <TableCell className="py-5 md:py-8 pl-6 md:pl-10 font-black text-slate-900 text-base md:text-xl tracking-tight whitespace-nowrap">{placement.name}</TableCell>
                            <TableCell className="font-black text-blue-600 text-base md:text-xl whitespace-nowrap">
                              <span className="px-3 md:px-6 py-1.5 md:py-3 bg-blue-50 rounded-lg md:rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm inline-block tracking-tight">
                                {placement.company}
                              </span>
                            </TableCell>
                            <TableCell className="font-black text-emerald-600 text-lg md:text-2xl text-center tracking-tight whitespace-nowrap">
                              <div className="flex items-center justify-center gap-1.5 md:gap-2">
                                <TrendingUp className="h-4 md:h-5 w-4 md:w-5 opacity-40" />
                                {placement.package}
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-6 md:pr-10 font-bold text-slate-400 text-sm md:text-lg italic tracking-tight whitespace-nowrap">{placement.year}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </section>

              {/* Students Association Section */}
              <section id="dept-association" ref={sectionRefs["dept-association"]} className="scroll-mt-32 space-y-12 md:space-y-24">
                <div className="flex flex-col items-center text-center mb-8 md:mb-16">
                  <div className="p-4 md:p-5 bg-gradient-to-br from-indigo-600 to-purple-700 text-white rounded-2xl md:rounded-[2rem] shadow-lg mb-4 md:mb-6">
                    <Users className="h-8 md:h-10 w-8 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Students Association</h3>
                  <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Leadership & Community Engagement</p>
                </div>

                <div className="space-y-16 md:space-y-32">
                  {['2025-26', '2024-25', '2023-24', '2022-23', '2021-22'].map((year) => {
                    const committee = departmentData.studentAssociation[year];
                    if (!committee) return null;

                    return (
                      <div key={year} className="space-y-6 md:space-y-12">
                        <div className="flex items-center gap-4 md:gap-8">
                          <div className="relative">
                            <h4 className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">Batch {year}</h4>
                            <div className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-1 md:h-1.5 bg-gradient-to-r from-indigo-600 to-transparent rounded-full"></div>
                          </div>
                          <div className="h-px flex-1 bg-slate-100"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                          {committee.map((member, idx) => {
                            return (
                              <div 
                                key={idx} 
                                className="group relative p-6 md:p-8 rounded-[1.5rem] md:rounded-[2.5rem] border bg-white border-slate-100 hover:border-indigo-200 hover:shadow-xl transition-all duration-500 overflow-hidden"
                              >
                                <div className="absolute top-0 right-0 p-4 md:p-6 opacity-10 group-hover:scale-110 transition-transform duration-500 text-indigo-900">
                                  {member.designation.includes('President') ? <Star className="h-12 md:h-16 w-12 md:w-16" /> : 
                                   member.designation.includes('Technical') ? <Zap className="h-12 md:h-16 w-12 md:w-16" /> :
                                   member.designation.includes('Cultural') ? <Heart className="h-12 md:h-16 w-12 md:w-16" /> :
                                   <Users className="h-12 md:h-16 w-12 md:w-16" />}
                                </div>

                                <div className="inline-flex px-3 md:px-4 py-1 md:py-1.5 rounded-lg md:rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 md:mb-6 bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                  {member.designation}
                                </div>

                                <div className="space-y-1">
                                  {member.name.split(',').map((name, i, arr) => (
                                    <h5 key={i} className="text-sm md:text-base font-bold leading-tight tracking-tight text-slate-900">
                                      {name.trim()}{i < arr.length - 1 ? ',' : ''}
                                    </h5>
                                  ))}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>

              {/* Staff Section */}
              <section id="dept-staff" ref={sectionRefs["dept-staff"]} className="scroll-mt-32 space-y-12 md:space-y-16">
                <div className="flex flex-col items-center text-center mb-8 md:mb-16">
                  <div className="p-4 md:p-5 bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-2xl md:rounded-[2rem] shadow-lg mb-4 md:mb-6">
                    <ShieldCheck className="h-8 md:h-10 w-8 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Faculty Accomplishments</h3>
                  <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Research, Publications & Academic Leadership</p>
                </div>

                <div className="bg-white rounded-[1.5rem] md:rounded-[2.5rem] border border-slate-200/60 shadow-2xl overflow-hidden">
                  <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-slate-900 hover:bg-slate-900 border-none">
                          <TableHead rowSpan={2} className="py-5 md:py-10 pl-6 md:pl-10 font-black text-white text-base md:text-xl tracking-tight border-r border-white/10 whitespace-nowrap">Faculty Member</TableHead>
                          <TableHead colSpan={2} className="text-center font-black text-blue-400 uppercase tracking-widest text-[10px] border-b border-white/10 border-r border-white/10 py-3 md:py-4 whitespace-nowrap">National Research</TableHead>
                          <TableHead colSpan={2} className="text-center font-black text-indigo-400 uppercase tracking-widest text-[10px] border-b border-white/10 border-r border-white/10 py-3 md:py-4 whitespace-nowrap">International Research</TableHead>
                          <TableHead rowSpan={2} className="text-center font-black text-white pr-6 md:pr-10 text-base md:text-xl tracking-tight whitespace-nowrap">Workshops</TableHead>
                        </TableRow>
                        <TableRow className="bg-slate-900 hover:bg-slate-900 border-none">
                          <TableHead className="text-center py-3 md:py-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/60 border-r border-white/10 whitespace-nowrap">Journal</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/60 border-r border-white/10 whitespace-nowrap">Conf.</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/60 border-r border-white/10 whitespace-nowrap">Journal</TableHead>
                          <TableHead className="text-center text-[10px] font-black uppercase tracking-[0.2em] text-white/60 border-r border-white/10 whitespace-nowrap">Conf.</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {departmentData.staffAchievements.map((staff, idx) => (
                          <TableRow key={idx} className="hover:bg-slate-50/80 transition-all duration-300 border-b border-slate-100 last:border-0 group">
                            <TableCell className="py-5 md:py-10 pl-6 md:pl-10 border-r border-slate-100 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-black text-slate-900 text-base md:text-xl tracking-tight group-hover:text-blue-600 transition-colors duration-300">{staff.name}</span>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">CSE Faculty</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-center border-r border-slate-100 font-black text-slate-600 text-base md:text-xl tabular-nums">{staff.nationalJournal}</TableCell>
                            <TableCell className="text-center border-r border-slate-100 font-black text-slate-600 text-base md:text-xl tabular-nums">{staff.nationalConference}</TableCell>
                            <TableCell className="text-center border-r border-slate-100 font-black text-slate-600 text-base md:text-xl tabular-nums">{staff.internationalJournal}</TableCell>
                            <TableCell className="text-center border-r border-slate-100 font-black text-slate-600 text-base md:text-xl tabular-nums">{staff.internationalConference}</TableCell>
                            <TableCell className="text-center pr-6 md:pr-10">
                              <div className="flex items-center justify-center">
                                <span className="inline-flex items-center justify-center min-w-[2.5rem] md:min-w-[3.5rem] h-10 md:h-14 bg-gradient-to-br from-indigo-600 to-blue-700 text-white rounded-xl md:rounded-2xl font-black text-lg md:text-2xl shadow-lg shadow-indigo-200 group-hover:scale-110 transition-all duration-500">
                                  {staff.workshops}
                                </span>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </section>

              {/* MOUs Section */}
              <section id="dept-mous" ref={sectionRefs["dept-mous"]} className="scroll-mt-32 space-y-12 md:space-y-16">
                <div className="flex flex-col items-center text-center mb-8 md:mb-16">
                  <div className="p-4 md:p-5 bg-gradient-to-br from-cyan-600 to-blue-700 text-white rounded-2xl md:rounded-[2rem] shadow-lg mb-4 md:mb-6">
                    <Globe className="h-8 md:h-10 w-8 md:w-10" />
                  </div>
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 md:mb-4 tracking-tight">Global Network</h3>
                  <p className="text-sm md:text-lg text-slate-500 font-medium uppercase tracking-widest">Strategic Industry & Academic Collaborations</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                  {departmentData.mous.map((mou, idx) => (
                    <div key={idx} className="group relative bg-white p-6 md:p-10 rounded-[1.5rem] md:rounded-[3rem] border border-slate-100 hover:border-blue-400/50 hover:shadow-2xl transition-all duration-700 flex items-start gap-4 md:gap-8 overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 md:w-32 h-24 md:h-32 bg-blue-50/50 rounded-bl-full -mr-12 -mt-12 md:-mr-16 md:-mt-16 group-hover:bg-blue-600 transition-colors duration-700"></div>
                      <div className="relative z-10 flex-shrink-0 h-12 md:h-16 w-12 md:w-16 bg-blue-50 text-blue-600 rounded-xl md:rounded-2xl flex items-center justify-center text-lg md:text-2xl font-black group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                        {idx + 1}
                      </div>
                      <div className="relative z-10 flex-1 pt-1 md:pt-2">
                        <div className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-1 md:mb-2 opacity-60 group-hover:text-white transition-colors">Strategic Partnership</div>
                        <p className="text-lg md:text-xl font-black text-slate-800 leading-relaxed group-hover:text-slate-900 transition-colors tracking-tight">
                          {mou}
                        </p>
                        <div className="mt-4 md:mt-6 flex items-center gap-2 text-xs md:text-sm font-black text-blue-600 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                          Learn More <ExternalLink className="h-4 w-4" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12 mb-12">
            <div>
              <img src={getAssetPath("images/ssiems-logo.png")} alt="SSIEMS" className="h-16 w-auto mb-4 bg-white p-2 rounded-lg" />
              <p className="text-slate-400 font-medium text-sm leading-relaxed">
                Shree Shivaji Education Society's Institute of Technology, recognized for excellence in technical education.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-white/50 uppercase tracking-widest text-xs">Quick Links</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => scrollToSection('department')} 
                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    About Department
                  </button>
                </li>
                <li><Link to="/faculty" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">Faculty Profiles</Link></li>
                <li>
                  <button 
                    onClick={() => scrollToSection('contact')} 
                    className="text-slate-400 hover:text-white transition-colors text-sm font-medium"
                  >
                    Contact Us
                  </button>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4 text-white/50 uppercase tracking-widest text-xs">Department Sections</h4>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.id}>
                    <button 
                      onClick={() => scrollToSection(item.id)} 
                      className="text-slate-400 hover:text-white transition-colors text-sm font-medium text-left"
                    >
                      {item.label === 'Association' ? 'Students Association' : item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Student Resources</h4>
              <ul className="space-y-3">
                {['Examination Portal', 'Assignment System', 'Class Timetables', 'Exam Schedules', 'Academic Calendar'].map((link) => (
                  <li key={link}>
                    <a href="#" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">{link}</a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-slate-400 text-sm">
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>SSIEMS Campus, Amravati Road, Badnera, Dist. Amravati - 444701</span>
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>+91-XXX-XXXXXXX</span>
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <span>cse@ssiems.org.in</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm font-medium">
            <p>&copy; 2025 Department of Computer Science & Engineering, SSIEMS. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-8 right-8 z-[60] p-4 bg-blue-600 text-white rounded-2xl shadow-2xl transition-all duration-500 hover:bg-blue-700 hover:scale-110 active:scale-95 group ${
          showScrollTop ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}
      >
        <ChevronUp className="h-6 w-6 group-hover:-translate-y-1 transition-transform" />
      </button>
    </div>
  );
};

export default LandingPage;
