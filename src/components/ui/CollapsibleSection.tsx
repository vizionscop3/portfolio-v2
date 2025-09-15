import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import React, { useState } from 'react';

interface CollapsibleSectionProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  variant?: 'default' | 'minimal' | 'card';
  className?: string;
  headerClassName?: string;
  contentClassName?: string;
}

export const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  variant = 'default',
  className = '',
  headerClassName = '',
  contentClassName = '',
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const toggleOpen = () => setIsOpen(!isOpen);

  const baseClasses = {
    default: 'bg-tertiary/50 border border-white/10 rounded-xl',
    minimal: 'border-b border-white/10',
    card: 'green-pink-gradient p-[1px] rounded-[20px] shadow-card',
  };

  const headerClasses = {
    default: 'p-4 cursor-pointer hover:bg-white/5 transition-colors',
    minimal: 'py-3 cursor-pointer hover:bg-white/5 transition-colors',
    card: 'bg-tertiary rounded-[20px] p-4 cursor-pointer hover:bg-white/5 transition-colors',
  };

  return (
    <div className={`${baseClasses[variant]} ${className}`}>
      <div
        className={`${headerClasses[variant]} ${headerClassName}`}
        onClick={toggleOpen}
        role="button"
        tabIndex={0}
        onKeyDown={e => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            toggleOpen();
          }
        }}
        aria-expanded={isOpen ? 'true' : 'false'}
        aria-controls={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {icon && <div className="text-[#915EFF]">{icon}</div>}
            <div>
              <h3 className="text-white font-medium text-lg">{title}</h3>
              {subtitle && (
                <p className="text-secondary text-sm mt-1">{subtitle}</p>
              )}
            </div>
          </div>

          <motion.div
            animate={{ rotate: isOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-[#915EFF] flex-shrink-0"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`collapsible-content-${title.replace(/\s+/g, '-').toLowerCase()}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div
              className={`${variant === 'card' ? 'px-4 pb-4' : variant === 'minimal' ? 'pb-3' : 'p-4 pt-0'} ${contentClassName}`}
            >
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface ExpandableCardProps {
  title: string;
  summary: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({
  title,
  summary,
  children,
  icon,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      className={`green-pink-gradient p-[1px] rounded-[20px] shadow-card ${className}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="bg-tertiary rounded-[20px] p-6">
        <div
          className="cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
          role="button"
          tabIndex={0}
          onKeyDown={e => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setIsExpanded(!isExpanded);
            }
          }}
          aria-expanded={isExpanded ? 'true' : 'false'}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              {icon && (
                <div className="text-[#915EFF] flex-shrink-0 mt-1">{icon}</div>
              )}
              <div className="flex-1">
                <h3 className="text-white font-medium text-lg mb-2">{title}</h3>
                <p className="text-secondary text-sm">{summary}</p>
              </div>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-[#915EFF] flex-shrink-0"
            >
              <ChevronDown className="w-5 h-5" />
            </motion.div>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden"
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
