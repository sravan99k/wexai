import React from 'react';
import { Search, X } from 'lucide-react';
import { cn } from './Card';

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onChange, onClear, ...props }, ref) => {
    return (
      <div className={cn("relative flex items-center", className)}>
        <Search className="absolute left-3 text-neutral w-5 h-5" />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-10 py-2.5 bg-white border border-neutral-light rounded-lg text-neutral-darkest placeholder:text-neutral focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm"
          {...props}
        />
        {value && onClear && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 text-neutral hover:text-neutral-dark transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
