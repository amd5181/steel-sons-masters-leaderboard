module.exports = {
  content: ['./index.html', './*.jsx'],
  theme: {
    extend: {
      keyframes: {
        'slide-in': {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      animation: {
        'slide-in': 'slide-in 0.6s ease-out',
      },
    },
  },
  plugins: [],
};
