/**
 * Input Component
 * Feature: 009-apple-hig-ui-redesign
 * Apple HIG-compliant input field with variants and states
 */

'use client';

import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { classNames } from '@/lib/design-system/classNames';

export type InputSize = 'sm' | 'md' | 'lg';
export type InputVariant = 'default' | 'filled' | 'outlined';
export type InputType = 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  size?: InputSize;
  variant?: InputVariant;
  type?: InputType;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error = false,
    errorMessage,
    size = 'md',
    variant = 'default',
    type = 'text',
    leftIcon,
    rightIcon,
    className,
    id,
    disabled = false,
    required = false,
    readOnly = false,
    'aria-label': ariaLabel,
    'aria-describedby': ariaDescribedBy,
    ...props
  },
  ref
) {
  const generatedId = useId();
  const inputId = id || `input-${generatedId}`;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error && errorMessage ? `${inputId}-error` : undefined;
  const describedBy = errorId || helperId || ariaDescribedBy;

  const baseStyles = classNames(
    'input-base',
    'w-full',
    'rounded-md',
    'border',
    'transition-colors duration-200',
    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0',
    'dark:bg-gray-800 dark:text-white'
  );

  const sizeStyles = {
    sm: classNames('input-sm', 'px-3 py-1.5 text-sm'),
    md: classNames('input-md', 'px-4 py-2 text-base'),
    lg: classNames('input-lg', 'px-5 py-3 text-lg'),
  };

  const variantStyles = {
    default: classNames(
      'input-default',
      'bg-white',
      'border-gray-300 dark:border-gray-600',
      'hover:border-gray-400 dark:hover:border-gray-500'
    ),
    filled: classNames(
      'input-filled',
      'bg-gray-100 dark:bg-gray-700',
      'border-transparent',
      'hover:bg-gray-200 dark:hover:bg-gray-600'
    ),
    outlined: classNames(
      'input-outlined',
      'bg-transparent',
      'border-2 border-gray-400 dark:border-gray-500',
      'hover:border-gray-600 dark:hover:border-gray-400'
    ),
  };

  const stateStyles = classNames(
    error && 'input-error border-red-500 focus:ring-red-500',
    disabled && 'input-disabled bg-gray-100 dark:bg-gray-900 cursor-not-allowed opacity-60'
  );

  const iconPaddingStyles = classNames(leftIcon ? 'pl-10' : '', rightIcon ? 'pr-10' : '');

  const inputClassName = classNames(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    stateStyles,
    iconPaddingStyles,
    className
  );

  return (
    <div className="input-wrapper w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="input-label block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="input-container relative">
        {leftIcon && (
          <div className="input-left-icon absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {leftIcon}
          </div>
        )}

        <input
          ref={ref}
          id={inputId}
          type={type}
          className={inputClassName}
          disabled={disabled}
          required={required}
          readOnly={readOnly}
          aria-label={ariaLabel}
          aria-invalid={error}
          aria-describedby={describedBy}
          {...props}
        />

        {rightIcon && (
          <div className="input-right-icon absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
            {rightIcon}
          </div>
        )}
      </div>

      {helperText && !error && (
        <p
          id={helperId}
          className="input-helper-text mt-2 text-sm text-gray-500 dark:text-gray-400"
        >
          {helperText}
        </p>
      )}

      {error && errorMessage && (
        <p id={errorId} className="input-error-text mt-2 text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      )}
    </div>
  );
});
