type SkeletonProps = {
  className?: string;
  variant?: "text" | "rectangular" | "circular";
};

export const SkeletonLoader = ({ className = "", variant = "rectangular" }: SkeletonProps) => {
  const baseStyles = "animate-pulse bg-slate-200 dark:bg-slate-800";

  const variants = {
    text: "h-4 w-full rounded",
    rectangular: "h-20 w-full rounded-lg",
    circular: "h-12 w-12 rounded-full",
  };

  return <div className={`${baseStyles} ${variants[variant]} ${className}`} />;
};
