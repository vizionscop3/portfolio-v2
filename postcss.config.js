module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    // CSS minification and optimization
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: [
          'default',
          {
            discardComments: { removeAll: true },
            reduceIdents: true,
            mergeIdents: true,
            discardUnused: true,
            autoprefixer: false, // Disable since we have autoprefixer above
            zindex: false, // Preserve z-index values for 3D scenes
          },
        ],
      },
    }),
  },
};
