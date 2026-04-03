import Link from 'next/link'

interface FooterProps {
  text?: string
  instagram?: string
}

export default function Footer({ text = '© 2025 Patine', instagram }: FooterProps) {
  return (
    <footer className="border-t border-[#B8A87A]/30 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p
          className="text-xs tracking-widest uppercase text-[#1A1A18]/50"
          style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
        >
          {text}
        </p>
        {instagram && (
          <Link
            href={instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-widest uppercase text-[#1A1A18]/50 hover:text-[#B8A87A] transition-colors duration-300"
            style={{ fontFamily: 'var(--font-jost)', fontWeight: 300 }}
          >
            Instagram
          </Link>
        )}
      </div>
    </footer>
  )
}
