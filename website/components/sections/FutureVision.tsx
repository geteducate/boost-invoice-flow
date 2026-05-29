import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check } from 'lucide-react'

const outcomes = [
  'Cleaner positioning — one clear idea that sticks',
  'Faster trust — people get it before they have to think',
  'Stronger responses — more replies, more DMs, more action',
  'Smoother conversions — less friction between interest and purchase',
]

export default function FutureVision() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            Imagine If Your Offer Finally Made Sense In Seconds.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            No long explanations. No confused prospects. No losing buyers because the message was
            weak.
          </p>
        </AnimatedSection>

        <div className="space-y-3.5 mb-14">
          {outcomes.map((outcome, i) => (
            <AnimatedSection key={i} delay={0.12 + i * 0.08}>
              <div className="flex items-center gap-3.5">
                <div className="flex-shrink-0 w-5 h-5 rounded-full bg-navy/10 flex items-center justify-center">
                  <Check size={11} className="text-navy" strokeWidth={2.5} />
                </div>
                <p className="text-[17px] text-charcoal/75">{outcome}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection delay={0.48}>
          <p className="font-serif text-[19px] font-medium text-charcoal italic border-l-2 border-navy/20 pl-5">
            When people understand faster, they move faster.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
