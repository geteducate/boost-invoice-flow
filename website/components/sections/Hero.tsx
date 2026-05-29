'use client'

import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const fadeUp = (delay: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] as const },
})

export default function Hero() {
  return (
    <section className="pt-32 pb-24 lg:pt-40 lg:pb-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        {/* Copy */}
        <div>
          <motion.p
            {...fadeUp(0)}
            className="text-[10px] font-medium tracking-widest text-navy/50 uppercase mb-6"
          >
            For founders, coaches, and operators who get views but not sales
          </motion.p>

          <motion.h1
            {...fadeUp(0.08)}
            className="font-serif text-[clamp(2.5rem,5vw,4.5rem)] font-semibold leading-[1.05] tracking-tight text-charcoal mb-6"
          >
            Turn Attention Into Paying Customers.
          </motion.h1>

          <motion.p
            {...fadeUp(0.16)}
            className="text-[18px] text-charcoal/65 leading-relaxed mb-8 max-w-lg"
          >
            Sharper copy. Cleaner offers. Faster buying decisions. Built for
            businesses tired of getting views without conversions.
          </motion.p>

          <motion.div
            {...fadeUp(0.24)}
            className="flex flex-wrap items-center gap-4 mb-8"
          >
            <a
              href="#booking"
              className="inline-flex items-center px-6 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-colors hover:shadow-sm"
            >
              Book a Free Audit
            </a>
            <a
              href="#process"
              className="inline-flex items-center gap-2 text-charcoal/65 hover:text-charcoal transition-colors font-medium"
            >
              See How It Works
              <ArrowRight size={15} />
            </a>
          </motion.div>

          <motion.p
            {...fadeUp(0.32)}
            className="text-xs text-charcoal/35"
          >
            Used for landing pages, offers, DMs, ads, and customer conversion systems.
          </motion.p>
        </div>

        {/* Browser mockup */}
        <motion.div {...fadeUp(0.2)} className="hidden lg:block">
          <BrowserMockup />
        </motion.div>
      </div>
    </section>
  )
}

function BrowserMockup() {
  return (
    <div className="rounded-xl border border-warm-border bg-white shadow-lg overflow-hidden">
      {/* Chrome bar */}
      <div className="bg-[#F0EDE8] border-b border-warm-border px-4 py-3 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#E8E3DA]" />
          <div className="w-3 h-3 rounded-full bg-[#E8E3DA]" />
          <div className="w-3 h-3 rounded-full bg-[#E8E3DA]" />
        </div>
        <div className="flex-1 bg-[#E8E3DA]/60 rounded px-3 py-1 text-xs text-charcoal/35 truncate">
          yourlandingpage.com
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-4">
        <div className="rounded-lg border border-red-100 bg-red-50/40 p-4">
          <p className="text-[10px] font-medium tracking-widest text-red-400/60 uppercase mb-2">
            Before
          </p>
          <p className="text-sm text-charcoal/45 line-through leading-relaxed">
            We help businesses scale with innovative marketing solutions tailored
            to your unique needs.
          </p>
        </div>

        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-1">
            <div className="w-px h-3 bg-warm-border" />
            <div className="w-4 h-4 rounded-full bg-navy flex items-center justify-center">
              <ArrowRight size={9} className="text-white" />
            </div>
            <div className="w-px h-3 bg-warm-border" />
          </div>
        </div>

        <div className="rounded-lg border border-navy/10 bg-navy/[0.04] p-4">
          <p className="text-[10px] font-medium tracking-widest text-navy/45 uppercase mb-2">
            After
          </p>
          <p className="text-sm font-medium text-charcoal leading-relaxed">
            Get more paying customers without increasing your ad spend.
          </p>
        </div>

        <div className="pt-1">
          <div className="w-full bg-navy rounded-lg py-2.5 text-center text-xs text-white font-medium">
            Book a Free Audit →
          </div>
        </div>
      </div>
    </div>
  )
}
