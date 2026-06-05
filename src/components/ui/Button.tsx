'use client'
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'danger' | 'done'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-150 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
    const variants = {
      primary: 'bg-[var(--acid)] text-[#0b0d0a] hover:bg-[var(--acid-dim)]',
      ghost: 'bg-transparent border border-[var(--line)] text-[var(--muted)] hover:text-[var(--text)] hover:border-[var(--muted)]',
      danger: 'bg-transparent border border-red-500/40 text-[var(--danger)] hover:bg-red-500/10',
      done: 'bg-[var(--acid)]/20 border border-[var(--acid)]/40 text-[var(--acid)]',
    }
    const sizes = {
      sm: 'text-[12px] px-3 py-1.5',
      md: 'text-[14px] px-4 py-2.5',
      lg: 'text-[15px] px-6 py-3 w-full',
    }
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? <span className="animate-spin mr-2">⟳</span> : null}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
export default Button
