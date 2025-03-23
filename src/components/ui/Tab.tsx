"use client";
import Link from "next/link";

interface TabProps {
  name: string;
  href: string;
  active: boolean;
  icon?: ReactNode;
}

export default function Tab({ name, href, active, icon }: TabProps) {
  return (
    <Link
      href={href}
      className={`flex items-center px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? "border-b-2 border-blue-500 text-blue-600"
          : "text-gray-600 hover:text-blue-600 hover:border-b-2 hover:border-blue-200"
      }`}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {name}
    </Link>
  );
}