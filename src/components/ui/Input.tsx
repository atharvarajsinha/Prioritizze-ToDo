// import React from 'react';
// import { cn } from '../../utils/cn';

// interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
//   label?: string;
//   error?: string;
// }

// export function Input({ 
//   className, 
//   label, 
//   error, 
//   ...props 
// }: InputProps) {
//   return (
//     <div className="space-y-2">
//       {label && (
//         <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
//           {label}
//         </label>
//       )}
//       <input
//         className={cn(
//           'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-500',
//           error && 'border-red-500 focus:ring-red-500',
//           className
//         )}
//         {...props}
//       />
//       {error && (
//         <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
//       )}
//     </div>
//   );
// }

// src/components/ui/Input.tsx
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className={className}>
        {label && (
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full px-3 py-2 border ${
            error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
          } rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white`}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; // This helps with debugging in dev tools