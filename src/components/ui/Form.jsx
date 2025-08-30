import React from "react";
import { motion } from "framer-motion";
import { cn } from "../../utils/shadcn-utils";
import Icon from "../AppIcon";

// Form component
const Form = React.forwardRef(({ className, onSubmit, children, ...props }, ref) => {
  return (
    <form
      ref={ref}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit?.(e);
      }}
      className={cn("space-y-6", className)}
      {...props}
    >
      {children}
    </form>
  );
});
Form.displayName = "Form";

// FormField component (for layout)
const FormField = React.forwardRef(({ className, children, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("grid gap-2", className)} {...props}>
      {children}
    </div>
  );
});
FormField.displayName = "FormField";

// FormLabel component
const FormLabel = React.forwardRef(({ className, isRequired, children, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-gray-700 dark:text-gray-300", className)}
      {...props}
    >
      {children}
      {isRequired && <span className="text-error ml-1">*</span>}
    </label>
  );
});
FormLabel.displayName = "FormLabel";

// FormControl component
const FormControl = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <div ref={ref} className={cn("relative", className)} {...props} />
  );
});
FormControl.displayName = "FormControl";

// FormDescription component
const FormDescription = React.forwardRef(({ className, ...props }, ref) => {
  return (
    <p
      ref={ref}
      className={cn("text-xs text-gray-500 dark:text-gray-400", className)}
      {...props}
    />
  );
});
FormDescription.displayName = "FormDescription";

// FormMessage component (for error messages)
const FormMessage = React.forwardRef(({ className, children, error, ...props }, ref) => {
  if (!children && !error) return null;
  
  const message = children || error;
  
  return (
    <motion.p
      ref={ref}
      className={cn("text-sm text-error flex items-center gap-1", className)}
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      <Icon name="AlertCircle" size={16} />
      <span>{message}</span>
    </motion.p>
  );
});
FormMessage.displayName = "FormMessage";

// FormInput component
const FormInput = React.forwardRef(({ className, isError, icon, type = "text", ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name={icon} size={18} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <motion.input
        ref={ref}
        type={type}
        className={cn(
          "w-full px-4 py-2 rounded-md border",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "transition-all duration-200",
          icon && "pl-10",
          isError
            ? "border-error focus:ring-error focus:border-error"
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        whileFocus={{ scale: 1.005 }}
        transition={{ type: "spring", stiffness: 300, damping: 10 }}
        {...props}
      />
    </div>
  );
});
FormInput.displayName = "FormInput";

// FormSelect component
const FormSelect = React.forwardRef(({ className, options = [], isError, icon, ...props }, ref) => {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon name={icon} size={18} className="text-gray-400 dark:text-gray-500" />
        </div>
      )}
      <select
        ref={ref}
        className={cn(
          "w-full px-4 py-2 rounded-md border appearance-none",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "transition-all duration-200",
          icon && "pl-10",
          isError
            ? "border-error focus:ring-error focus:border-error"
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500",
          "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
        <Icon name="ChevronDown" size={18} className="text-gray-400 dark:text-gray-500" />
      </div>
    </div>
  );
});
FormSelect.displayName = "FormSelect";

// FormCheckbox component
const FormCheckbox = React.forwardRef(({ className, label, isError, ...props }, ref) => {
  return (
    <div className="flex items-center">
      <motion.input
        ref={ref}
        type="checkbox"
        className={cn(
          "h-4 w-4 rounded",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "transition-all duration-200",
          isError
            ? "border-error focus:ring-error"
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500",
          "text-primary-600 dark:text-primary-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
});
FormCheckbox.displayName = "FormCheckbox";

// FormTextarea component
const FormTextarea = React.forwardRef(({ className, isError, ...props }, ref) => {
  return (
    <motion.textarea
      ref={ref}
      className={cn(
        "w-full px-4 py-2 rounded-md border",
        "focus:outline-none focus:ring-2 focus:ring-offset-1",
        "transition-all duration-200",
        isError
          ? "border-error focus:ring-error focus:border-error"
          : "border-gray-300 dark:border-gray-600 focus:ring-primary-500 focus:border-primary-500",
        "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "min-h-[80px] resize-vertical",
        className
      )}
      whileFocus={{ scale: 1.005 }}
      transition={{ type: "spring", stiffness: 300, damping: 10 }}
      {...props}
    />
  );
});
FormTextarea.displayName = "FormTextarea";

// FormRadio component
const FormRadio = React.forwardRef(({ className, label, isError, ...props }, ref) => {
  return (
    <div className="flex items-center">
      <motion.input
        ref={ref}
        type="radio"
        className={cn(
          "h-4 w-4 rounded-full",
          "focus:outline-none focus:ring-2 focus:ring-offset-1",
          "transition-all duration-200",
          isError
            ? "border-error focus:ring-error"
            : "border-gray-300 dark:border-gray-600 focus:ring-primary-500",
          "text-primary-600 dark:text-primary-500",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          className
        )}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        {...props}
      />
      {label && (
        <label htmlFor={props.id} className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          {label}
        </label>
      )}
    </div>
  );
});
FormRadio.displayName = "FormRadio";

// FormSubmit button component
const FormSubmit = React.forwardRef(({ className, isLoading, children, ...props }, ref) => {
  return (
    <motion.button
      ref={ref}
      type="submit"
      className={cn(
        "px-4 py-2 rounded-md bg-primary-600 text-white font-medium",
        "hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "transition-all duration-200",
        "flex items-center justify-center gap-2",
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Processing...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
});
FormSubmit.displayName = "FormSubmit";

export {
  Form,
  FormField,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormInput,
  FormSelect,
  FormCheckbox,
  FormTextarea,
  FormRadio,
  FormSubmit,
};

