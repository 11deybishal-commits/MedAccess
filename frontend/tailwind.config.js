module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0066cc',
        secondary: '#00d4ff',
        success: '#10b981',
        danger: '#ef4444',
        warning: '#f59e0b',
      },
      spacing: {
        sidebar: '16rem',
      },
    },
  },
  plugins: [],
}
