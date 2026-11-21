import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      icon: Icon,
      iconPosition = 'left',
      isLoading = false,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    // Size tokens
    const sizeClasses = {
      sm: 'px-2.5 py-1 text-[11px] rounded-md',
      md: 'px-3.5 py-1.5 text-xs rounded-lg',
      lg: 'px-4 py-2 text-sm rounded-lg',
    };

    // Variant tokens
    const variantClasses = {
      primary:
        'bg-red-600 text-white shadow-md shadow-red-500/25 hover:bg-red-500 active:scale-[0.98]',
      secondary:
        'border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800 hover:border-zinc-600 active:scale-[0.98]',
      ghost:
        'bg-transparent text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60 active:scale-[0.98]',
      danger:
        'bg-rose-600 text-white shadow-sm hover:bg-rose-500 active:scale-[0.98]',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`inline-flex items-center justify-center gap-1.5 font-semibold transition-all duration-200 ease-in-out disabled:opacity-50 disabled:pointer-events-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500/40 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
        {...props}
      >
        {Icon && iconPosition === 'left' && <Icon className="h-3.5 w-3.5 shrink-0" />}
        {children}
        {Icon && iconPosition === 'right' && <Icon className="h-3.5 w-3.5 shrink-0" />}
      </button>
    );
  }
);

Button.displayName = 'Button';
