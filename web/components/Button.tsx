import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  children: React.ReactNode;
}

export function Button({ variant = 'primary', className = '', children, ...props }: ButtonProps) {
  const baseStyles = "px-6 py-3 rounded-lg font-medium transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-[#2c7a7b] text-white hover:bg-[#319795] focus:ring-[#2c7a7b]",
    outline: "bg-transparent border-2 border-[#2c7a7b] text-[#2c7a7b] hover:bg-[#e6fffa] focus:ring-[#2c7a7b]",
    ghost: "bg-transparent text-[#2c7a7b] hover:bg-gray-100"
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
