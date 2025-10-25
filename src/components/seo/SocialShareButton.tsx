/**
 * Social Share Button Component
 *
 * Provides social media sharing functionality with platform-specific
 * styling and behavior. Supports Twitter, Facebook, LinkedIn, email, and copy.
 */

import React, { useState } from 'react';
import { useSocialSharing } from '../../shared/hooks/useSEO';
import { SectionId } from '../../shared/types';

interface SocialShareButtonProps {
  platform: 'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy';
  section?: SectionId;
  variant?: 'icon' | 'button' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showLabel?: boolean;
  customLabel?: string;
}

export const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  platform,
  section,
  variant = 'icon',
  size = 'medium',
  className = '',
  showLabel = false,
  customLabel,
}) => {
  const { openShare, copyToClipboard, isSharing } = useSocialSharing();
  const [justCopied, setJustCopied] = useState(false);

  const handleShare = async () => {
    if (platform === 'copy') {
      const success = await copyToClipboard(section);
      if (success) {
        setJustCopied(true);
        setTimeout(() => setJustCopied(false), 2000);
      }
    } else {
      openShare(platform, section);
    }
  };

  // Platform configurations
  const platformConfig = {
    twitter: {
      icon: TwitterIcon,
      label: 'Share on Twitter',
      color: 'hover:bg-blue-500 hover:text-white',
      bgColor: 'bg-blue-500',
    },
    facebook: {
      icon: FacebookIcon,
      label: 'Share on Facebook',
      color: 'hover:bg-blue-600 hover:text-white',
      bgColor: 'bg-blue-600',
    },
    linkedin: {
      icon: LinkedInIcon,
      label: 'Share on LinkedIn',
      color: 'hover:bg-blue-700 hover:text-white',
      bgColor: 'bg-blue-700',
    },
    email: {
      icon: EmailIcon,
      label: 'Share via Email',
      color: 'hover:bg-gray-600 hover:text-white',
      bgColor: 'bg-gray-600',
    },
    copy: {
      icon: justCopied ? CheckIcon : CopyIcon,
      label: justCopied ? 'Copied!' : 'Copy Link',
      color: justCopied
        ? 'hover:bg-green-500 hover:text-white'
        : 'hover:bg-[#00F7ED] hover:text-black',
      bgColor: justCopied ? 'bg-green-500' : 'bg-[#00F7ED]',
    },
  };

  const config = platformConfig[platform];
  const IconComponent = config.icon;

  // Size configurations
  const sizeClasses = {
    small: variant === 'icon' ? 'w-8 h-8' : 'px-2 py-1 text-sm',
    medium: variant === 'icon' ? 'w-10 h-10' : 'px-3 py-2',
    large: variant === 'icon' ? 'w-12 h-12' : 'px-4 py-3 text-lg',
  };

  const iconSizes = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6',
  };

  // Variant styles
  const getVariantClasses = () => {
    switch (variant) {
      case 'button':
        return `${config.bgColor} text-white ${sizeClasses[size]} rounded-lg font-medium transition-all duration-200 hover:scale-105 active:scale-95`;
      case 'minimal':
        return `text-[#00F7ED] ${config.color} ${sizeClasses[size]} transition-colors duration-200`;
      case 'icon':
      default:
        return `bg-black/20 border border-[#00F7ED]/30 text-[#00F7ED] ${config.color} ${sizeClasses[size]} rounded-lg transition-all duration-200 hover:border-[#00F7ED] hover:scale-105 active:scale-95 backdrop-blur-sm`;
    }
  };

  const displayLabel = customLabel || config.label;

  return (
    <button
      onClick={handleShare}
      className={`
        flex items-center justify-center space-x-2 
        ${getVariantClasses()}
        ${isSharing ? 'animate-pulse' : ''}
        ${className}
      `}
      aria-label={displayLabel}
      title={displayLabel}
      disabled={isSharing}
    >
      <IconComponent className={iconSizes[size]} />
      {(showLabel || variant === 'button') && (
        <span className={variant === 'icon' ? 'sr-only' : ''}>
          {displayLabel}
        </span>
      )}
    </button>
  );
};

// Social Share Button Group Component
interface SocialShareGroupProps {
  section?: SectionId;
  platforms?: Array<'twitter' | 'facebook' | 'linkedin' | 'email' | 'copy'>;
  variant?: 'icon' | 'button' | 'minimal';
  size?: 'small' | 'medium' | 'large';
  orientation?: 'horizontal' | 'vertical';
  className?: string;
  showLabels?: boolean;
  title?: string;
}

export const SocialShareGroup: React.FC<SocialShareGroupProps> = ({
  section,
  platforms = ['twitter', 'facebook', 'linkedin', 'copy'],
  variant = 'icon',
  size = 'medium',
  orientation = 'horizontal',
  className = '',
  showLabels = false,
  title = 'Share this',
}) => {
  return (
    <div className={`${className}`}>
      {title && (
        <h3 className="text-sm font-medium text-[#00F7ED] mb-3">{title}</h3>
      )}
      <div
        className={`
          flex gap-2
          ${orientation === 'vertical' ? 'flex-col' : 'flex-row'}
        `}
      >
        {platforms.map(platform => (
          <SocialShareButton
            key={platform}
            platform={platform}
            section={section}
            variant={variant}
            size={size}
            showLabel={showLabels}
          />
        ))}
      </div>
    </div>
  );
};

// Platform Icons
const TwitterIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const LinkedInIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

const EmailIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const CopyIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const CheckIcon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export default SocialShareButton;
