import React from "react";
import { cn } from "@/lib/utils";

interface ProgresserProps {
    className?: string;
    size?: "sm" | "md" | "lg";
    color?: "primary" | "white" | "blue";
}

const Progresser: React.FC<ProgresserProps> = ({
    className,
    size = "md",
    color = "primary"
}) => {
    const sizeClasses = {
        sm: "w-1 h-1",
        md: "w-2 h-2",
        lg: "w-3 h-3"
    };

    const colorClasses = {
        primary: "bg-primary",
        white: "bg-white",
        blue: "bg-blue-500"
    };

    return (
        <div className={cn("flex gap-1", className)}>
            <div
                className={cn(
                    "rounded-full animate-bounce",
                    sizeClasses[size],
                    colorClasses[color]
                )}
                style={{ animationDelay: '0ms' }}
            />
            <div
                className={cn(
                    "rounded-full animate-bounce",
                    sizeClasses[size],
                    colorClasses[color]
                )}
                style={{ animationDelay: '150ms' }}
            />
            <div
                className={cn(
                    "rounded-full animate-bounce",
                    sizeClasses[size],
                    colorClasses[color]
                )}
                style={{ animationDelay: '300ms' }}
            />
        </div>
    );
};

export { Progresser }; 