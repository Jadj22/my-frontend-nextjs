"use client";
import Link from "next/link";
import { AnchorHTMLAttributes } from "react";

interface ButtonLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: "primary" | "secondary" | "danger";
    size?: "sm" | "md" | "lg";
}

export default function ButtonLink({
                                       href,
                                       variant = "primary",
                                       size = "md",
                                       className = "",
                                       children,
                                       ...props
                                   }: ButtonLinkProps) {
    const baseStyles = "rounded-md font-medium transition-colors flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const sizeStyles =
        size === "sm"
            ? "px-2 py-1 text-sm"
            : size === "lg"
                ? "px-6 py-3 text-lg"
                : "px-4 py-2 text-base";

    const variantStyles =
        variant === "primary"
            ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 dark:bg-blue-500 dark:hover:bg-blue-600"
            : variant === "secondary"
                ? "bg-gray-200 text-gray-700 hover:bg-gray-300 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                : "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 dark:bg-red-500 dark:hover:bg-red-600";

    return (
        <Link
            href={href}
            className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
            {...props}
        >
            {children}
        </Link>
    );
}