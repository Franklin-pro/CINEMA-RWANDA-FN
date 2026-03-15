import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Headphones, 
  HelpCircle, 
  CheckCircle,
  Film,
  Sparkles,
  ArrowRight,
  Phone,
  Mail,
  MessageSquare
} from 'lucide-react';

// WhatsApp SVG Icon Component - Now white for contrast
const WhatsAppIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2 6.798 2 2.548 6.193 2.54 11.393c-.003 1.747.456 3.457 1.328 4.985L2.25 21.75l5.422-1.56c1.473.801 3.13 1.224 4.82 1.224h.004c5.19 0 9.454-4.195 9.462-9.396.004-2.51-.973-4.872-2.861-6.759l-.02-.02zm-7.07 14.436c-1.505 0-2.98-.404-4.258-1.16l-.305-.183-3.215.925.96-3.122-.185-.308a8.66 8.66 0 0 1-1.332-4.614c.007-4.767 3.888-8.642 8.67-8.642 2.317 0 4.493.902 6.131 2.54a8.542 8.542 0 0 1 2.534 6.086c-.008 4.77-3.887 8.65-8.668 8.65h-.002zm4.754-5.358c-.261-.13-1.539-.75-1.777-.835-.238-.085-.411-.13-.584.13-.173.26-.672.835-.824 1.006-.152.171-.304.192-.565.064-.26-.128-1.1-.403-2.095-1.286-.775-.688-1.298-1.538-1.45-1.798-.152-.26-.016-.401.114-.53.117-.116.26-.304.39-.456.13-.152.173-.26.26-.434.087-.173.043-.325-.022-.456-.064-.13-.584-1.4-.8-1.92-.21-.506-.425-.437-.584-.445a10.41 10.41 0 0 0-.498-.01.955.955 0 0 0-.694.325c-.238.26-.91.886-.91 2.163 0 1.277.934 2.511 1.064 2.685.13.173 1.798 2.797 4.44 3.807 2.64 1.01 2.64.674 3.116.632.477-.043 1.54-.628 1.756-1.235.217-.607.217-1.127.152-1.236-.064-.108-.238-.173-.499-.304z"/>
  </svg>
);

// WhatsApp Logo Icon with white color for contrast on green background
const WhatsAppLogoIcon = ({ className = "w-6 h-6" }) => (
  <svg 
    viewBox="0 0 24 24" 
    className={className}
    fill="white"  // Changed to white for contrast
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.077 4.928C17.191 3.041 14.683 2 12.006 2 6.798 2 2.548 6.193 2.54 11.393c-.003 1.747.456 3.457 1.328 4.985L2.25 21.75l5.422-1.56c1.473.801 3.13 1.224 4.82 1.224h.004c5.19 0 9.454-4.195 9.462-9.396.004-2.51-.973-4.872-2.861-6.759l-.02-.02zm-7.07 14.436c-1.505 0-2.98-.404-4.258-1.16l-.305-.183-3.215.925.96-3.122-.185-.308a8.66 8.66 0 0 1-1.332-4.614c.007-4.767 3.888-8.642 8.67-8.642 2.317 0 4.493.902 6.131 2.54a8.542 8.542 0 0 1 2.534 6.086c-.008 4.77-3.887 8.65-8.668 8.65h-.002zm4.754-5.358c-.261-.13-1.539-.75-1.777-.835-.238-.085-.411-.13-.584.13-.173.26-.672.835-.824 1.006-.152.171-.304.192-.565.064-.26-.128-1.1-.403-2.095-1.286-.775-.688-1.298-1.538-1.45-1.798-.152-.26-.016-.401.114-.53.117-.116.26-.304.39-.456.13-.152.173-.26.26-.434.087-.173.043-.325-.022-.456-.064-.13-.584-1.4-.8-1.92-.21-.506-.425-.437-.584-.445a10.41 10.41 0 0 0-.498-.01.955.955 0 0 0-.694.325c-.238.26-.91.886-.91 2.163 0 1.277.934 2.511 1.064 2.685.13.173 1.798 2.797 4.44 3.807 2.64 1.01 2.64.674 3.116.632.477-.043 1.54-.628 1.756-1.235.217-.607.217-1.127.152-1.236-.064-.108-.238-.173-.499-.304z"/>
  </svg>
);

