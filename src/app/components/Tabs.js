"use client";

import { useState, useEffect, useRef } from 'react';

export default function Tabs({
  tabs = [],
  activeTab = null,
  onChange,
  variant = "default",
  size = "md",
  fullWidth = false,
  align = "left",
  className = "",
  tabClassName = "",
  contentClassName = "",
  showContent = true,
  animated = true,
  underlined = false,
  pills = false,
  bordered = false,
  vertical = false,
  scrollable = false,
  equalWidth = false,
  disabled = false,
  disabledTabs = []
}) {
  const [activeTabId, setActiveTabId] = useState(activeTab || (tabs.length > 0 ? tabs[0].id : null));
  const [indicatorStyle, setIndicatorStyle] = useState({});
  const tabsRef = useRef({});
  const tabsContainerRef = useRef(null);
  
  // Handle active tab change from props
  useEffect(() => {
    if (activeTab !== null && activeTab !== activeTabId) {
      setActiveTabId(activeTab);
    }
  }, [activeTab]);
  
  // Update indicator position on tab change or resize
  useEffect(() => {
    const updateIndicator = () => {
      if (!underlined || !tabsRef.current[activeTabId] || vertical) return;
      
      const tabEl = tabsRef.current[activeTabId];
      const { offsetLeft, offsetWidth } = tabEl;
      
      setIndicatorStyle({
        left: `${offsetLeft}px`,
        width: `${offsetWidth}px`
      });
    };
    
    updateIndicator();
    window.addEventListener('resize', updateIndicator);
    
    return () => {
      window.removeEventListener('resize', updateIndicator);
    };
  }, [activeTabId, underlined, vertical]);
  
  // Handle tab click
  const handleTabClick = (tabId) => {
    if (disabled || disabledTabs.includes(tabId)) return;
    
    setActiveTabId(tabId);
    if (onChange) onChange(tabId);
  };
  
  // Scroll to active tab in scrollable mode
  useEffect(() => {
    if (scrollable && tabsRef.current[activeTabId] && tabsContainerRef.current) {
      const tabEl = tabsRef.current[activeTabId];
      const containerEl = tabsContainerRef.current;
      
      const tabRect = tabEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      
      if (tabRect.left < containerRect.left) {
        containerEl.scrollLeft += tabRect.left - containerRect.left - 16;
      } else if (tabRect.right > containerRect.right) {
        containerEl.scrollLeft += tabRect.right - containerRect.right + 16;
      }
    }
  }, [activeTabId, scrollable]);
  
  // Variant styles
  const variants = {
    default: "text-gray-400 hover:text-white",
    primary: "text-gray-400 hover:text-[#e8c547]",
    secondary: "text-gray-400 hover:text-gray-200",
    success: "text-gray-400 hover:text-green-400",
    danger: "text-gray-400 hover:text-red-400",
    warning: "text-gray-400 hover:text-yellow-400",
    info: "text-gray-400 hover:text-blue-400"
  };
  
  // Active tab styles
  const activeVariants = {
    default: "text-white",
    primary: "text-[#e8c547]",
    secondary: "text-white",
    success: "text-green-400",
    danger: "text-red-400",
    warning: "text-yellow-400",
    info: "text-blue-400"
  };
  
  // Size classes
  const sizes = {
    sm: "text-xs py-1 px-2",
    md: "text-sm py-2 px-3",
    lg: "text-base py-3 px-4"
  };
  
  // Underline styles
  const underlineColors = {
    default: "bg-white",
    primary: "bg-[#e8c547]",
    secondary: "bg-white",
    success: "bg-green-400",
    danger: "bg-red-400",
    warning: "bg-yellow-400",
    info: "bg-blue-400"
  };
  
  // Pills styles
  const pillsStyles = {
    default: "bg-[#2e3d29]/50 hover:bg-[#2e3d29]",
    primary: "bg-[#e8c547]/10 hover:bg-[#e8c547]/20",
    secondary: "bg-gray-700/50 hover:bg-gray-700",
    success: "bg-green-900/30 hover:bg-green-900/50",
    danger: "bg-red-900/30 hover:bg-red-900/50",
    warning: "bg-yellow-900/30 hover:bg-yellow-900/50",
    info: "bg-blue-900/30 hover:bg-blue-900/50"
  };
  
  const pillsActiveStyles = {
    default: "bg-[#2e3d29]",
    primary: "bg-[#e8c547]/20",
    secondary: "bg-gray-700",
    success: "bg-green-900/50",
    danger: "bg-red-900/50",
    warning: "bg-yellow-900/50",
    info: "bg-blue-900/50"
  };
  
  // Border styles
  const borderStyles = {
    default: "border-gray-700 hover:border-gray-600",
    primary: "border-[#3e503e] hover:border-[#e8c547]/30",
    secondary: "border-gray-700 hover:border-gray-600",
    success: "border-green-900/50 hover:border-green-700/50",
    danger: "border-red-900/50 hover:border-red-700/50",
    warning: "border-yellow-900/50 hover:border-yellow-700/50",
    info: "border-blue-900/50 hover:border-blue-700/50"
  };
  
  const borderActiveStyles = {
    default: "border-white",
    primary: "border-[#e8c547]",
    secondary: "border-white",
    success: "border-green-400",
    danger: "border-red-400",
    warning: "border-yellow-400",
    info: "border-blue-400"
  };
  
  // Alignment classes
  const alignClasses = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
    between: "justify-between",
    around: "justify-around",
    evenly: "justify-evenly"
  };
  
  // Get active tab content
  const activeTabContent = tabs.find(tab => tab.id === activeTabId)?.content;
  
  return (
    <div className={`tabs-component ${vertical ? 'flex' : 'block'} ${className}`}>
      {/* Tabs Navigation */}
      <div 
        ref={tabsContainerRef}
        className={`
          ${vertical ? 'flex-shrink-0' : 'w-full'} 
          ${scrollable && !vertical ? 'overflow-x-auto flex' : vertical ? 'flex flex-col' : 'flex flex-wrap'} 
          ${!vertical && alignClasses[align]}
          ${bordered && !vertical ? 'border-b border-[#3e503e]/30' : ''}
          ${bordered && vertical ? 'border-r border-[#3e503e]/30' : ''}
          relative
        `}
      >
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          const isDisabled = disabled || disabledTabs.includes(tab.id);
          
          return (
            <button
              key={tab.id}
              ref={el => tabsRef.current[tab.id] = el}
              onClick={() => handleTabClick(tab.id)}
              disabled={isDisabled}
              className={`
                ${sizes[size]}
                ${isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${pills ? 'rounded-lg' : ''}
                ${pills && isActive ? pillsActiveStyles[variant] : pills ? pillsStyles[variant] : ''}
                ${!pills && isActive ? activeVariants[variant] : !pills ? variants[variant] : ''}
                ${bordered && !underlined ? `border-b-2 ${isActive ? borderActiveStyles[variant] : borderStyles[variant]}` : ''}
                ${bordered && vertical ? `border-r-2 ${isActive ? borderActiveStyles[variant] : borderStyles[variant]}` : ''}
                ${equalWidth ? 'flex-1 text-center' : ''}
                ${fullWidth ? 'flex-1 text-center' : ''}
                font-medium transition-all duration-200
                flex items-center gap-2
                ${tabClassName}
              `}
            >
              {tab.icon && <i className={tab.icon}></i>}
              <span>{tab.label}</span>
              {tab.badge && (
                <span className={`
                  px-1.5 py-0.5 text-xs rounded-full 
                  ${isActive ? 'bg-[#e8c547]/20 text-[#e8c547]' : 'bg-[#2e3d29] text-gray-300'}
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
        
        {/* Animated underline indicator */}
        {underlined && !vertical && (
          <div 
            className={`absolute bottom-0 h-0.5 transition-all duration-300 ${underlineColors[variant]}`}
            style={indicatorStyle}
          />
        )}
      </div>
      
      {/* Tab Content */}
      {showContent && (
        <div className={`
          ${vertical ? 'flex-grow ml-4' : 'mt-4'} 
          ${animated ? 'transition-opacity duration-200' : ''}
          ${contentClassName}
        `}>
          {activeTabContent}
        </div>
      )}
    </div>
  );
} 