import { type ButtonHTMLAttributes, type ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = "inline-flex items-center justify-center gap-2 font-bold transition-all duration-300 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent text-accent-foreground hover:shadow-neon-sm border border-accent/20",
    secondary: "bg-subface text-foreground hover:bg-foreground/5 border border-foreground/10",
    outline: "bg-transparent text-foreground border-2 border-foreground/10 hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/5",
    destructive: "bg-error-bg text-error-foreground border border-error/20 hover:bg-error/10",
    success: "bg-success-bg text-success-foreground border border-success/20 hover:bg-success/10",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-5 py-2.5 text-sm",
    lg: "px-8 py-4 text-base",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  );
}
