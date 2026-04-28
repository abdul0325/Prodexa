'use client';

import React from 'react';
import './NexusPulse.css';

interface NexusPulseProps {
  size?: 'small' | 'medium' | 'large';
  variant?: 'overlay' | 'inline';
  theme?: 'dark' | 'light';
  showText?: boolean;
  text?: string;
  className?: string;
  ariaLabel?: string;
}

export const NexusPulse: React.FC<NexusPulseProps> = ({
  size = 'medium',
  variant = 'inline',
  theme = 'dark',
  showText = false,
  text = 'Loading...',
  className = '',
  ariaLabel = 'Loading content...'
}) => {
  const sizeClasses = {
    small: 'nexus-pulse--small',
    medium: '',
    large: 'nexus-pulse--large'
  };

  const variantClasses = {
    overlay: 'nexus-pulse--overlay',
    inline: 'nexus-pulse--inline'
  };

  const themeClasses = {
    dark: '',
    light: 'nexus-pulse--light'
  };

  const classes = [
    'nexus-pulse',
    sizeClasses[size],
    variantClasses[variant],
    themeClasses[theme],
    className
  ].filter(Boolean).join(' ');

  return (
    <div 
      className={classes}
      role="status"
      aria-label={ariaLabel}
      aria-hidden={variant === 'overlay' ? 'true' : 'false'}
    >
      {/* Central Geometric Core */}
      <div className="nexus-pulse__core" />
      
      {/* Energy Ring */}
      <div className="nexus-pulse__ring" />
      
      {/* Orbiting Particles Container */}
      <div className="nexus-pulse__orbits">
        {/* 5 Orbiting Particles */}
        <div className="nexus-pulse__particle" />
        <div className="nexus-pulse__particle" />
        <div className="nexus-pulse__particle" />
        <div className="nexus-pulse__particle" />
        <div className="nexus-pulse__particle" />
      </div>
      
      {/* Loading Text */}
      {showText && (
        <div className="nexus-pulse__text">
          {text}
        </div>
      )}
    </div>
  );
};

// JavaScript Helper Functions
export const NexusPulseHelpers = {
  showGlobalLoader: () => {
    const existingLoader = document.getElementById('nexus-pulse-global');
    if (!existingLoader) {
      const loaderElement = document.createElement('div');
      loaderElement.id = 'nexus-pulse-global';
      loaderElement.className = 'nexus-pulse--overlay';
      loaderElement.innerHTML = `
        <div class="nexus-pulse nexus-pulse--large">
          <div class="nexus-pulse__core"></div>
          <div class="nexus-pulse__ring"></div>
          <div class="nexus-pulse__orbits">
            <div class="nexus-pulse__particle"></div>
            <div class="nexus-pulse__particle"></div>
            <div class="nexus-pulse__particle"></div>
            <div class="nexus-pulse__particle"></div>
            <div class="nexus-pulse__particle"></div>
          </div>
          <div class="nexus-pulse__text">Loading...</div>
        </div>
      `;
      document.body.appendChild(loaderElement);
    }
    
    // Trigger active state
    setTimeout(() => {
      const loader = document.getElementById('nexus-pulse-global');
      if (loader) {
        loader.classList.add('active');
      }
    }, 10);
  },

  hideGlobalLoader: () => {
    const loader = document.getElementById('nexus-pulse-global');
    if (loader) {
      loader.classList.remove('active');
      setTimeout(() => {
        loader.remove();
      }, 300); // Wait for fade out animation
    }
  },

  // Check if loader is currently visible
  isLoaderVisible: () => {
    const loader = document.getElementById('nexus-pulse-global');
    return loader && loader.classList.contains('active');
  }
};

// Hook for React components
export const useNexusPulse = () => {
  return {
    show: NexusPulseHelpers.showGlobalLoader,
    hide: NexusPulseHelpers.hideGlobalLoader,
    isVisible: NexusPulseHelpers.isLoaderVisible
  };
};

export default NexusPulse;
