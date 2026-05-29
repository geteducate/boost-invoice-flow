'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    q: 'I already run ads. Why do I need this?',
    a: "Good ads fail with weak messaging. The click is only half the job. If people land on your page and don't immediately understand what you're offering — or why they should care — they leave. Better copy turns existing traffic into actual buyers.",
  },
  {
    q: 'My business is different.',
    a: "Clear communication works in every market. Specifics change. Principles don't. Whether you sell software, services, or physical products, the fundamental rules of comprehension and trust are the same.",
  },
  {
    q: "Can't I just do this myself?",
    a: "You can. Most owners don't have the time or outside perspective to see what's costing them sales. It's hard to read the label from inside the jar.",
  },
  {
    q: 'How long does it take?',
    a: "Most rewrites ship in 7 days. Audits in 48 hours. If you need it faster, reach out and we'll see what we can do.",
  },
  {
    q: "What if it doesn't work?",
    a: "If the first round doesn't move the needle, we rework it free. No questions, no drama.",
  },
]

export default function FAQ() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-2xl mx-auto">
        <AnimatedSection className="mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            Common Questions.
          </h2>
        </AnimatedSection>

        <div className="divide-y divide-warm-border">
          {faqs.map((faq, i) => (
            <AnimatedSection key={i} delay={i * 0.06}>
              <div>
                <button
                  className="w-full flex items-center justify-between py-5 text-left group"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="text-[16px] font-medium text-charcoal pr-6 group-hover:text-navy transition-colors">
                    {faq.q}
                  </span>
                  <span className="flex-shrink-0 text-charcoal/35">
                    {open === i ? <Minus size={17} /> : <Plus size={17} />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-[15px] text-charcoal/60 leading-relaxed">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
