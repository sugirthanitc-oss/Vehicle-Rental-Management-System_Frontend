import React from 'react';
import { User, Building2 } from 'lucide-react';

const Avatar = ({ name = 'User', role = 'customer', size = 'md', className = '' }) => {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ').filter(Boolean);
    if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);
  const isProvider = role === 'provider';

  const sizeClasses = {
    sm: 'w-8 h-8 text-[11px]',
    md: 'w-10 h-10 text-xs',
    lg: 'w-14 h-14 text-base font-extrabold',
    xl: 'w-16 h-16 text-lg font-extrabold'
  };

  const ringGradients = isProvider
    ? 'from-pink-500 via-purple-500 to-indigo-500 text-pink-400'
    : 'from-indigo-500 via-cyan-500 to-emerald-500 text-indigo-400';

  return (
    <div
      className={`relative rounded-2xl bg-gradient-to-tr ${ringGradients} p-[2px] shadow-md shrink-0 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} rounded-[14px] bg-slate-900 flex items-center justify-center font-bold tracking-wider text-white select-none`}
      >
        <span>{initials}</span>
      </div>
    </div>
  );
};

export default Avatar;
