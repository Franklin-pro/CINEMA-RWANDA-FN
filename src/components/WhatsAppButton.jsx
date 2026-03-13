import React, { useState } from 'react';
import { MessageCircle, X, Headphones, HelpCircle, MessageSquareText } from 'lucide-react';

function WhatsAppButton() {
  const [isOpen, setIsOpen] = useState(false);
  const phoneNumber = '250783446449';

const handleOptionClick = (type) => {
  const messages = {
    support:
      "Hello 👋 I’m a filmmaker using your platform and I’m experiencing a technical issue while uploading or managing my movie. Could you please assist me?",
      
    help:
      "Hello! I’m a filmmaker and I would like some guidance on how to submit my movie or manage my content on your platform. Thank you!",
      
    approval:
      "Hello 🎬 I recently submitted my movie on your platform and I would like to kindly ask about the review/approval status. Thank you for supporting filmmakers."
  };

  const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(messages[type])}`;
  window.open(url, "_blank");
  setIsOpen(false);
};

  return (
    <>
      {/* Options Menu */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl p-4 w-64">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">How can we help?</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          
          <div className="space-y-2">
          <button
  onClick={() => handleOptionClick('approval')}
  className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 group"
>
  <div className="p-2 bg-purple-500/20 rounded-lg group-hover:bg-purple-500/30 transition-colors">
    <MessageCircle className="w-5 h-5 text-purple-400" />
  </div>
  <div className="text-left">
    <p className="text-white font-medium text-sm">Movie Approval</p>
    <p className="text-gray-400 text-xs">Check movie review status</p>
  </div>
</button>

            <button
              onClick={() => handleOptionClick('help')}
              className="w-full flex items-center gap-3 p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-all duration-200 group"
            >
              <div className="p-2 bg-green-500/20 rounded-lg group-hover:bg-green-500/30 transition-colors">
                <HelpCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">General Help</p>
                <p className="text-gray-400 text-xs">Questions about the platform</p>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/20 animate-[fadeIn_0.2s_ease-out]" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* WhatsApp Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group"
        aria-label="Contact us on WhatsApp"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageSquareText className="w-6 h-6" />
        )}
        <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          {isOpen ? 'Close' : 'Chat with us'}
        </span>
      </button>
    </>
  );
}

export default WhatsAppButton;
