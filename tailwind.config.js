module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      backgroundImage: {
        'main-background': "url('/src/assets/background.jpg')",
        'black-radial':
          'radial-gradient(circle, rgba(0,0,0,0.5) 42%, rgba(0,0,0,0.2) 92%);',
      },
      gridTemplateColumns: {
        'auto-fit': 'repeat(auto-fill, minmax(260px, 1fr))',
        'auto-fit-md': 'repeat(auto-fill, minmax(400px, 1fr))',
      },
      colors: {
        ant: '#1890ff',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
