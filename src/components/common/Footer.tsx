import React from 'react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="flex items-center space-x-2">
            <img src="/logo.svg" alt="Prioritizze" className="h-6 w-6" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              Prioritizze
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            © {currentYear} Prioritizze ToDo. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}