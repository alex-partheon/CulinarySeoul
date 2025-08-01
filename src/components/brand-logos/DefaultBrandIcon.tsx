import React from 'react';

interface DefaultBrandIconProps {
  className?: string;
  size?: number;
}

export const DefaultBrandIcon: React.FC<DefaultBrandIconProps> = ({ 
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
      <rect width="32" height="32" rx="8" fill="currentColor" fillOpacity="0.1" />
      <path
        d="M16 8C16 8 10 10 10 16C10 22 16 24 16 24C16 24 22 22 22 16C22 10 16 8 16 8Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="16" r="3" fill="currentColor" />
    </svg>
  );
};

export default DefaultBrandIcon;