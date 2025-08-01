import React from 'react';

interface CafeLogoProps {
  className?: string;
  size?: number;
}

export const CafeLogo: React.FC<CafeLogoProps> = ({ 
  className, 
  size = 32 
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background */}
      <rect width="32" height="32" rx="8" fill="#7C3AED" />
      
      {/* Coffee cup */}
      <g transform="translate(6, 8)">
        {/* Cup */}
        <path
          d="M4 6H16V14C16 16 14 18 12 18H8C6 18 4 16 4 14V6Z"
          fill="white"
        />
        
        {/* Handle */}
        <path
          d="M16 8H18C19 8 20 9 20 10V11C20 12 19 13 18 13H16"
          stroke="white"
          strokeWidth="2"
          fill="none"
        />
        
        {/* Coffee */}
        <rect x="6" y="8" width="8" height="6" rx="1" fill="#7C3AED" opacity="0.5" />
        
        {/* Steam */}
        <path
          d="M8 2C8 1 9 0 9 0C9 0 10 1 10 2C10 3 9 4 9 4C9 4 8 3 8 2Z"
          fill="white"
          opacity="0.6"
        />
        <path
          d="M11 2C11 1 12 0 12 0C12 0 13 1 13 2C13 3 12 4 12 4C12 4 11 3 11 2Z"
          fill="white"
          opacity="0.6"
        />
      </g>
      
      {/* Saucer */}
      <ellipse cx="16" cy="26" rx="8" ry="2" fill="white" opacity="0.8" />
    </svg>
  );
};

export default CafeLogo;