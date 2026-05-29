import AnimatedSection from '@/components/ui/AnimatedSection'
import { Quote } from 'lucide-react'

const cards = [
  {
    context: 'Landing page hero',
    before: 'We help businesses scale with innovative marketing solutions.',
    after: 'Get more paying customers without increasing your ad spend.',
  },
  {
    context: 'DM opener',
    before: "Hey, hope you're doing well! I wanted to reach out about...",
    after: 'Saw your post on X. One quick thought that might help.',
  },
  {
    context: 'Email subject line',
    before: 'Following up on our previous conversation',
    after: 'The 11-word fix to your checkout page',
  },
]

function BeforeAfterCard({
  context,
  before,
  after,
}: {
  context: string
  before: string
  after: string
}) {
  return (
    <div className="rounded-xl border border-warm-border bg-white p-5 space-y-3 h-full flex flex-col">
      <p className="text-[10px] font-semibold tracking-[0.12em] text-charcoal/35 uppercase">
        {context}
      </p>

      <div className="rounded-lg bg-red-50/40 border border-red-100 p-3">
        <p className="text-[10px] font-semibold tracking-[0.1em] text-red-400/60 uppercase mb-1.5">
          Before
        </p>
        <p className="text-[13px] text-charcoal/45 leading-relaxed">{before}</p>
      </div>

      <div className="flex justify-center">
        <div className="w-5 h-5 rounded-full bg-[#E8E3DA]/80 flex items-center justify-center text-charcoal/30 text-xs">
          ↓
        </div>
      </div>

      <div className="rounded-lg bg-navy/[0.04] border border-navy/10 p-3 flex-1">
        <p className="text-[10px] font-semibold tracking-[0.1em] text-navy/50 uppercase mb-1.5">
          After
        </p>
        <p className="text-[13px] font-semibold text-charcoal leading-relaxed">{after}</p>
      </div>
    </div>
  )
}

export default function Proof() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            Small Changes. Bigger Buying Decisions.
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {cards.map((card, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <BeforeAfterCard {...card} />
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="max-w-xl mx-auto text-center">
          <Quote size={20} className="mx-auto mb-3 text-navy/20" />
          <p className="text-lg text-charcoal/70 italic mb-3">
            &ldquo;The message instantly felt clearer and easier to sell.&rdquo;
          </p>
          <p className="text-sm text-charcoal/35">— James R., SaaS Founder</p>
        </AnimatedSection>
      </div>
    </section>
  )
}