function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);
  const [hoveredOption, setHoveredOption] = useState(null);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const phoneNumber = '250783446449';

  // Auto-hide tooltip after 5 seconds
  useEffect(() => {
    if (showTooltip) {
      const timer = setTimeout(() => {
        setShowTooltip(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showTooltip]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOptionClick = (type) => {
    const messages = {
      support:
        "Hello 👋 I'm a filmmaker using your platform and I'm experiencing a technical issue while uploading or managing my movie. Could you please assist me?",
      
      help:
        "Hello! I'm a filmmaker and I would like some guidance on how to submit my movie or manage my content on your platform. Thank you!",
      
      approval:
        "Hello 🎬 I recently submitted my movie on your platform and I would like to kindly ask about the review/approval status. Thank you for supporting filmmakers.",
      
      bank:
        "Hello 👋 I'm a filmmaker and I have a question about my payment method verification or bank details. Could you please help me?",
      
      general:
        "Hello! I have a question about the filmmaker platform. Could you please assist me?"
    };

    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messages[type] || messages.general)}`;
    window.open(url, "_blank");
    setIsOpen(false);
  };

  const quickOptions = [
    {
      id: 'approval',
      label: 'Movie Approval',
      description: 'Check review status',
      icon: Film,
      color: 'purple',
      message: 'approval'
    },
    {
      id: 'bank',
      label: 'Bank Verification',
      description: 'Payment method status',
      icon: CheckCircle,
      color: 'green',
      message: 'bank'
    },
    {
      id: 'support',
      label: 'Technical Support',
      description: 'Upload issues, errors',
      icon: Headphones,
      color: 'blue',
      message: 'support'
    },
    {
      id: 'help',
      label: 'General Help',
      description: 'Platform guidance',
      icon: HelpCircle,
      color: 'orange',
      message: 'help'
    }
  ];

  const getColorClasses = (color) => {
    const colors = {
      purple: {
        bg: 'bg-purple-500/10',
        hover: 'hover:bg-purple-500/20',
        text: 'text-purple-400',
        border: 'border-purple-500/30',
        icon: 'text-purple-400'
      },
      green: {
        bg: 'bg-green-500/10',
        hover: 'hover:bg-green-500/20',
        text: 'text-green-400',
        border: 'border-green-500/30',
        icon: 'text-green-400'
      },
      blue: {
        bg: 'bg-blue-500/10',
        hover: 'hover:bg-blue-500/20',
        text: 'text-blue-400',
        border: 'border-blue-500/30',
        icon: 'text-blue-400'
      },
      orange: {
        bg: 'bg-orange-500/10',
        hover: 'hover:bg-orange-500/20',
        text: 'text-orange-400',
        border: 'border-orange-500/30',
        icon: 'text-orange-400'
      }
    };
    return colors[color] || colors.blue;
  };

  return (
    <>
      {/* Options Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="fixed bottom-28 right-6 z-50 w-80 animate-[slideUp_0.3s_ease-out]"
        >
          {/* Header */}
          <div className="bg-green-700 rounded-t-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-lg">
                  <WhatsAppIcon className="w-5 h-5 text-white" /> {/* White icon */}
                </div>
                <div>
                  <h3 className="text-white font-bold">Chat with us</h3>
                  <p className="text-green-100 text-xs">Usually replies in minutes</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/20 rounded-lg transition-colors"
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Online Status */}
            <div className="mt-3 flex items-center gap-2">
              <div className="flex items-center gap-1.5 bg-white/20 px-2 py-1 rounded-full">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
                </span>
                <span className="text-xs text-white">Support Online</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 px-2 py-1 rounded-full">
                <span className="text-xs text-white">24/7</span>
              </div>
            </div>
          </div>

          {/* Quick Options */}
          <div className="bg-gray-900 border-x border-b border-gray-800 rounded-b-xl p-3 max-h-[400px] overflow-y-auto">
            <div className="mb-3 px-2">
              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3" />
                Quick select a topic
              </p>
            </div>

            <div className="space-y-2">
              {quickOptions.map((option) => {
                const Icon = option.icon;
                const colors = getColorClasses(option.color);
                const isHovered = hoveredOption === option.id;

                return (
                  <button
                    key={option.id}
                    onClick={() => handleOptionClick(option.message)}
                    onMouseEnter={() => setHoveredOption(option.id)}
                    onMouseLeave={() => setHoveredOption(null)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                      colors.bg
                    } ${colors.hover} border ${colors.border}`}
                  >
                    {/* Hover Animation */}
                    <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700`} />
                    
                    {/* Icon */}
                    <div className={`p-2 rounded-lg ${colors.bg} ${colors.hover} transition-colors`}>
                      <Icon className={`w-5 h-5 ${colors.icon}`} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-left">
                      <p className="text-white font-medium text-sm flex items-center gap-2">
                        {option.label}
                        {isHovered && (
                          <ArrowRight className={`w-3 h-3 ${colors.text} animate-pulse`} />
                        )}
                      </p>
                      <p className="text-gray-400 text-xs">{option.description}</p>
                    </div>

                    {/* Badge for new/featured */}
                    {option.id === 'approval' && (
                      <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                        Popular
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Divider */}
            <div className="my-3 flex items-center gap-2">
              <div className="flex-1 h-px bg-gray-800"></div>
              <span className="text-xs text-gray-500">or</span>
              <div className="flex-1 h-px bg-gray-800"></div>
            </div>

            {/* Custom Message Option */}
            <button
              onClick={() => handleOptionClick('general')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800/50 hover:bg-gray-800 rounded-xl transition-all duration-200 group border border-gray-700 hover:border-gray-600"
            >
              <div className="p-2 bg-gray-700 rounded-lg group-hover:bg-gray-600 transition-colors">
                <MessageSquare className="w-5 h-5 text-gray-300" />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">Write your own message</p>
                <p className="text-gray-400 text-xs">Ask anything about the platform</p>
              </div>
              <WhatsAppIcon className="w-4 h-4 text-gray-500 group-hover:text-[#25D366] transition-colors" />
            </button>

            {/* Footer with contact info */}
            <div className="mt-4 pt-3 border-t border-gray-800">
              <div className="flex items-center justify-between px-2">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-400">+250 790 019 543</span>
                  </div>
                  <div className="w-px h-3 bg-gray-700"></div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-3 h-3 text-gray-500" />
                    <span className="text-xs text-gray-400">cinemarwaclouds@gmail.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Backdrop with blur effect */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Tooltip */}
      {showTooltip && !isOpen && (
        <div className="fixed bottom-24 right-6 z-40 animate-[slideIn_0.3s_ease-out]">
          <div className="relative bg-gray-900 border border-gray-800 rounded-lg p-3 shadow-2xl">
            <div className="absolute -bottom-1.5 right-6 w-3 h-3 bg-gray-900 border-r border-b border-gray-800 rotate-45"></div>
            <p className="text-white text-sm font-medium flex items-center gap-2">
              <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
              Need help? Chat with us!
            </p>
            <p className="text-gray-400 text-xs mt-1">We usually reply in a few minutes</p>
            <button
              onClick={() => setShowTooltip(false)}
              className="absolute -top-1 -right-1 p-1 bg-gray-800 hover:bg-gray-700 rounded-full transition-colors"
            >
              <X className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* WhatsApp Button */}
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
          setShowTooltip(false);
        }}
        className="fixed bottom-6 right-6 z-50 group"
        aria-label="Contact us on WhatsApp"
      >
        {/* Ripple Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20 group-hover:opacity-30"></span>
        
        {/* Main Button */}
        <div className={`relative bg-green-700 cursor-pointer text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 hover:shadow-[#25D366]/25 ${
          isOpen ? 'rotate-90 scale-110' : ''
        }`}>
          {isOpen ? (
            <X className="w-6 h-6 text-white transition-transform duration-300 hover:rotate-90" /> // White X
          ) : (
            <WhatsAppLogoIcon className="w-6 h-6" /> // White WhatsApp icon
          )}
        </div>

        {/* Tooltip Label */}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none shadow-xl border border-gray-800">
          <span className="flex items-center gap-2">
            <WhatsAppIcon className="w-4 h-4 text-[#25D366]" />
            {isOpen ? 'Close chat' : 'Chat with support'}
          </span>
          <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 border-r border-t border-gray-800 rotate-45"></span>
        </span>
      </button>

      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </>
  );
}

export default WhatsAppButton;