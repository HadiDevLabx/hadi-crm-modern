import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/shadcn-utils";
import Icon from "../AppIcon";

const Badge = React.forwardRef(({
  children,
  className,
  variant = "default",
  size = "md",
  icon,
  iconPosition = "left",
  dismissible = false,
  onDismiss,
  animate = false,
  ...props
}, ref) => {
  // Variant styles
  const variantStyles = {
    default: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
    primary: "bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300 border-primary-200 dark:border-primary-800",
    secondary: "bg-secondary-100 text-secondary-800 dark:bg-secondary-900/30 dark:text-secondary-300 border-secondary-200 dark:border-secondary-800",
    success: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-800",
    warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 border-red-200 dark:border-red-800",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    outline: "bg-transparent border-gray-300 text-gray-700 dark:border-gray-600 dark:text-gray-300",
  };

  // Size styles
  const sizeStyles = {
    xs: "text-xs px-1.5 py-0.5 rounded",
    sm: "text-xs px-2 py-1 rounded-md",
    md: "text-sm px-2.5 py-1 rounded-md",
    lg: "text-base px-3 py-1.5 rounded-lg",
  };

  // Prepare content with icon
  const content = (
    <>
      {icon && iconPosition === "left" && (
        <Icon 
          name={icon} 
          size={size === "xs" ? 12 : size === "sm" ? 14 : size === "md" ? 16 : 18}
          className="flex-shrink-0" 
        />
      )}
      <span>{children}</span>
      {icon && iconPosition === "right" && (
        <Icon 
          name={icon} 
          size={size === "xs" ? 12 : size === "sm" ? 14 : size === "md" ? 16 : 18}
          className="flex-shrink-0" 
        />
      )}
      {dismissible && (
        <button 
          type="button"
          onClick={onDismiss}
          className="ml-1 -mr-1 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 rounded-full p-0.5"
          aria-label="Dismiss"
        >
          <Icon name="X" size={size === "xs" ? 10 : size === "sm" ? 12 : size === "md" ? 14 : 16} />
        </button>
      )}
    </>
  );

  // Animation variants
  const badgeVariants = {
    initial: { 
      scale: animate ? 0.8 : 1, 
      opacity: animate ? 0 : 1 
    },
    animate: { 
      scale: 1, 
      opacity: 1 
    },
    exit: { 
      scale: 0.8, 
      opacity: 0 
    },
    hover: { 
      scale: 1.05 
    },
    tap: { 
      scale: 0.95 
    }
  };

  const BadgeComponent = animate ? motion.span : "span";
  const animationProps = animate ? {
    initial: "initial",
    animate: "animate",
    exit: "exit",
    whileHover: "hover",
    whileTap: "tap",
    variants: badgeVariants
  } : {};

  return (
    <BadgeComponent
      ref={ref}
      className={cn(
        "inline-flex items-center gap-1 font-medium border",
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...animationProps}
      {...props}
    >
      {content}
    </BadgeComponent>
  );
});

Badge.displayName = "Badge";

export { Badge };
