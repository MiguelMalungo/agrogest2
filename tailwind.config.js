/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: ['class'],
	content: [
		'./pages/**/*.{ts,tsx}',
		'./components/**/*.{ts,tsx}',
		'./app/**/*.{ts,tsx}',
		'./src/**/*.{ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '1rem',
			screens: {
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1400px',
			},
		},
		extend: {
			colors: {
				// AgroGest Brand Colors
				agrogest: {
					primary: '#013220',    // Verde escuro principal
					dark: '#013220',       // Verde escuro para overlay
					secondary: '#F5A926',  // Laranja para ações
					accent: '#F5A926',     // Laranja para realce
					light: '#4ade80',      // Verde claro para "iniciar"
					delete: '#ef4444',     // Vermelho para excluir
					pending: '#F5A926',    // Laranja para pendente
					50: '#f0fdf4',
					100: '#dcfce7',
					200: '#bbf7d0',
					300: '#86efac',
					400: '#4ade80',
					500: '#22c55e',
					600: '#16a34a',
					700: '#15803d',
					800: '#166534',
					900: '#14532d',
					950: '#052e16',
				},
				// Sistema de cores
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: '#ffffff',
				foreground: '#333333',
				primary: {
					DEFAULT: '#013220',
					foreground: '#ffffff',
				},
				secondary: {
					DEFAULT: '#F5A926',
					foreground: '#ffffff',
				},
				destructive: {
					DEFAULT: '#ef4444',
					foreground: '#ffffff',
				},
				muted: {
					DEFAULT: '#f5f5f5',
					foreground: '#666666',
				},
				accent: {
					DEFAULT: '#F5A926',
					foreground: '#ffffff',
				},
				popover: {
					DEFAULT: '#ffffff',
					foreground: '#333333',
				},
				card: {
					DEFAULT: 'rgba(255, 255, 255, 0.90)',
					foreground: '#333333',
				},
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px',
				xl: '16px',
				'2xl': '20px',
				'3xl': '24px',
			},
			backdropBlur: {
				'xs': '2px',
			},
			boxShadow: {
				'ios': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
				'ios-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
				'ios-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
			},
			fontFamily: {
				'sf': ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Text', 'SF Pro Display', 'Helvetica Neue', 'sans-serif'],
			},
			spacing: {
				'safe-top': 'env(safe-area-inset-top)',
				'safe-bottom': 'env(safe-area-inset-bottom)',
				'safe-left': 'env(safe-area-inset-left)',
				'safe-right': 'env(safe-area-inset-right)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'slide-up': {
					'0%': { transform: 'translateY(100%)' },
					'100%': { transform: 'translateY(0)' },
				},
				'pulse-green': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.7' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.3s ease-out',
				'slide-up': 'slide-up 0.3s ease-out',
				'pulse-green': 'pulse-green 2s infinite',
			},
		},
	},
	plugins: [
		require('tailwindcss-animate'),
		function({ addUtilities }) {
			const newUtilities = {
				'.safe-area-inset-top': {
					paddingTop: 'env(safe-area-inset-top)',
				},
				'.safe-area-inset-bottom': {
					paddingBottom: 'env(safe-area-inset-bottom)',
				},
				'.safe-area-inset-left': {
					paddingLeft: 'env(safe-area-inset-left)',
				},
				'.safe-area-inset-right': {
					paddingRight: 'env(safe-area-inset-right)',
				},
			}
			addUtilities(newUtilities)
		}
	],
}