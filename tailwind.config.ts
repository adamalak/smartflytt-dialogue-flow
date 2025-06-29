
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
				inter: ['Inter', 'system-ui', 'sans-serif']
			},
			fontSize: {
				base: ['18px', '1.6'],
				lg: ['20px', '1.7'],
				xl: ['22px', '1.8']
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				smartflytt: {
					50: 'hsl(240 100% 98%)',
					100: 'hsl(240 100% 95%)',
					200: 'hsl(240 84% 88%)',
					300: 'hsl(240 75% 78%)',
					400: 'hsl(240 69% 66%)',
					500: 'hsl(240 67% 56%)',
					600: 'hsl(240 84% 47%)',
					700: 'hsl(240 86% 38%)',
					800: 'hsl(240 86% 30%)',
					900: 'hsl(240 84% 24%)',
					950: 'hsl(240 90% 15%)'
				}
			},
			ringColor: {
				smartflytt: {
					50: 'hsl(240 100% 98%)',
					100: 'hsl(240 100% 95%)',
					200: 'hsl(240 84% 88%)',
					300: 'hsl(240 75% 78%)',
					400: 'hsl(240 69% 66%)',
					500: 'hsl(240 67% 56%)',
					600: 'hsl(240 84% 47%)',
					700: 'hsl(240 86% 38%)',
					800: 'hsl(240 86% 30%)',
					900: 'hsl(240 84% 24%)',
					950: 'hsl(240 90% 15%)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'slide-in-up': {
					'0%': {
						opacity: '0',
						transform: 'translateY(20px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				},
				'bounce-subtle': {
					'0%, 20%, 50%, 80%, 100%': {
						transform: 'translateY(0)'
					},
					'40%': {
						transform: 'translateY(-4px)'
					},
					'60%': {
						transform: 'translateY(-2px)'
					}
				},
				'shimmer': {
					'0%': {
						backgroundPosition: '-200px 0'
					},
					'100%': {
						backgroundPosition: 'calc(200px + 100%) 0'
					}
				},
				'confetti': {
					'0%': {
						transform: 'scale(0) rotate(0deg)',
						opacity: '1'
					},
					'100%': {
						transform: 'scale(1) rotate(360deg)',
						opacity: '0'
					}
				},
				'typing': {
					'0%, 60%': {
						opacity: '1'
					},
					'30%': {
						opacity: '0.5'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'fade-in': 'fade-in 0.5s ease-out',
				'slide-in-up': 'slide-in-up 0.4s ease-out',
				'bounce-subtle': 'bounce-subtle 1s ease-in-out',
				'shimmer': 'shimmer 2s linear infinite',
				'confetti': 'confetti 3s ease-out infinite',
				'typing': 'typing 1.5s ease-in-out infinite'
			},
			backdropBlur: {
				xs: '2px'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
