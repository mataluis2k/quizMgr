import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helperText?: string;
  error?: string;
  fullWidth?: boolean;
}

const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ className, label, helperText, error, fullWidth = false, id, rows = 3, ...props }, ref) => {
    const textareaId = id || props.name || Math.random().toString(36).substring(2, 9);
    
    return (
      <div className={cn('flex flex-col space-y-1.5', fullWidth && 'w-full')}>
        {label && (
          <label 
            htmlFor={textareaId}
            className="text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}
        <textarea
          id={textareaId}
          rows={rows}
          className={cn(
            "flex min-h-[80px] rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
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

TextArea.displayName = 'TextArea';

export default TextArea;