import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false, // Disable sourcemaps in production for smaller bundle
    minify: 'terser', // Use terser for better minification
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
        skills: 'skills.html',
        about: 'about.html'
      },
      output: {
        manualChunks: {
          three: ['three'], // Split Three.js into separate chunk
          vendor: ['pdfjs-dist'] // Split vendor dependencies
        }
      }
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable compression
    reportCompressedSize: true
  },
  preview: {
    port: 4173
  },
  // Enable CSS code splitting
  css: {
    devSourcemap: false
  }
})
