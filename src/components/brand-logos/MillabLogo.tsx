import React from 'react';

interface MillabLogoProps {
  className?: string;
  size?: number;
}

export const MillabLogo: React.FC<MillabLogoProps> = ({ 
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
      <rect width="32" height="32" rx="8" fill="#F59E0B" />
      
      {/* Honeycomb pattern */}
      <g opacity="0.3">
        <path
          d="M11 8L7 12V16L11 20H15L19 16V12L15 8H11Z"
          fill="white"
        />
        <path
          d="M21 12L17 16V20L21 24H25L29 20V16L25 12H21Z"
          fill="white"
        />
      </g>
      
      {/* Bee icon */}
      <g transform="translate(8, 8)">
        <ellipse cx="8" cy="8" rx="5" ry="4" fill="#1F2937" />
        <rect x="3" y="6" width="10" height="2" fill="#FCD34D" />
        <rect x="3" y="9" width="10" height="2" fill="#FCD34D" />
        
        {/* Wings */}
        <ellipse cx="3" cy="5" rx="3" ry="2" fill="white" fillOpacity="0.8" />
        <ellipse cx="13" cy="5" rx="3" ry="2" fill="white" fillOpacity="0.8" />
      </g>
    </svg>
  );
};

export default MillabLogo;