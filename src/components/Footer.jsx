import { 
  Facebook, 
  Github, 
  Instagram, 
  TwitterIcon, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  Film, 
  MapPin, 
  Phone, 
  Clock, 
  Shield,
  ChevronRight,
  Heart,
  Sparkles,
  Ticket
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { subscribeService } from "../services/api/subscribe";
import cinemaLogo from "../assets/cinerwandaLogo.png";

function Footer() {
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [subscribeEmail, setSubscribeEmail] = useState('');
  const [subscribeLoading, setSubscribeLoading] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState('');
  const [subscribeError, setSubscribeError] = useState('');
  
  useEffect(() => {
    setUserIsLoggedIn(!!(user && user.token));
  }, [user]);

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubscribeLoading(true);
    setSubscribeMessage('');
    setSubscribeError('');

    try {
      await subscribeService.subscribeCinemaRwa({
        email: subscribeEmail,
        preferences: {
          newMovies: true,
          promotions: true,
          weeklyDigest: true,
        },
      });
      setSubscribeMessage('✓ Successfully subscribed!');
      setSubscribeEmail('');
      setTimeout(() => setSubscribeMessage(''), 3000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || 'Subscription failed';
      setSubscribeError(errorMsg);
      setTimeout(() => setSubscribeError(''), 3000);
    } finally {
      setSubscribeLoading(false);
    }
  };

  if (userIsLoggedIn && ["filmmaker", "admin"].includes(user?.role)) {
    return null;
  }

  const cinemaLocations = [
    { name: "GATENGA CINEMA", city: "Kigali / Gatenga", address: "KG 123 St, Gatenga" },
    { name: "OKG MUSIC OFFICE", city: "Kigali / Niboye", address: "KN 456 Blvd, Niboye" },
  ];

  const quickLinks = [
    { name: 'Movies', icon: Film },
    { name: 'Showtimes', icon: Clock },
    { name: 'Cinemas', icon: MapPin },
    { name: 'Coming Soon', icon: Sparkles },
    { name: 'Special Events', icon: Ticket },
  ];

  return (
    <footer className="relative bg-gradient-to-b from-gray-900 to-black text-gray-300 border-t border-gray-800/50">
      {/* Decorative gradient line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      
      <div className="container mx-auto px-4 lg:px-8 py-12 lg:py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Brand Section - 3 columns */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <img 
                src={cinemaLogo} 
                alt="CinemaRwa" 
                className="w-36 h-auto object-contain brightness-0 invert hover:brightness-100 hover:invert-0 transition-all duration-300" 
              />
              <p className="text-gray-400 text-sm leading-relaxed">
                Experience the magic of cinema in Rwanda. Book tickets, discover new releases, 
                and enjoy exclusive offers at our state-of-the-art theaters.
              </p>
              
              {/* Social Links with improved design */}
              <div className="flex gap-2 pt-2">
                {[
                  { icon: Github, href: "https://github.com/Franklin-pro/", hover: "hover:bg-gray-700" },
                  { icon: Instagram, href: "https://www.instagram.com/g_wayne_1/", hover: "hover:bg-pink-600" },
                  { icon: TwitterIcon, href: "https://x.com/franklinpro21", hover: "hover:bg-blue-400" },
                  { icon: Facebook, href: "https://facebook.com", hover: "hover:bg-blue-700" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`bg-gray-800/50 ${social.hover} p-2.5 rounded-xl transition-all duration-300 hover:scale-110 hover:shadow-lg group`}
                  >
                    <social.icon className="w-4 h-4 group-hover:text-white transition-colors" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links - 2 columns */}
          <div className="lg:col-span-2">
            <h3 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <li key={item.name}>
                    <a 
                      href="#" 
                      className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-all duration-300 group"
                    >
                      <Icon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      <span>{item.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Locations - 3 columns */}
          <div className="lg:col-span-3">
            <h3 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Our Cinemas
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            <ul className="space-y-4">
              {cinemaLocations.map((cinema) => (
                <li key={cinema.name} className="group">
                  <div className="bg-gray-800/30 rounded-xl p-3 border border-gray-800/50 hover:border-blue-500/50 transition-all duration-300">
                    <p className="font-medium text-white group-hover:text-blue-400 transition-colors flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400" />
                      {cinema.name}
                    </p>
                    <p className="text-sm text-gray-400 mt-1">{cinema.city}</p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                      {cinema.address}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Contact - 4 columns */}
          <div className="lg:col-span-4">
            <h3 className="text-white font-semibold text-lg mb-4 relative inline-block">
              Stay Updated
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-blue-500 rounded-full"></span>
            </h3>
            
            {/* Newsletter Form */}
            <form onSubmit={handleSubscribe} className="mb-6">
              <p className="text-sm text-gray-400 mb-3">
                Subscribe for exclusive offers, updates, and news
              </p>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={subscribeEmail}
                  onChange={(e) => setSubscribeEmail(e.target.value)}
                  required
                  className="w-full bg-gray-800/50 border border-gray-700 text-white pl-10 pr-4 py-3 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-300"
                />
              </div>
              
              {subscribeMessage && (
                <div className="flex items-center gap-2 text-green-400 text-sm mt-2 bg-green-400/10 rounded-lg p-2">
                  <CheckCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{subscribeMessage}</span>
                </div>
              )}
              
              {subscribeError && (
                <div className="flex items-center gap-2 text-red-400 text-sm mt-2 bg-red-400/10 rounded-lg p-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{subscribeError}</span>
                </div>
              )}
              
              <button 
                type="submit"
                disabled={subscribeLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 text-sm rounded-xl font-medium mt-3 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-500/25"
              >
                {subscribeLoading ? 'Subscribing...' : 'Subscribe Now'}
              </button>
            </form>

            {/* Contact Info */}
            <div className="space-y-3 bg-gray-800/30 rounded-xl p-4 border border-gray-800/50">
              <h4 className="text-white text-sm font-medium mb-2">Contact Us</h4>
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Phone className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <a href="tel:+250783446449" className="text-gray-300 hover:text-blue-400 transition-colors">
                    +250 783 446 449
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Mail className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <a href="mailto:franklinprogrammer@gmail.com" className="text-gray-300 hover:text-blue-400 transition-colors">
                    franklinprogrammer@gmail.com
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-3 text-sm group">
                <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Clock className="w-4 h-4 text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500">Hours</p>
                  <p className="text-gray-300">Saturday - Sunday: 8AM - 2PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-gray-800/50">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-xs text-gray-500 order-2 sm:order-1">
              © {new Date().getFullYear()} CinemaRwa. All rights reserved.
            </p>
            
            <div className="flex items-center gap-6 order-1 sm:order-2">
              <a href="/privacy-policy" className="text-xs text-gray-500 hover:text-blue-400 transition-colors flex items-center gap-1 group">
                <Shield className="w-3 h-3 group-hover:scale-110 transition-transform" />
                Privacy Policy
              </a>
              <a href="/terms" className="text-xs text-gray-500 hover:text-blue-400 transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
          
          {/* Developer Credit */}
          <div className="text-center mt-4">
            <p className="text-xs text-gray-600 flex items-center justify-center gap-1">
              Crafted with 
              <Heart className="w-3 h-3 text-red-500 animate-pulse" /> 
              by 
              <a 
                href="https://franklindevloper.netlify.app/" 
                className="text-blue-400 hover:text-blue-300 transition-colors relative group"
                target="_blank"
                rel="noopener noreferrer"
              >
                Franklin Programmer
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-300"></span>
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;