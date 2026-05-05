import { type ReactNode, type ElementType, type ComponentPropsWithoutRef } from "react";

type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps<T extends ElementType> = {
  as?: T;
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  children: ReactNode;
} & ComponentPropsWithoutRef<T>;

export function Button<T extends ElementType = "button">({
  as,
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps<T>): ReactNode {
  const Component = as || "button";
  const baseStyles = "relative inline-flex items-center justify-center gap-3 font-black uppercase tracking-[0.15em] transition-all duration-300 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 text-center overflow-hidden cursor-pointer whitespace-nowrap";
  
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-accent text-accent-foreground hover:bg-accent/90 shadow-neon shadow-accent/40 border border-white/10",
    secondary: "bg-white text-slate-950 hover:bg-slate-50 border border-slate-200 shadow-xl",
    outline: "bg-transparent text-foreground border-2 border-foreground/10 hover:border-accent hover:text-accent",
    ghost: "bg-transparent text-foreground/70 hover:text-foreground hover:bg-foreground/5",
    destructive: "bg-error-bg text-error-foreground border border-error/20 hover:bg-error/10",
    success: "bg-success-bg text-success-foreground border border-success/20 hover:bg-success/10",
  };

  const sizes: Record<ButtonSize, string> = {
    sm: "px-6 py-2.5 text-[9px]",
    md: "px-10 py-4 text-[10px]",
    lg: "px-12 py-4 text-xs",
  };

  return (
    <Component
      className={`group ${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer" />
      
      {isLoading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="shrink-0">{leftIcon}</span>}
          <span className="relative z-10">{children}</span>
          {rightIcon && <span className="shrink-0">{rightIcon}</span>}
        </>
      )}
    </Component>
  );
}




