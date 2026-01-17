
import { InputHTMLAttributes, forwardRef, ReactNode } from 'react'
import { cn } from './Button' // reuse cn utility

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    icon?: ReactNode
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, icon, ...props }, ref) => {
        return (
            <div className="relative group w-full">
                {icon && (
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">
                        {icon}
                    </div>
                )}
                <input
                    ref={ref}
                    className={cn(
                        'w-full bg-slate-200 dark:bg-surface-dark border-transparent rounded-lg py-2 text-sm transition-all focus:border-primary focus:ring-2 focus:ring-primary outline-none placeholder:text-slate-500',
                        icon ? 'pl-10 pr-4' : 'px-4',
                        className
                    )}
                    {...props}
                />
            </div>
        )
    }
)
Input.displayName = 'Input'

export { Input }
