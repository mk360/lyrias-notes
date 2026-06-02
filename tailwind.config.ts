import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink:    'var(--color-ink)',
        ink2:   'var(--color-ink2)',
        ink3:   'var(--color-ink3)',
        paper:  'var(--color-paper)',
        paper2: 'var(--color-paper2)',
        paper3: 'var(--color-paper3)',
        rule:   'var(--color-rule)',
        sky100: 'var(--color-sky100)',
        sky200: 'var(--color-sky200)',
        sky300: 'var(--color-sky300)',
        sky500: 'var(--color-sky500)',
        sky700: 'var(--color-sky700)',
        gold:   'var(--color-gold)',
        goldDk: 'var(--color-goldDk)',
        goldLt: 'var(--color-goldLt)',
        red:    'var(--color-red)',
        green:  'var(--color-green)',
      },
      fontFamily: {
        caveat: ['Caveat', 'cursive'],
        fredoka: ['Fredoka', 'sans-serif'],
        elite: ['"Special Elite"', 'monospace'],
      },
      fontSize: {
        'display-xl': ['48px', { lineHeight: '0.9', fontWeight: '700' }],
        'display-lg': ['30px', { lineHeight: '1', fontWeight: '700' }],
        'display-md': ['22px', { lineHeight: '1', fontWeight: '700' }],
        'body': ['15px', { lineHeight: '1.6', fontWeight: '400' }],
        'body-sm': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.04em' }],
        'mono': ['12px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      spacing: {
        '1': '4px',
        '2': '8px',
        '3': '16px',
        '4': '32px',
        '5': '48px',
        '6': '64px',
        '7': '80px',
      },
      borderRadius: {
        'hand-sm': '8px 5px 7px 6px / 6px 8px 5px 7px',
        'hand-md': '14px 9px 12px 8px / 9px 13px 8px 14px',
        'hand-lg': '20px 14px 18px 12px / 14px 18px 12px 20px',
      },
      boxShadow: {
        'stamp': '2px 2.5px 0 #1F2D3E',
        'stamp-lg': '3px 4px 0 #1F2D3E',
        'stamp-sm': '1.5px 1.5px 0 rgba(31,45,62,0.33)',
      },
    },
  },
  plugins: [],
}

export default config
