import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, helperText, error, fullWidth = false, id, ...props }, ref) => {
    const inputId = id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={cn('flex flex-col space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={inputId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          className={cn(
            "flex rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
            error && "border-red-500 focus:ring-red-500",
            fullWidth && 'w-full',
            className
          )}
          ref={ref}
          {...props}
        />
        {error ? (
          <p className="text-sm text-red-500">{error}</p>
        ) : helperText ? (
          <p className="text-sm text-gray-500">{helperText}</p>
        ) : null}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;