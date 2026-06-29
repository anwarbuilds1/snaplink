import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
  helperText?: string;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className="w-full flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-xs font-bold text-slate-550 dark:text-slate-400">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full px-3.5 py-2.5 text-sm bg-white/50 dark:bg-slate-900/40 backdrop-blur-md border rounded-xl focus:outline-none focus:ring-2 transition-all duration-200
            ${
              error
                ? "border-red-500 dark:border-red-800/80 text-red-900 dark:text-red-400 placeholder-red-300/70 focus:ring-red-500 focus:border-red-500"
                : "border-slate-200 dark:border-slate-805/85 text-slate-900 dark:text-slate-100 placeholder-slate-450 dark:placeholder-slate-500 focus:ring-violet-500 focus:border-violet-500"
            } ${className}`}
          {...props}
        />
        {error && <span className="text-xs text-red-500 dark:text-red-400 pl-1">{error}</span>}
        {!error && helperText && <span className="text-xs text-slate-500 dark:text-slate-450 pl-1">{helperText}</span>}
      </div>
    );
  }
);

Input.displayName = "Input";
