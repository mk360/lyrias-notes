import React from 'react'

type ButtonVariant = 'primary' | 'accent' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  children: React.ReactNode
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-ink text-paper border-ink hover:opacity-80',
  accent:    'bg-gold text-ink border-gold hover:bg-goldDk hover:border-goldDk',
  secondary: 'bg-paper text-ink border-ink hover:bg-paper2',
  ghost:     'bg-transparent text-ink border-rule hover:border-ink3',
}

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-1.5 text-body-sm',
  md: 'px-5 py-2.5 text-body',
  lg: 'px-8 py-3.5 text-body',
}

export function Button({
  variant = 'secondary',
  size = 'md',
  className = '',
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={`
        inline-flex items-center justify-center gap-2
        font-fredoka font-500
        border-2
        shadow-stamp
        cursor-pointer
        transition-transform active:translate-y-px active:shadow-none
        select-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled ? 'opacity-40 cursor-not-allowed' : ''}
        ${className}
      `}
      style={{ borderRadius: 'var(--radius-sm)', ...(props.style ?? {}) }}
    >
      {children}
    </button>
  )
}
