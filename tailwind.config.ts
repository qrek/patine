import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        cream:  '#F5F3EF',
        noir:   '#1C1C1A',
        'noir-soft': '#3A3A38',
        gold:   '#B8A87A',
        muted:  '#8A8A84',
        border: '#DDDBD6',
      },
      fontFamily: {
        power:      ['var(--font-power)', 'system-ui', 'sans-serif'],
        instrument: ['var(--font-instrument)', 'system-ui', 'sans-serif'],
        cormorant:  ['var(--font-cormorant)', 'Georgia', 'serif'],
      },
      fontSize: { '2xs': '11px' },
      letterSpacing: { caps: '0.12em' },
      maxWidth: { content: '680px', wide: '1160px' },
    },
  },
  plugins: [],
}
export default config
