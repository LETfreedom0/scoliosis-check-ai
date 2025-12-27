import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const baseStyles = "rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };
  
  const variants = {
    primary: "bg-[#2c7a7b] text-white hover:bg-[#319795] focus:ring-[#2c7a7b]",
    outline: "bg-transparent border-2 border-[#2c7a7b] text-[#2c7a7b] hover:bg-[#e6fffa] focus:ring-[#2c7a7b]",
    ghost: "bg-transparent text-[#2c7a7b] hover:bg-gray-100",
    secondary: "bg-white text-gray-600 border border-gray-200 hover:border-[#2c7a7b] hover:text-[#2c7a7b] hover:bg-gray-50 focus:ring-gray-200"
  };

  return (
    <button 
      className={`${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
