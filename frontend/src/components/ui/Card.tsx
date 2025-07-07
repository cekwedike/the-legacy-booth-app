import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-surface rounded-2xl p-6 sm:p-8 transition-all duration-300 ease-out ${className}`}>
      {children}
    </div>
  );
};

export default Card;