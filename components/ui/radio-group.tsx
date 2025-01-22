// components/ui/radio-group.tsx
import * as React from "react"
import { cn } from "@/lib/utils"

export interface RadioGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    value?: string
    onValueChange?: (value: string) => void
}

const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(
    ({ className, value, onValueChange, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn("grid gap-2", className)}
                {...props}
            />
        )
    }
)
RadioGroup.displayName = "RadioGroup"

export interface RadioGroupItemProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const RadioGroupItem = React.forwardRef<HTMLInputElement, RadioGroupItemProps>(
    ({ className, ...props }, ref) => {
        return (
            <div className="relative inline-flex items-center">
                <input
                    type="radio"
                    className="peer sr-only"
                    ref={ref}
                    {...props}
                />
                <div
                    className={cn(
                        "h-4 w-4 rounded-full border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground",
                        className
                    )}
                />
            </div>
        )
    }
)
RadioGroupItem.displayName = "RadioGroupItem"

export { RadioGroup, RadioGroupItem }