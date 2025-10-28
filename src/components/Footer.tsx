import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

export default function Footer() {
  const navigate = useNavigate();

  const handleNavigate = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gradient-to-br from-royal-800 to-royal-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-tomato-400">Fountain Gate Academy</h3>
            <p className="text-gray-300 leading-relaxed mb-4">
              Nurturing young minds from Creche to JHS (ages 1 year and above) with excellence, character, and values.
            </p>
            <p className="text-tomato-300 font-semibold italic">
              "Nurturing Minds, Building Character"
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-tomato-400">Quick Links</h4>
            <ul className="space-y-2">
              <li><button onClick={() => handleNavigate('/about')} className="text-gray-300 hover:text-tomato-400 transition-colors">About Us</button></li>
              <li><button onClick={() => handleNavigate('/academics')} className="text-gray-300 hover:text-tomato-400 transition-colors">Academics</button></li>
              <li><button onClick={() => handleNavigate('/admissions')} className="text-gray-300 hover:text-tomato-400 transition-colors">Admissions</button></li>
              <li><button onClick={() => handleNavigate('/news')} className="text-gray-300 hover:text-tomato-400 transition-colors">News & Events</button></li>
              <li><button onClick={() => handleNavigate('/contact')} className="text-gray-300 hover:text-tomato-400 transition-colors">Contact Us</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-tomato-400">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-tomato-400 flex-shrink-0 mt-0.5" />
                <span className="text-gray-300">123 Education Street, Accra, Ghana</span>
              </li>
              <li className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-tomato-400 flex-shrink-0" />
                <span className="text-gray-300">+233 24 123 4567</span>
              </li>
              <li className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-tomato-400 flex-shrink-0" />
                <span className="text-gray-300">info@fountaingate.edu.gh</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4 text-tomato-400">Follow Us</h4>
            <div className="flex space-x-3">
              <a
                href="#"
                className="bg-royal-700 p-3 rounded-xl hover:bg-tomato-500 transition-all duration-300 hover:scale-110"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-royal-700 p-3 rounded-xl hover:bg-tomato-500 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-royal-700 p-3 rounded-xl hover:bg-tomato-500 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="bg-royal-700 p-3 rounded-xl hover:bg-tomato-500 transition-all duration-300 hover:scale-110"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
            <div className="mt-6">
              <h5 className="text-sm font-semibold mb-2 text-tomato-400">School Hours</h5>
              <p className="text-gray-300 text-sm">Monday - Friday</p>
              <p className="text-gray-300 text-sm">7:30 AM - 3:00 PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-royal-700 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Fountain Gate Academy. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
