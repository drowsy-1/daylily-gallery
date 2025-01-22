// components/ui/checkbox.tsx
import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => (
        <div className="relative inline-flex items-center">
            <input
                type="checkbox"
                className="peer sr-only"
                ref={ref}
                {...props}
            />
            <div
                className={cn(
                    "h-4 w-4 rounded border border-primary ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer-checked:bg-primary peer-checked:text-primary-foreground",
                    className
                )}
            >
                <Check className="h-3 w-3 hidden peer-checked:block" />
            </div>
        </div>
    )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }