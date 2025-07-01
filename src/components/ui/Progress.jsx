import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/shadcn-utils";

// Progress component for showing loading states, percentages, etc.
const Progress = React.forwardRef(({ 
  value = 0,
  max = 100,
  className,
  indicatorClassName,
  showValue = false,
  valuePosition = "right",
  valueClassName,
  animate = true,
  size = "md",
  variant = "primary",
  label,
  labelClassName,
  ...props
}, ref) => {
  // Calculate percentage
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  // Size classes
  const sizeClasses = {
    xs: "h-1",
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
    xl: "h-5"
  };
  
  // Variant/color classes
  const variantClasses = {
    primary: "bg-primary-600 dark:bg-primary-500",
    secondary: "bg-secondary-500 dark:bg-secondary-400",
    success: "bg-green-600 dark:bg-green-500",
    warning: "bg-yellow-500 dark:bg-yellow-400",
    error: "bg-red-600 dark:bg-red-500",
    info: "bg-blue-600 dark:bg-blue-500",
    gray: "bg-gray-600 dark:bg-gray-500"
  };
  
  // Value position classes
  const valuePositionClasses = {
    left: "justify-start",
    right: "justify-end",
    top: "flex-col justify-start items-center",
    bottom: "flex-col-reverse justify-start items-center"
  };
  
  // Check if value position is top or bottom to adjust flex direction
  const isVerticalValue = valuePosition === 'top' || valuePosition === 'bottom';

  return (
    <div ref={ref} className={cn("w-full", className)} {...props}>
      {/* Label */}
      {label && (
        <div className={cn(
          "flex items-center justify-between mb-1", 
          labelClassName
        )}>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          {showValue && valuePosition === 'above' && (
            <span className={cn(
              "text-sm font-medium text-gray-500 dark:text-gray-400",
              valueClassName
            )}>
              {percentage.toFixed(0)}%
            </span>
          )}
        </div>
      )}
      
      {/* Progress bar and value */}
      <div className={cn(
        "flex gap-2",
        isVerticalValue ? valuePositionClasses[valuePosition] : "items-center",
        !isVerticalValue && showValue && valuePosition === 'left' && "flex-row-reverse"
      )}>
        {/* The actual progress bar */}
        <div className={cn(
          "flex-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden",
          sizeClasses[size]
        )}>
          <motion.div
            className={cn(
              "h-full rounded-full",
              variantClasses[variant],
              indicatorClassName
            )}
            initial={animate ? { width: "0%" } : { width: `${percentage}%` }}
            animate={animate ? { width: `${percentage}%` } : {}}
            transition={{ 
              duration: animate ? 0.6 : 0, 
              ease: "easeOut" 
            }}
          />
        </div>
        
        {/* Value percentage */}
        {showValue && valuePosition !== 'above' && (
          <span className={cn(
            "text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px] text-center",
            valueClassName
          )}>
            {percentage.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
});

Progress.displayName = "Progress";

export { Progress };
