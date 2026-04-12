import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Maximize2, 
  X, 
  ChevronLeft, 
  ChevronRight,
  Camera,
  LayoutGrid,
  Image as ImageIcon
} from 'lucide-react';
import { getAssetPath } from "@/lib/utils";

const PhotoGallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const images = [
    { src: "images/gallery/1.webp", title: "Campus View" },
    { src: "images/gallery/2.webp", title: "Academic Excellence" },
    { src: "images/gallery/3.webp", title: "Student Life" },
    { src: "images/gallery/4.webp", title: "Research Labs" },
    { src: "images/gallery/5.webp", title: "Innovation Hub" },
    { src: "images/gallery/6.webp", title: "Seminar Hall" },
    { src: "images/gallery/7.webp", title: "Workshop Session" },
    { src: "images/gallery/8.webp", title: "Tech Fest" },
    { src: "images/gallery/9.1.webp", title: "Cultural Event" },
    { src: "images/gallery/9.2.webp", title: "Annual Gathering" },
    { src: "images/gallery/10.webp", title: "Sports Day" },
    { src: "images/gallery/11.webp", title: "Alumni Meet" },
    { src: "images/gallery/12.1.webp", title: "Graduation Ceremony" },
    { src: "images/gallery/12.2.webp", title: "Convocation" },
    { src: "images/gallery/13.1.webp", title: "Industrial Visit" },
    { src: "images/gallery/13.2.webp", title: "Field Trip" },
    { src: "images/gallery/14.1.webp", title: "Project Exhibition" },
    { src: "images/gallery/14.2.webp", title: "Model Display" },
    { src: "images/gallery/15.1.webp", title: "Classroom Interaction" },
    { src: "images/gallery/15.2.webp", title: "Lecture Session" },
    { src: "images/gallery/16.1.webp", title: "Library Resources" },
    { src: "images/gallery/16.2.webp", title: "Reading Room" },
    { src: "images/gallery/18.webp", title: "Green Campus" },
    { src: "images/gallery/19.webp", title: "Modern Architecture" },
    { src: "images/gallery/20.webp", title: "Smart Classrooms" },
    { src: "images/gallery/21.webp", title: "Computing Center" },
    { src: "images/gallery/22.webp", title: "Student Council" },
  ];

  const openLightbox = (index) => {
    setCurrentIndex(index);
    setSelectedImage(images[index]);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    document.body.style.overflow = 'auto';
  };

  const nextImage = () => {
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    setSelectedImage(images[nextIdx]);
  };

  const prevImage = () => {
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    setSelectedImage(images[prevIdx]);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link 
              to="/" 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2.5 rounded-xl text-white shadow-lg shadow-blue-200">
                <Camera className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">Photo Gallery</h1>
                <p className="text-sm text-slate-500 font-medium">Capturing Moments at SSIEMS CSE</p>
              </div>
            </div>
          </div>
          
          <div className="hidden sm:flex items-center gap-4 text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
            <LayoutGrid className="h-5 w-5" />
            <span className="text-sm font-bold">{images.length} Photographs</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {images.map((image, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
              onClick={() => openLightbox(index)}
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img 
                  src={getAssetPath(image.src)} 
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <p className="text-white font-bold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  {image.title}
                </p>
                <div className="mt-2 flex items-center gap-2 text-blue-400 font-semibold text-sm translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                  <Maximize2 className="h-4 w-4" />
                  View Full Size
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm animate-in fade-in duration-300">
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={prevImage}
            className="absolute left-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
          >
            <ChevronLeft className="h-10 w-10" />
          </button>
          
          <button 
            onClick={nextImage}
            className="absolute right-6 p-3 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition-all z-50"
          >
            <ChevronRight className="h-10 w-10" />
          </button>

          <div className="relative max-w-5xl max-h-[85vh] px-4 animate-in zoom-in-95 duration-300">
            <img 
              src={getAssetPath(selectedImage.src)} 
              alt={selectedImage.title}
              className="w-full h-full object-contain rounded-lg shadow-2xl"
            />
            <div className="absolute -bottom-16 left-0 right-0 text-center">
              <h3 className="text-2xl font-bold text-white mb-1">{selectedImage.title}</h3>
              <p className="text-white/60 font-medium">
                {currentIndex + 1} of {images.length}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 p-4 rounded-2xl text-slate-400">
              <ImageIcon className="h-8 w-8" />
            </div>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Academic Journey in Pictures</h2>
          <p className="text-slate-500 font-medium max-w-md mx-auto">
            A visual documentation of academic excellence, campus life, and technological innovation at SSIEMS Computer Science Department.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default PhotoGallery;
