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
  const baseStyles = "inline-flex items-center justify-center gap-2 font-black uppercase tracking-widest transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon-sm shadow-accent/40 border border-white/10",
    secondary: "bg-white text-slate-900 hover:bg-slate-50 border border-slate-200 shadow-xl",
    outline: "bg-transparent text-foreground border-2 border-foreground/10 hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/5",
    destructive: "bg-error-bg text-error-foreground border border-error/20 hover:bg-error/10",
    success: "bg-success-bg text-success-foreground border border-success/20 hover:bg-success/10",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-10 py-3.5 text-xs",
    lg: "px-12 py-4 text-sm",
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

