
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    'inline-flex items-center justify-center rounded-xl font-bold uppercase tracking-tight transition-all disabled:opacity-50 disabled:pointer-events-none',
                    'hover:scale-[1.02] active:scale-[0.98]', // micro-interactions
                    {
                        'bg-primary text-background-dark hover:brightness-110': variant === 'primary',
                        'bg-surface-dark text-white border border-slate-700 hover:bg-slate-800': variant === 'secondary',
                        'border-2 border-primary/20 text-primary hover:bg-primary hover:text-background-dark': variant === 'outline',
                        'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500': variant === 'ghost',

                        'px-4 py-2 text-xs': size === 'sm',
                        'px-6 py-3 text-sm': size === 'md',
                        'px-8 py-4 text-base': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, cn }
