import AnimatedSection from '@/components/ui/AnimatedSection'
import { MessageSquareOff, TrendingDown, Eye, HelpCircle } from 'lucide-react'

const painPoints = [
  {
    Icon: MessageSquareOff,
    label: 'Weak messaging that loses buyers before they decide',
  },
  {
    Icon: TrendingDown,
    label: 'Low response rates on DMs, ads, and cold outreach',
  },
  {
    Icon: Eye,
    label: 'Attention without sales — traffic that never converts',
  },
  {
    Icon: HelpCircle,
    label: 'An unclear offer that confuses instead of convincing',
  },
]

export default function Problem() {
  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40">
      <div className="max-w-3xl mx-auto">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-6">
            Most Businesses Don&apos;t Have a Traffic Problem. They Have a Clarity Problem.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-charcoal/65 leading-relaxed mb-12">
            People are already seeing your offer. But they don&apos;t fully understand it. They
            don&apos;t trust it fast enough. Or they lose interest before taking action. That gap
            costs attention, replies, and sales — every single day.
          </p>
        </AnimatedSection>

        <div className="space-y-3">
          {painPoints.map(({ Icon, label }, i) => (
            <AnimatedSection key={i} delay={0.12 + i * 0.08}>
              <div className="flex items-start gap-4 p-4 rounded-xl border border-warm-border bg-white/70">
                <div className="mt-0.5 flex-shrink-0 w-8 h-8 rounded-lg bg-navy/5 flex items-center justify-center">
                  <Icon size={15} className="text-navy/45" />
                </div>
                <p className="text-[16px] text-charcoal/70 leading-snug pt-1">{label}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
