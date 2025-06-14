"use client";

import { useEffect, useState } from 'react';

export default function MaintenancePage() {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Simulate countdown (you can set actual maintenance end time)
    const targetTime = new Date().getTime() + (2 * 60 * 60 * 1000); // 2 hours from now
    
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetTime - now;
      
      if (distance > 0) {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a1a0f] via-[#0e1b12] via-[#1a2e1a] to-[#0a1a0f] text-[#d1d5db] flex items-center justify-center relative overflow-hidden">
      
      {/* Animated Background Elements */}
      <div className="fixed inset-0 z-0">
        {/* Dragon Aura */}
        <div className="absolute top-20 left-20 w-[400px] h-[400px] bg-gradient-radial from-[#e8c547]/10 via-[#e8c547]/5 to-transparent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-[300px] h-[300px] bg-gradient-radial from-[#2e3d29]/15 via-[#2e3d29]/8 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        {/* Floating Orbs */}
        <div className="absolute top-1/4 left-1/5 w-3 h-3 bg-[#e8c547]/40 rounded-full animate-bounce delay-300 shadow-lg shadow-[#e8c547]/30"></div>
        <div className="absolute top-3/4 right-1/5 w-2 h-2 bg-[#e8c547]/50 rounded-full animate-bounce delay-700 shadow-lg shadow-[#e8c547]/30"></div>
        <div className="absolute top-1/2 left-3/4 w-2.5 h-2.5 bg-[#e8c547]/35 rounded-full animate-bounce delay-1000 shadow-lg shadow-[#e8c547]/30"></div>
        
        {/* Dragon Breath Effect */}
        <div className="absolute top-32 right-32 w-48 h-48 bg-gradient-conic from-[#e8c547]/8 via-transparent to-[#e8c547]/8 rounded-full blur-2xl animate-spin" style={{ animationDuration: '15s' }}></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        
        {/* Dragon Icon */}
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-[#e8c547]/20 rounded-full blur-3xl animate-pulse"></div>
          <i className="fas fa-dragon text-8xl text-[#e8c547] animate-pulse relative z-10"></i>
        </div>

        {/* Main Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6">
          <span className="bg-gradient-to-r from-[#e8c547] to-[#f4d76b] bg-clip-text text-transparent">
            Under Maintenance
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
          The dragon is upgrading its lair with powerful new features
        </p>

        {/* Description */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-8 mb-8">
          <p className="text-lg text-gray-300 mb-6">
            We're currently performing scheduled maintenance to improve your experience. 
            The site will be back online shortly with enhanced performance and new features.
          </p>
          
          {/* Features Being Added */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div className="flex items-center space-x-3">
              <i className="fas fa-rocket text-[#e8c547]"></i>
              <span className="text-gray-300">Performance Boost</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-shield-alt text-[#e8c547]"></i>
              <span className="text-gray-300">Security Updates</span>
            </div>
            <div className="flex items-center space-x-3">
              <i className="fas fa-magic text-[#e8c547]"></i>
              <span className="text-gray-300">New Features</span>
            </div>
          </div>
        </div>

        {/* Countdown Timer */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-semibold text-[#e8c547] mb-4">Estimated Time Remaining</h3>
          <div className="flex justify-center space-x-6">
            <div className="text-center">
              <div className="bg-[#e8c547]/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-[#e8c547]">{timeLeft.hours.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-400">Hours</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-[#e8c547]/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-[#e8c547]">{timeLeft.minutes.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-400">Minutes</div>
              </div>
            </div>
            <div className="text-center">
              <div className="bg-[#e8c547]/20 rounded-lg p-4 min-w-[80px]">
                <div className="text-3xl font-bold text-[#e8c547]">{timeLeft.seconds.toString().padStart(2, '0')}</div>
                <div className="text-sm text-gray-400">Seconds</div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-[#2e3d29]/30 backdrop-blur-md border border-[#3e503e]/30 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-[#e8c547] mb-4">Need Immediate Assistance?</h3>
          <p className="text-gray-300 mb-4">
            If you have urgent questions or need support, feel free to reach out:
          </p>
          <div className="flex justify-center space-x-6">
            <a 
              href="mailto:omerguler53@gmail.com" 
              className="flex items-center space-x-2 text-[#e8c547] hover:text-[#f4d76b] transition-colors duration-300"
            >
              <i className="fas fa-envelope"></i>
              <span>Email Support</span>
            </a>
            <a 
              href="https://github.com/bergaman9" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-[#e8c547] hover:text-[#f4d76b] transition-colors duration-300"
            >
              <i className="fab fa-github"></i>
              <span>GitHub</span>
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-gray-400">
          <p>&copy; 2024 Bergaman - The Dragon's Domain. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
} 