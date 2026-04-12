import React from 'react';
import { Link } from 'react-router-dom';
import CollegeHeader from './CollegeHeader';
import { getAssetPath } from "@/lib/utils";

const facultyData = [
  {
    name: "Prof. Pawar V.K.",
    image: getAssetPath("faculty/Pawar V.K..webp"),
    designation: "HOD & Assistant Professor",
    qualification: "BE(CSE), ME(CSE)",
    experience: "Teaching: 11 Years & Industrial : 2 Years",
    areaOfInterest: "Machine Learning, Networks, OS, Front End Technologies",
    email: ["head.cse@ssiems.in", "vinod.pawar@ssiems.in"]
  },
  {
    name: "Prof. Magar A. R.",
    image: getAssetPath("faculty/Magar A. R..webp"),
    designation: "Assistant Professor",
    qualification: "BE(CSE), ME(CSE)",
    experience: "Teaching: 14 Years",
    areaOfInterest: "Design and analysis of algorithm, Database System",
    email: ["admissions@ssiems.in", "amol.magar@cse.ssiems.in"]
  },
  {
    name: "Prof. Devkar R. S.",
    image: getAssetPath("faculty/Devkar R. S..webp"),
    designation: "Assistant Professor",
    qualification: "B.Tech(IT) ,M.Tech (CSE)",
    experience: "Teaching: 12 Years",
    areaOfInterest: "Compiler, TOC, NM and CPC",
    email: ["rajesh.devkar@cse.ssiems.in"]
  },
  {
    name: "Prof. Shelke S. B.",
    image: getAssetPath("faculty/Shelke S. B..webp"),
    designation: "Assistant Professor",
    qualification: "BE (CSE), M.Tech (CSE)",
    experience: "Teaching: 3.5 Years",
    areaOfInterest: "Java , C ,C++, Internet of Things ,Blockchain, Python , Competitive programming.",
    email: ["snehal.shelke@cse.ssiems.in"]
  },
  {
    name: "Prof. Bais P. G.",
    image: getAssetPath("faculty/Bais P. G..webp"),
    designation: "Assistant Professor",
    qualification: "BE(CSE), ME (CSE)",
    experience: "Teaching: 4 Years",
    areaOfInterest: "C++ Python, Machine Learning",
    email: ["pranita.bais@cse.ssiems.in"]
  },
  {
    name: "Prof. Panchalwar D. A",
    image: getAssetPath("faculty/Panchalwar D. A.webp"),
    designation: "Assistant Professor",
    qualification: "BE (CSE), M.Tech (CSE) Persuing",
    experience: "Teaching: 4.4 Years",
    areaOfInterest: "Cloud Computing ,Data Structures",
    email: ["divyani.panchalwar@cse.ssiems.in"]
  },
  {
    name: "Prof. Jadhav S.M.",
    image: getAssetPath("faculty/Jadhav S.M..webp"),
    designation: "Assistant Professor",
    qualification: "BCS, MCA",
    experience: "Industrial: 3.6 Years & Teaching : 1.4 Years",
    areaOfInterest: "Java, Software Testing, Selenium, RestApi, Appium, UHV, C programming, Business Communication",
    email: ["imswatijadhav121@gmail.com"]
  },
  {
    name: "Prof. Jadhav P.K.",
    image: getAssetPath("faculty/Jadhav P.K..webp"),
    designation: "Assistant Professor",
    qualification: "B.Tech (CSE) , M.Tech (CSE) Pursuing",
    experience: "Teaching : 1 Years",
    areaOfInterest: "C , Python , Web Development, Human Computer Interaction,",
    email: ["priti.jadhav@cse.ssiems.in"]
  },
  {
    name: "Prof. Late A.G.",
    image: getAssetPath("faculty/Late A.G..webp"),
    designation: "Assistant Professor",
    qualification: "BE (CSE), M.Tech (CSE) Pursuing",
    experience: "Teaching : 6 Months",
    areaOfInterest: "Java, Artificial Intelligence,Computer Architecture and Organization, Competitive programming.",
    email: ["ayodhya.late173@gmail.com"]
  },
  {
    name: "Prof. Shriramwar S. D.",
    image: getAssetPath("faculty/Shriramwar S. D..webp"),
    designation: "Assistant Professor",
    qualification: "BE (E&TC) , MTech (VLSI Design)",
    experience: "Teaching : 6 Months & Industrial: 2 Years",
    areaOfInterest: "VLSI System Design, ASIC Design & Verification, Physical Design, Embedded Systems, and Linux-Based Development.",
    email: ["shriramwarshravani@gmail.com"]
  },
  {
    name: "Mr. Mule D. S.",
    image: getAssetPath("faculty/Mule D. S..webp"),
    designation: "Network Admin",
    qualification: "N/A",
    experience: "6 Years",
    areaOfInterest: "Network",
    email: ["itadmin@ssiems.in"]
  }
];

