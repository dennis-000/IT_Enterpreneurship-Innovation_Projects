import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, BookOpen, Users, Award, Heart } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const carouselImages = [
  {
    url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Quality Education',
    description: 'Excellence in learning from Creche to JHS'
  },
  {
    url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Modern Facilities',
    description: 'State-of-the-art learning environment'
  },
  {
    url: 'https://images.pexels.com/photos/267885/pexels-photo-267885.jpeg?auto=compress&cs=tinysrgb&w=1600',
    title: 'Holistic Development',
    description: 'Nurturing minds, building character'
  }
];

const features = [
  {
    icon: BookOpen,
    title: 'Quality Education',
    description: 'Comprehensive curriculum aligned with national standards'
  },
  {
    icon: Users,
    title: 'Experienced Teachers',
    description: 'Dedicated and qualified educators committed to excellence'
  },
  {
    icon: Award,
    title: 'Excellence & Achievement',
    description: 'Outstanding academic performance and awards'
  },
  {
    icon: Heart,
    title: 'Character Building',
    description: 'Instilling values, discipline, and moral principles'
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length);
  };

  return (
    <div className="animate-fade-in">
      <div className="relative h-[600px] overflow-hidden">
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentSlide ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-royal-900/80 to-royal-800/60 z-10" />
            <img
              src={image.url}
              alt={image.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 z-20 flex items-center justify-center">
              <div className="text-center text-white px-4 max-w-4xl animate-slide-up">
                <h1 className="text-5xl md:text-7xl font-bold mb-6">
                  Welcome to Fountain Gate Academy
                </h1>
                <p className="text-xl md:text-2xl mb-4 text-tomato-300 font-semibold">
                  Nurturing Minds, Building Character
                </p>
                <p className="text-lg md:text-xl mb-8 text-gray-200">
                  {image.description}
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button
                    onClick={() => handleNavigate('/admissions')}
                    className="bg-tomato-500 hover:bg-tomato-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
                    Apply Now
                  </button>
                  <button
                    onClick={() => handleNavigate('/about')}
                    className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 border-2 border-white">
                    Learn More
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all duration-300 hover:scale-110"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
          {carouselImages.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-tomato-500 w-8' : 'bg-white/50'
                }`}
            />
          ))}
        </div>
      </div>

      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            title="Welcome to Our School"
            subtitle="Providing quality education from Creche to JHS (Ages 1 year and above)"
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="animate-slide-up">
              <img
                src="https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Students learning"
                className="rounded-3xl shadow-2xl hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div className="space-y-6 animate-fade-in">
              <h3 className="text-3xl font-bold text-royal-800">
                Building Tomorrow's Leaders Today
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed">
                At Fountain Gate Academy, we are committed to providing a nurturing environment
                where young minds flourish and character is built on strong foundations. Our
                comprehensive educational approach combines academic excellence with moral values,
                preparing students for success in life.
              </p>
              <p className="text-lg text-gray-700 leading-relaxed">
                From our Creche program through JHS, we offer a continuous
                educational journey that develops critical thinking, creativity, and leadership
                skills in every child from ages 1 year and above.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <div className="bg-royal-50 px-6 py-3 rounded-xl border-2 border-royal-200">
                  <p className="text-2xl font-bold text-royal-700">15+</p>
                  <p className="text-sm text-gray-600">Years of Excellence</p>
                </div>
                <div className="bg-tomato-50 px-6 py-3 rounded-xl border-2 border-tomato-200">
                  <p className="text-2xl font-bold text-tomato-700">500+</p>
                  <p className="text-sm text-gray-600">Happy Students</p>
                </div>
                <div className="bg-royal-50 px-6 py-3 rounded-xl border-2 border-royal-200">
                  <p className="text-2xl font-bold text-royal-700">98%</p>
                  <p className="text-sm text-gray-600">Success Rate</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="bg-gradient-to-br from-royal-600 to-royal-700 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-royal-800 mb-3">{feature.title}</h4>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-royal-700 to-royal-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
            Ready to Join Our Community?
          </h2>
          <p className="text-xl mb-8 text-gray-200 max-w-2xl mx-auto animate-fade-in">
            Take the first step towards your child's bright future. Apply now or schedule a visit to our campus.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => handleNavigate('/admissions')}
              className="bg-tomato-500 hover:bg-tomato-600 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Apply for Admission
            </button>
            <button
              onClick={() => handleNavigate('/contact')}
              className="bg-white text-royal-700 hover:bg-gray-100 px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg">
              Schedule a Visit
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
