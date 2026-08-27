import React from 'react';
import { cn } from './Card';

interface ProgressBarProps {
  value: number;
  className?: string;
  indicatorClassName?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ 
  value, 
  className,
  indicatorClassName = 'bg-primary' 
}) => {
  return (
    <div className={cn("w-full bg-neutral-light rounded-full h-2.5 overflow-hidden", className)}>
      <div 
        className={cn("h-2.5 rounded-full transition-all duration-500", indicatorClassName)} 
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      ></div>
    </div>
  );
};
