import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger' | 'accent';
  className?: string;
  icon?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', icon, className = '', ...props }) => {
  const baseClasses = 'w-full inline-flex items-center justify-center text-center text-base font-semibold py-3 px-5 rounded-xl transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-background disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:bg-gray-500';

  const variantClasses = {
    primary: 'bg-brand-primary text-white hover:brightness-110 focus:ring-brand-primary',
    secondary: 'bg-transparent text-brand-text-secondary border border-brand-secondary hover:bg-brand-secondary/10 hover:text-brand-text-primary focus:ring-brand-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    accent: 'bg-brand-accent text-white hover:brightness-110 focus:ring-brand-accent',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {icon && <span className="mr-2 -ml-1">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;