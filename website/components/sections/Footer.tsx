import { Instagram, Twitter, Mail } from 'lucide-react'

const companyLinks = [
  { label: 'About', href: '#' },
  { label: 'Contact', href: 'mailto:hello@boostprofits.com' },
]

const legalLinks = [
  { label: 'Privacy', href: '#' },
  { label: 'Terms', href: '#' },
]

const socialLinks = [
  { label: 'Instagram', href: '#', Icon: Instagram },
  { label: 'X / Twitter', href: '#', Icon: Twitter },
  { label: 'Email', href: 'mailto:hello@boostprofits.com', Icon: Mail },
]

export default function Footer() {
  return (
    <footer className="py-16 px-6 lg:px-12 border-t border-warm-border bg-cream">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-start gap-12 lg:gap-0 justify-between mb-12">
          {/* Brand */}
          <div className="max-w-xs">
            <p className="font-serif text-xl font-semibold text-charcoal mb-2">BoostProfits</p>
            <p className="text-sm text-charcoal/45">Copy that earns its place on the page.</p>
          </div>

          {/* Link columns */}
          <div className="flex flex-wrap gap-12 lg:gap-16">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Company
              </p>
              <ul className="space-y-2.5">
                {companyLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-charcoal/55 hover:text-charcoal transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Legal
              </p>
              <ul className="space-y-2.5">
                {legalLinks.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="text-sm text-charcoal/55 hover:text-charcoal transition-colors"
                    >
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] text-charcoal/35 uppercase mb-4">
                Social
              </p>
              <ul className="space-y-2.5">
                {socialLinks.map(({ label, href, Icon }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="flex items-center gap-2 text-sm text-charcoal/55 hover:text-charcoal transition-colors"
                      aria-label={label}
                    >
                      <Icon size={13} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-warm-border pt-8">
          <p className="text-xs text-charcoal/30">© 2026 BoostProfits. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
