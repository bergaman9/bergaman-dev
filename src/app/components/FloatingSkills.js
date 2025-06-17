"use client";

export default function FloatingSkills({ className = "" }) {
  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {/* Floating Skill Clouds - Hidden on mobile for better UX */}
      <div className="hidden lg:block">
        {/* Top Right - Full-Stack Developer */}
        <div className="absolute top-[10%] -right-[35%] animate-float-1">
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-[#e8c547]/40 rounded-full px-4 py-2 shadow-xl">
            <div className="flex items-center text-sm text-[#e8c547] font-medium whitespace-nowrap">
              <i className="fas fa-code mr-2"></i>
              Full-Stack Developer
            </div>
          </div>
        </div>

        {/* Mid Right - Tech Enthusiast */}
        <div className="absolute top-[45%] -right-[45%] animate-float-2" style={{ animationDelay: '0.5s' }}>
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-[#e8c547]/40 rounded-full px-4 py-2 shadow-xl">
            <div className="flex items-center text-sm text-[#e8c547] font-medium whitespace-nowrap">
              <i className="fas fa-cogs mr-2"></i>
              Tech Enthusiast
            </div>
          </div>
        </div>

        {/* Mid Left - Electronics Engineer */}
        <div className="absolute top-[55%] -left-[40%] animate-float-3" style={{ animationDelay: '1s' }}>
          <div className="bg-gradient-to-r from-gray-800/90 to-gray-900/90 backdrop-blur-md border border-[#e8c547]/40 rounded-full px-4 py-2 shadow-xl">
            <div className="flex items-center text-sm text-[#e8c547] font-medium whitespace-nowrap">
              <i className="fas fa-bolt mr-2"></i>
              Electronics Engineer
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Skills Display - Positioned below the profile image */}
      <div className="lg:hidden absolute -bottom-16 left-1/2 transform -translate-x-1/2 w-full">
        <div className="flex flex-wrap justify-center gap-2 max-w-sm mx-auto">
          <span className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-[#e8c547]/30 rounded-full px-3 py-1 text-xs text-[#e8c547] font-medium">
            <i className="fas fa-code mr-1"></i>
            Full-Stack
          </span>
          <span className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-[#e8c547]/30 rounded-full px-3 py-1 text-xs text-[#e8c547] font-medium">
            <i className="fas fa-bolt mr-1"></i>
            Electronics
          </span>
          <span className="bg-gradient-to-r from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-[#e8c547]/30 rounded-full px-3 py-1 text-xs text-[#e8c547] font-medium">
            <i className="fas fa-cogs mr-1"></i>
            Tech
          </span>
        </div>
      </div>
    </div>
  );
} 