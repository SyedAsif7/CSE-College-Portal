import React, { useState } from 'react';
import { api } from '../lib/apiClient';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { 
  GraduationCap, UserCheck, ShieldCheck, Eye, EyeOff, 
  ArrowRight, School, Mail, Lock, Loader2, Quote, User
} from 'lucide-react';
import { getAssetPath } from '@/lib/utils';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // 1. HOD / Admin Demo Login
  const handleDemoHODLogin = () => {
    const demoHOD = {
      id: 'admin-pawar',
      name: 'Prof. Pawar V.K.',
      email: 'head.cse@ssiems.in',
      role: 'admin',
      designation: 'Head of Department (CSE)',
      department: 'Computer Science & Engineering'
    };
    localStorage.setItem('user', JSON.stringify(demoHOD));
    localStorage.setItem('token', 'demo-session-token-admin');
    toast.success('Signed in as HOD Prof. Pawar V.K.');
    onLogin(demoHOD);
  };

  // 2. Teacher Demo Login
  const handleDemoTeacherLogin = () => {
    const demoTeacher = {
      id: 'teacher-bpg',
      name: 'Prof. Bais P. G.',
      email: 'bpg@ssiems.org.in',
      role: 'teacher',
      designation: 'Class Teacher (SY-CSE)',
      department: 'Computer Science & Engineering'
    };
    localStorage.setItem('user', JSON.stringify(demoTeacher));
    localStorage.setItem('token', 'demo-session-token-teacher');
    toast.success('Signed in as Prof. Bais P. G.');
    onLogin(demoTeacher);
  };

  // 3. Student Demo Login
  const handleDemoStudentLogin = () => {
    const demoStudent = {
      id: 'student-asif',
      name: 'Syed Asif',
      email: 'asif@ssiems.org.in',
      role: 'student',
      roll_number: '2024SYCSE001',
      class_name: 'SY-CSE',
      department: 'Computer Science & Engineering'
    };
    localStorage.setItem('user', JSON.stringify(demoStudent));
    localStorage.setItem('token', 'demo-session-token-student');
    toast.success('Signed in as Syed Asif.');
    onLogin(demoStudent);
  };

  // Fill credentials
  const fillCredentials = (role) => {
    if (role === 'hod') {
      setEmail('head.cse@ssiems.in');
      setPassword('admin123');
    } else if (role === 'faculty') {
      setEmail('bpg@ssiems.org.in');
      setPassword('teacher123');
    } else if (role === 'student') {
      setEmail('asif@ssiems.org.in');
      setPassword('student123');
    }
    toast.info(`Filled credentials for ${role.toUpperCase()}`);
  };

  // Form submit handler with automatic smart offline fallback
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { user, token } = response.data;
      toast.success('Login successful!');
      if (token) {
        localStorage.setItem('token', token);
      }
      onLogin(user);
    } catch (error) {
      const errorMsg = error.response?.data?.detail || 'Authentication failed. Please verify credentials.';
      
      // If MongoDB is offline, route to the corresponding demo user based on the email entered
      if (errorMsg.includes('Database') || errorMsg.includes('not connected') || error.response?.status === 503) {
        toast.info('Database server offline. Signing in with offline credentials...');
        const lowerEmail = email.toLowerCase();
        if (lowerEmail.includes('hod') || lowerEmail.includes('admin') || lowerEmail.includes('pawar')) {
          handleDemoHODLogin();
          return;
        } else if (lowerEmail.includes('student') || lowerEmail.includes('asif')) {
          handleDemoStudentLogin();
          return;
        } else {
          handleDemoTeacherLogin();
          return;
        }
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50 font-sans selection:bg-blue-600 selection:text-white">
      
      {/* LEFT SECTION: CAMPUS VISUAL & WELCOME BACK */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-slate-950 text-white flex-col justify-between p-12 overflow-hidden">
        {/* Background Campus Building with Dark Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={getAssetPath("images/ssiems-campus.webp")} 
            alt="SSIEMS Campus" 
            className="w-full h-full object-cover object-center filter brightness-60 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-950/80 to-slate-900/75"></div>
        </div>

        {/* Top Branding */}
        <div className="relative z-10 flex items-center space-x-3.5">
          <img 
            src={getAssetPath("images/ssiems-logo.png")} 
            alt="SSIEMS Logo" 
            className="h-12 w-auto object-contain"
          />
          <div>
            <h2 className="text-xl font-black tracking-tight text-white leading-tight">SSIEMS</h2>
            <p className="text-xs text-slate-300 font-medium">Department of Computer Science & Engineering</p>
          </div>
        </div>

        {/* Center Welcome Back Title */}
        <div className="relative z-10 max-w-lg space-y-3 my-auto">
          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Welcome Back!
          </h1>
          <p className="text-slate-300 text-base leading-relaxed">
            Access your role-based academic dashboard to manage, learn and grow.
          </p>
        </div>

        {/* Bottom Quote by Dr. A.P.J. Abdul Kalam */}
        <div className="relative z-10 text-xs text-slate-300/90 border-t border-white/15 pt-5 space-y-1">
          <p className="italic font-medium leading-relaxed flex items-start gap-2">
            <span className="text-lg text-blue-400 font-serif leading-none">“</span>
            <span>Education is the most powerful weapon which you can use to change the world.</span>
            <span className="text-lg text-blue-400 font-serif leading-none">”</span>
          </p>
          <p className="text-slate-400 font-semibold pl-5">
            — Dr. A. P. J. Abdul Kalam
          </p>
        </div>
      </div>

      {/* RIGHT SECTION: AUTHENTICATION CARD */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200/80 shadow-xl p-8 sm:p-10 space-y-6">
          
          {/* Header with Blue Squircle */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-500/25 mx-auto">
              <GraduationCap className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              SSIEMS CSE Academic Portal
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              Sign in to access your role-based dashboard
            </p>
          </div>

          {/* 3 Quick Role Selection Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-1">
            <button
              type="button"
              onClick={handleDemoHODLogin}
              className="p-3 rounded-2xl bg-amber-50/60 hover:bg-amber-100/80 border border-amber-200/80 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] font-black text-amber-900">HOD</div>
              <div className="text-[10px] text-amber-700/90 truncate font-medium">Prof. Pawar V.K.</div>
            </button>

            <button
              type="button"
              onClick={handleDemoTeacherLogin}
              className="p-3 rounded-2xl bg-blue-50/60 hover:bg-blue-100/80 border border-blue-200/80 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-1.5">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] font-black text-blue-900">Faculty</div>
              <div className="text-[10px] text-blue-700/90 truncate font-medium">Prof. Bais P. G.</div>
            </button>

            <button
              type="button"
              onClick={handleDemoStudentLogin}
              className="p-3 rounded-2xl bg-emerald-50/60 hover:bg-emerald-100/80 border border-emerald-200/80 text-left transition-all group"
            >
              <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-1.5">
                <GraduationCap className="w-3.5 h-3.5" />
              </div>
              <div className="text-[11px] font-black text-emerald-900">Student</div>
              <div className="text-[10px] text-emerald-700/90 truncate font-medium">Syed Asif (SY)</div>
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-black uppercase tracking-wider text-slate-400 absolute">
              OR SIGN IN WITH CREDENTIALS
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="email"
                  type="email"
                  placeholder="e.g., hod@ssiems.org.in or student1@ssiems.org.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 text-xs rounded-xl h-11 border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-xs font-bold text-slate-700">
                Password
              </Label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 pr-10 text-xs rounded-xl h-11 border-slate-200 focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-0.5">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-0"
                />
                <span className="text-xs text-slate-600 font-medium">Remember me</span>
              </label>

              <button
                type="button"
                onClick={() => toast.info('Contact department IT admin: head.cse@ssiems.in for password recovery')}
                className="text-xs font-bold text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider h-11 rounded-xl shadow-lg shadow-blue-600/25 transition-all hover:scale-[1.01]"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" /> Verifying...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  Sign In <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </form>

          {/* Quick Available Credentials Pills at Bottom */}
          <div className="pt-2 border-t border-slate-100 text-center space-y-2">
            <span className="text-[10px] font-semibold text-slate-400 block">
              Available Credentials (click to fill):
            </span>
            <div className="flex flex-wrap items-center justify-center gap-1.5">
              <button
                type="button"
                onClick={() => fillCredentials('hod')}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 transition-colors"
              >
                HOD: hod@...
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('faculty')}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 transition-colors"
              >
                Faculty: bpg@...
              </button>
              <button
                type="button"
                onClick={() => fillCredentials('student')}
                className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors"
              >
                Student: student1@...
              </button>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;