"use client";

export default function PageContainer({ children, className = "" }) {
  return (
    <div className={`min-h-screen ${className}`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 md:px-8 py-12">
        {children}
      </div>
    </div>
  );
} 