import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Award, ShieldCheck, University, Home, Users, BookOpen } from "lucide-react"; 
import { getAssetPath } from "@/lib/utils"; 

const CollegeHeader = () => { 
  const navigation = [ 
    { label: "Home", href: "/", icon: <Home className="h-3.5 w-3.5" /> }, 
    { label: "Department", href: "/#department", icon: <BookOpen className="h-3.5 w-3.5" /> }, 
    { label: "Faculty", href: "/faculty", icon: <Users className="h-3.5 w-3.5" /> }, 
  ]; 

  const infoItems = [ 
    { 
      label: "Approved by AICTE New Delhi & DTE Maharashtra", 
      icon: <CheckCircle2 className="h-4 w-4 text-emerald-600" />, 
    }, 
    { 
      label: "Accredited with \"B\" Grade by NAAC", 
      icon: <Award className="h-4 w-4 text-amber-500" />, 
    }, 
    { 
      label: "ISO 9001:2015 Certified", 
      icon: <ShieldCheck className="h-4 w-4 text-sky-600" />, 
    }, 
    { 
      label: "Affiliated to DBATU, Lonere", 
      icon: <University className="h-4 w-4 text-indigo-600" />, 
    }, 
  ]; 

  return ( 
    <header className="w-full relative z-40"> 
      {/* Top Navigation Bar */}
      <div className="bg-slate-900 text-slate-300 py-1.5 px-6">
        <div className="max-w-7xl mx-auto flex justify-end gap-6">
          {navigation.map((item) => (
            item.href.startsWith('/#') ? (
              <a 
                key={item.label} 
                href={item.href} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors"
              >
                {item.icon}
                {item.label}
              </a>
            ) : (
              <Link 
                key={item.label} 
                to={item.href} 
                className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider hover:text-white transition-colors"
              >
                {item.icon}
                {item.label}
              </Link>
            )
          ))}
        </div>
      </div>

      {/* Main header - Enhanced with light theme matching LandingPage */} 
      <div className="relative backdrop-blur-2xl bg-white/95 border-b border-slate-200 shadow-sm shadow-blue-900/5"> 
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8"> 
          <div className="flex flex-row items-center justify-between gap-2 sm:gap-4 py-2 md:py-4"> 
            {/* Left: College logo with enhanced presentation */} 
            <div className="flex-shrink-0 group"> 
              <Link to="/" className="relative flex items-center justify-center"> 
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-50 group-hover:opacity-75"></div> 
                <img 
                  src={getAssetPath("images/ssiems-logo.png")} 
                  alt="Shri Shivaji Institute of Engineering and Management Studies Logo" 
                  className="relative h-10 sm:h-12 md:h-14 lg:h-16 w-auto object-contain transition-transform duration-500 group-hover:scale-105" 
                /> 
              </Link> 
            </div> 
  
            {/* Center: Trust name + college name with modern typography */} 
            <div className="flex-1 text-center leading-tight px-2 sm:px-4"> 
              <div className="inline-block relative mb-0.5 sm:mb-1 max-w-full"> 
                <p className="relative text-[6px] sm:text-[8px] md:text-xs font-extrabold tracking-wider uppercase text-blue-700 px-1 sm:px-2 break-words"> 
                  Marathwada Shikshan Prasarak Mandal's 
                </p> 
              </div> 
              <h1 className="mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] md:text-sm lg:text-base font-black tracking-tight text-slate-900 leading-tight"> 
                Shri Shivaji Institute of Engineering and Management Studies 
                <span className="hidden md:inline">,</span> 
                <span className="md:hidden"><br /></span> 
                <span className="text-indigo-600 ml-1">Parbhani</span>
                <div className="text-[6px] sm:text-[8px] md:text-[10px] text-blue-600 font-bold uppercase tracking-widest mt-1">
                  Department of Computer Science & Engineering
                </div>
              </h1> 
            </div> 
  
            {/* Right: Ganesh statue + NAAC badge with enhanced display */} 
            <div className="flex-shrink-0 flex items-center justify-end gap-1.5 sm:gap-3 md:gap-4"> 
              <div className="group relative"> 
                <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-75"></div> 
                <img 
                  src={getAssetPath("images/ssiems-ganesh.webp")} 
                  alt="Traditional Ganesh statue" 
                  className="relative h-7 sm:h-8 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
                /> 
              </div> 
              <div className="group relative"> 
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-teal-500/10 rounded-full blur-lg group-hover:blur-xl transition-all duration-500 opacity-0 group-hover:opacity-75"></div> 
                <img 
                  src={getAssetPath("images/ssiems-naac.webp")} 
                  alt="NAAC B Grade Accreditation" 
                  className="relative h-7 sm:h-8 md:h-10 w-auto object-contain transition-transform duration-500 group-hover:scale-110" 
                /> 
              </div> 
            </div> 
          </div> 
        </div> 
      </div> 
  
      <div className="relative backdrop-blur-md bg-slate-50/90 border-b border-slate-200"> 
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-1.5 sm:py-2"> 
          <div className="flex flex-wrap items-center justify-center gap-x-2 sm:gap-x-3 gap-y-1.5 text-[8px] sm:text-[9px] md:text-xs text-slate-600 font-semibold"> 
            {infoItems.map((item, index) => ( 
              <div 
                key={item.label} 
                className="flex items-center gap-1 px-1 py-0.5 rounded-lg hover:bg-blue-50 transition-all duration-300 group" 
              > 
                <div className="transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12"> 
                  {item.icon} 
                </div> 
                <span className="whitespace-normal text-center font-semibold group-hover:text-blue-700 transition-colors duration-300"> 
                  {item.label} 
                </span> 
                {index < infoItems.length - 1 && ( 
                  <span className="hidden md:inline-block w-px h-2.5 bg-slate-300 mx-0.5"></span> 
                )} 
              </div> 
            ))} 
          </div> 
        </div> 
      </div> 
    </header> 
  ); 
}; 

export default CollegeHeader; 
