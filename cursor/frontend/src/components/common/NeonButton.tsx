import { ButtonHTMLAttributes, PropsWithChildren } from "react";

export default function NeonButton({ children, className = "", ...props }: PropsWithChildren<ButtonHTMLAttributes<HTMLButtonElement>>) {
  return (
    <button className={`neon-button ${className}`} {...props}>
      {children}
    </button>
  );
}

