import { motion } from 'framer-motion';
import React from 'react';

interface Skill {
  name: string;
  level: number;
  icon?: string;
  category?: string;
}

interface MinimalSkillGridProps {
  skills: Skill[];
  showLevels?: boolean;
  compact?: boolean;
  className?: string;
}

export const MinimalSkillGrid: React.FC<MinimalSkillGridProps> = ({
  skills,
  showLevels = false,
  compact = false,
  className = '',
}) => {
  return (
    <div
      className={`grid ${compact ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2' : 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3'} ${className}`}
    >
      {skills.map((skill, index) => (
        <motion.div
          key={skill.name}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className={`${
            compact
              ? 'bg-white/5 rounded-lg p-2 hover:bg-white/10'
              : 'bg-white/5 rounded-xl p-3 hover:bg-white/10'
          } transition-all duration-200 border border-white/10 hover:border-[#915EFF]/30`}
        >
          <div className="flex items-center gap-2">
            {skill.icon && (
              <span className={`${compact ? 'text-sm' : 'text-base'}`}>
                {skill.icon}
              </span>
            )}
            <div className="flex-1 min-w-0">
              <div
                className={`text-white font-medium ${compact ? 'text-xs' : 'text-sm'} truncate`}
              >
                {skill.name}
              </div>
              {showLevels && (
                <div
                  className={`flex items-center gap-2 ${compact ? 'mt-1' : 'mt-2'}`}
                >
                  <div
                    className={`bg-white/10 rounded-full overflow-hidden ${compact ? 'h-1' : 'h-1.5'} flex-1`}
                  >
                    <motion.div
                      className="bg-gradient-to-r from-[#915EFF] to-[#FF6B6B] h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ delay: index * 0.05 + 0.2, duration: 0.8 }}
                    />
                  </div>
                  {!compact && (
                    <span className="text-[#915EFF] text-xs font-medium">
                      {skill.level}%
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

interface MinimalProjectCardProps {
  title: string;
  description: string;
  tech: string[];
  status: string;
  github?: string;
  demo?: string;
  year: string;
  className?: string;
}

export const MinimalProjectCard: React.FC<MinimalProjectCardProps> = ({
  title,
  description,
  tech,
  status,
  github,
  demo,
  year,
  className = '',
}) => {
  return (
    <motion.div
      className={`bg-white/5 border border-white/10 rounded-xl p-4 hover:bg-white/8 hover:border-[#915EFF]/30 transition-all duration-300 ${className}`}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="text-white font-medium text-lg mb-1">{title}</h3>
          <div className="flex items-center gap-2">
            <span className="text-[#915EFF] text-xs font-medium px-2 py-1 bg-[#915EFF]/10 rounded-full">
              {status}
            </span>
            <span className="text-secondary text-xs">{year}</span>
          </div>
        </div>
      </div>

      <p className="text-secondary text-sm mb-4 line-clamp-3">{description}</p>

      <div className="flex flex-wrap gap-1 mb-4">
        {tech.slice(0, 4).map((techItem, index) => (
          <span
            key={index}
            className="text-xs px-2 py-1 bg-white/10 text-white rounded-md"
          >
            {techItem}
          </span>
        ))}
        {tech.length > 4 && (
          <span className="text-xs px-2 py-1 bg-white/5 text-secondary rounded-md">
            +{tech.length - 4} more
          </span>
        )}
      </div>

      <div className="flex gap-2">
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors"
          >
            Code
          </a>
        )}
        {demo && (
          <a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs px-3 py-1.5 bg-[#915EFF]/20 hover:bg-[#915EFF]/30 text-[#915EFF] rounded-lg transition-colors"
          >
            Demo
          </a>
        )}
      </div>
    </motion.div>
  );
};
