import React from 'react';

interface RestaurantLogoProps {
  className?: string;
  size?: number;
}

export const RestaurantLogo: React.FC<RestaurantLogoProps> = ({ 
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
      <rect width="32" height="32" rx="8" fill="#DC2626" />
      
      {/* Chef hat */}
      <g transform="translate(8, 6)">
        <path
          d="M8 4C5 4 3 6 3 8C3 10 5 11 8 11C11 11 13 10 13 8C13 6 11 4 8 4Z"
          fill="white"
        />
        <rect x="5" y="11" width="6" height="8" rx="1" fill="white" />
        <rect x="4" y="18" width="8" height="2" rx="1" fill="white" />
      </g>
      
      {/* Fork and knife decoration */}
      <g opacity="0.3">
        <rect x="3" y="22" width="1" height="6" fill="white" />
        <rect x="2" y="22" width="3" height="2" fill="white" />
        
        <rect x="28" y="22" width="1" height="6" fill="white" />
        <path d="M27 22L29 24V28H27V22Z" fill="white" />
      </g>
    </svg>
  );
};

export default RestaurantLogo;