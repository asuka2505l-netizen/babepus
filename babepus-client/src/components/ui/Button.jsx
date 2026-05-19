import { cn } from "../../utils/cn";

const variants = {
  primary: "bg-emerald-600 text-white shadow-soft hover:bg-emerald-700",
  secondary: "bg-white text-slate-700 ring-1 ring-slate-200 hover:bg-slate-50",
  danger: "bg-rose-600 text-white hover:bg-rose-700",
  ghost: "text-slate-700 hover:bg-slate-100",
  dark: "bg-slate-950 text-white hover:bg-slate-800"
};

const sizes = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-5 py-3 text-base"
};

const Button = ({ children, className, disabled, size = "md", type = "button", variant = "primary", ...props }) => (
  <button
    type={type}
    disabled={disabled}
    className={cn(
      "inline-flex items-center justify-center rounded-xl font-semibold transition disabled:cursor-not-allowed disabled:opacity-60",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
