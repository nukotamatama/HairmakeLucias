import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button";

        const variants = {
            primary: "bg-stone-800 text-stone-50 hover:bg-stone-700 shadow-sm",
            secondary: "bg-stone-200 text-stone-900 hover:bg-stone-300",
            outline: "border border-stone-300 bg-transparent hover:bg-stone-100 text-stone-800",
            ghost: "hover:bg-stone-100 text-stone-600 hover:text-stone-900",
        };

        const sizes = {
            sm: "h-9 px-3 text-xs",
            md: "h-11 px-8 py-2",
            lg: "h-14 px-10 text-lg",
            icon: "h-10 w-10",
        };

        return (
            <Comp
                className={cn(
                    "inline-flex items-center justify-center rounded-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stone-400 disabled:pointer-events-none disabled:opacity-50 font-medium tracking-wide",
                    variants[variant],
                    sizes[size],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