const FacultyPage = () => {
  return (
    <div className="bg-slate-50 min-h-screen flex flex-col font-sans">
      <CollegeHeader />
      {/* Header */}
      <header className="bg-white border-b border-slate-200 py-4 px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18 18.247 18.477 16.5 18.477s-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <span className="text-xl font-bold text-slate-900 tracking-tight">SSIEMS Academic Portal</span>
            </Link>
          </div>
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-600">
            <Link to="/" className="hover:text-blue-600 transition-colors">Home</Link>
            <Link to="/faculty" className="text-blue-600 font-bold underline transition-colors">Faculty</Link>
            <a href="mailto:info@ssiems.org.in" className="hover:text-blue-600 transition-colors">Support</a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-700 py-16 px-6 text-center text-white">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold mb-4 uppercase tracking-wider">Computer Science and Engineering</h1>
          <h2 className="text-xl md:text-2xl font-semibold text-blue-100 opacity-90">Our Distinguished Faculty</h2>
          <div className="mt-6 h-1 w-24 bg-blue-400 mx-auto rounded-full"></div>
        </div>
      </section>

      {/* Faculty Grid */}
      <main className="max-w-7xl mx-auto py-12 px-6 flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {facultyData.map((faculty, index) => (
            <div key={index} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
              <div className="aspect-[4/3] relative overflow-hidden bg-slate-100">
                <img 
                  src={faculty.image} 
                  alt={faculty.name}
                  className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                  onError={(e) => {
                    e.target.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(faculty.name) + "&background=0D47A1&color=fff&size=512";
                  }}
                />
                <div className="absolute top-4 right-4">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-sm">
                    {faculty.designation.split('&')[0]}
                  </span>
                </div>
              </div>

              <div className="p-6 flex-grow flex flex-col">
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{faculty.name}</h3>
                  <p className="text-blue-600 text-xs font-semibold uppercase tracking-wider">
                    {faculty.designation}
                  </p>
                </div>
                
                <div className="space-y-4 text-sm flex-grow">
                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Qualification</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{faculty.qualification}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Experience</span>
                    <p className="text-slate-700 leading-relaxed font-medium">{faculty.experience}</p>
                  </div>

                  <div className="flex flex-col gap-1">
                    <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Area of Interest</span>
                    <p className="text-slate-700 leading-relaxed font-medium italic">{faculty.areaOfInterest}</p>
                  </div>

                  <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                    <span className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">Email Address</span>
                    <div className="flex flex-col gap-1">
                      {faculty.email.map((email, eIndex) => (
                        <a 
                          key={eIndex} 
                          href={`mailto:${email}`} 
                          className="text-blue-600 hover:text-blue-800 transition-colors flex items-center gap-2 overflow-hidden text-ellipsis whitespace-nowrap"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {email}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 mt-auto">
                <button 
                  className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2 group"
                  onClick={() => window.location.href = `mailto:${faculty.email[0]}`}
                >
                  Contact Faculty
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 px-6 mt-12">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-12 text-sm">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-blue-400 tracking-tight uppercase tracking-widest">Department Information</h4>
            <p className="text-slate-400 leading-relaxed">
              Our department is committed to excellence in education and research, 
              supported by a dedicated team of highly qualified faculty members.
            </p>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-blue-400 tracking-tight uppercase tracking-widest">Quick Links</h4>
            <ul className="space-y-3 text-slate-400">
              <li><Link to="/" className="hover:text-white transition-colors">Home Portal</Link></li>
              <li><Link to="/faculty" className="hover:text-white transition-colors">Faculty Directory</Link></li>
              <li><Link to="/login" className="hover:text-white transition-colors">Examination System</Link></li>
              <li><a href="/timetable/index.html" className="hover:text-white transition-colors">Academic Timetable</a></li>
            </ul>
          </div>
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold mb-6 text-blue-400 tracking-tight uppercase tracking-widest">Contact Support</h4>
            <p className="text-slate-400 leading-relaxed mb-4">
              For any departmental queries, please reach out to the HOD or administrative staff.
            </p>
            <div className="flex justify-center md:justify-start gap-4">
              <span className="bg-slate-800 px-3 py-1 rounded-md border border-slate-700">SSIEMS-CSE</span>
              <span className="bg-slate-800 px-3 py-1 rounded-md border border-slate-700 text-blue-400 font-bold uppercase tracking-widest">Academic Year 2026</span>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t border-slate-800 mt-12 pt-8 text-center text-slate-500">
          <p>&copy; 2026 SSIEMS Academic System. Computer Science & Engineering Department.</p>
        </div>
      </footer>
    </div>
  );
};

export default FacultyPage;
