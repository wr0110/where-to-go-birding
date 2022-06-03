const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	  ],
	theme: {
		container: {
			center: true,
			padding: '1rem',
		},
		screens: {
			xs: '480px',
			sm: '640px',
			md: '768px',
			lg: '1024px',
			xl: '1100px',
		},
		fontFamily: {
			sans: ['Open Sans', ...defaultTheme.fontFamily.sans],
		},
		extend: {},
	},
	plugins: [
		require('@tailwindcss/forms'),
	],
}