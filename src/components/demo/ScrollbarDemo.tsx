import React from 'react';

export const ScrollbarDemo: React.FC = () => {
  return (
    <div className="fixed top-4 right-4 z-50 bg-black/80 backdrop-blur-sm border border-white/10 rounded-lg p-4 max-w-sm">
      <h3 className="text-white text-sm font-semibold mb-3">
        Modern Scrollbar Styles
      </h3>

      {/* Default modern scrollbar */}
      <div className="mb-4">
        <p className="text-white/70 text-xs mb-2">Default Modern</p>
        <div className="h-20 overflow-y-auto bg-white/5 rounded p-2">
          <div className="h-40 text-white/60 text-xs">
            Scroll to see the modern minimalistic scrollbar with subtle shadows
            and smooth transitions. This is the new default scrollbar design
            that replaces the gradient cyber theme. It features a clean, thin
            design with hover effects.
          </div>
        </div>
      </div>

      {/* Modern scroll class */}
      <div className="mb-4">
        <p className="text-white/70 text-xs mb-2">Modern Scroll Class</p>
        <div className="modern-scroll h-20 overflow-y-auto bg-white/5 rounded p-2">
          <div className="h-40 text-white/60 text-xs">
            This uses the .modern-scroll class for consistent styling across
            components. Perfect for content areas that need scrolling.
          </div>
        </div>
      </div>

      {/* Ultra-thin variant */}
      <div className="mb-4">
        <p className="text-white/70 text-xs mb-2">Ultra-thin Variant</p>
        <div className="ultra-thin-scroll h-20 overflow-y-auto bg-white/5 rounded p-2">
          <div className="h-40 text-white/60 text-xs">
            Ultra-thin scrollbar (3px) for subtle areas where you want minimal
            visual impact. Great for sidebars or secondary content.
          </div>
        </div>
      </div>

      {/* Invisible scroll */}
      <div className="mb-4">
        <p className="text-white/70 text-xs mb-2">Invisible (Hover to Show)</p>
        <div className="invisible-scroll h-20 overflow-y-auto bg-white/5 rounded p-2">
          <div className="h-40 text-white/60 text-xs">
            Invisible scrollbar that only appears on hover. Perfect for clean
            interfaces where you want to hide scrollbars until needed.
          </div>
        </div>
      </div>

      {/* Accessible scrollbar */}
      <div>
        <p className="text-white/70 text-xs mb-2">
          Accessible (Enhanced Visibility)
        </p>
        <div className="custom-scrollbar h-20 overflow-y-auto bg-white/5 rounded p-2">
          <div className="h-40 text-white/60 text-xs">
            Enhanced visibility scrollbar for accessibility. Wider and more
            visible for users who need better contrast and easier interaction.
          </div>
        </div>
      </div>
    </div>
  );
};
