import React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '../ui/Card';

interface SkillBadgeProps {
  name: string;
  onRemove?: () => void;
  hasSkill?: boolean; // Used in Gap Analysis to show a checkmark
  className?: string;
  variant?: 'default' | 'missing' | 'outline';
}

export const SkillBadge: React.FC<SkillBadgeProps> = ({ 
  name, 
  onRemove, 
  hasSkill, 
  className,
  variant = 'default' 
}) => {
  const variants = {
    default: 'bg-primary/10 text-primary-dark border-transparent',
    missing: 'bg-white border border-dashed border-neutral-dark text-neutral-dark',
    outline: 'bg-white border border-neutral-light text-neutral-dark',
  };

  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
      variants[variant],
      className
    )}>
      {hasSkill && <Check size={14} className="text-success" />}
      <span>{name}</span>
      {onRemove && (
        <button 
          onClick={onRemove}
          className="hover:text-error transition-colors focus:outline-none ml-1"
          aria-label={`Remove ${name}`}
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
