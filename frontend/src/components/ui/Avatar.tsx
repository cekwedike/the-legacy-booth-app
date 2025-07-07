import React from 'react';

interface AvatarProps {
  name: string;
  photoUrl: string | null;
  className?: string;
}

// Simple hash function to get a color from a limited palette
const colors = [
  'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-yellow-500',
  'bg-lime-500', 'bg-green-500', 'bg-emerald-500', 'bg-teal-500',
  'bg-cyan-500', 'bg-sky-500', 'bg-blue-500', 'bg-indigo-500',
  'bg-violet-500', 'bg-purple-500', 'bg-fuchsia-500', 'bg-pink-500', 'bg-rose-500'
];

const Avatar: React.FC<AvatarProps> = ({ name, photoUrl, className = '' }) => {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  
  const hashCode = (str: string) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  };
  
  const colorIndex = Math.abs(hashCode(name)) % colors.length;
  const bgColor = colors[colorIndex];

  const baseClasses = 'rounded-full flex items-center justify-center object-cover';

  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt={name}
        className={`${baseClasses} ${className}`}
      />
    );
  }

  return (
    <div className={`${baseClasses} ${bgColor} ${className}`}>
      <span
        className="text-white font-bold font-serif select-none"
        style={{
          fontSize: 'calc(75%)',
          lineHeight: 1,
        }}>
        {initial}
      </span>
    </div>
  );
};

export default Avatar;