export default function Footer() {
  const links = [
    { label: 'Documentation', href: '#' },
    { label: 'System Status', href: '#' },
    { label: 'Security Policy', href: '#' },
    { label: 'Contact Support', href: '#' },
  ]

  return (
    <footer className="w-full py-8 bg-surface border-t border-outline-variant/10">
      <div className="max-w-[1440px] mx-auto px-10 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Brand */}
        <div className="flex flex-col gap-2">
          <div className="text-xl font-bold text-on-surface">NeuralCore AI Portal</div>
          <p className="text-xs text-outline-variant">© 2024 NeuralCore Enterprise AI. Proprietary and Confidential.</p>
        </div>

        {/* Links */}
        <div className="flex gap-8">
          {links.map((link) => (
            <a
              key={link.label}
              className="text-sm text-on-secondary-container hover:text-primary transition-colors"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}