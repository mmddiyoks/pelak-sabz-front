"use client"
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";


interface buttonProps {
    lable: string | undefined;
    disabled?: boolean;
    outline?: boolean;
    small?: boolean;
    icon?: ReactNode;
    onclick: (e: React.MouseEvent<HTMLButtonElement>) => void;
    className?: string
}
const Button: React.FC<buttonProps> = ({
    lable,
    disabled,
    outline,
    small,
    icon,
    onclick,
    className
}) => {
    return (
        <button
            onClick={onclick}
            disabled={disabled}
            className={cn(
                " relative  rounded-md hover:opacity-80  w-full text-[13px] disabled:opacity-50 px-4 py-2 border-none    bg-primary-400 text-white  disabled:cursor-not-allowed  disabled:pointer-events-none ",
                { "bg-white border-[1px] border-black ": outline },
                className,
                { "py-1  text-sm font-light  ": small }

            )}
        >

            {icon}
            {lable}</button>
    );
}

export default Button;