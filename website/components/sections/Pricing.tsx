import AnimatedSection from '@/components/ui/AnimatedSection'
import { Check, ArrowRight } from 'lucide-react'

const plans = [
  {
    name: 'Quick Fix',
    price: '$99',
    description: 'A fast, targeted improvement',
    features: [
      'Landing page review',
      'Copy adjustments',
      'Headline rewrites',
      '48-hour turnaround',
    ],
    cta: 'Get a Quick Fix',
    popular: false,
  },
  {
    name: 'Conversion Rewrite',
    price: '$499',
    description: 'Full rewrite, full results',
    features: [
      'Full page rewrite',
      'Offer restructuring',
      'CTA optimization',
      '7-day delivery',
    ],
    cta: 'Start a Full Rewrite',
    popular: true,
  },
  {
    name: 'Full Funnel',
    price: 'Custom',
    description: 'For operators who want the whole system',
    features: [
      'Landing page + emails + DMs',
      'Full positioning system',
      'Ongoing optimization',
      'Priority support',
    ],
    cta: "Let's Talk",
    popular: false,
  },
]

export default function Pricing() {
  return (
    <section
      id="pricing"
      className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-12">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            Simple Pricing. Clear Deliverables.
          </h2>
        </AnimatedSection>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((plan, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div
                className={`rounded-xl border p-6 flex flex-col h-full transition-shadow ${
                  plan.popular
                    ? 'border-navy/25 bg-navy text-white shadow-xl md:-translate-y-3'
                    : 'border-warm-border bg-white'
                }`}
              >
                {plan.popular && (
                  <p className="text-[10px] font-semibold tracking-[0.12em] text-white/50 uppercase mb-4">
                    Most Popular
                  </p>
                )}

                <div className="mb-4">
                  <h3
                    className={`font-serif text-xl font-semibold mb-1 ${
                      plan.popular ? 'text-white' : 'text-charcoal'
                    }`}
                  >
                    {plan.name}
                  </h3>
                  <p
                    className={`text-sm ${
                      plan.popular ? 'text-white/55' : 'text-charcoal/45'
                    }`}
                  >
                    {plan.description}
                  </p>
                </div>

                <p
                  className={`font-serif text-4xl font-semibold tracking-tight mb-6 ${
                    plan.popular ? 'text-white' : 'text-charcoal'
                  }`}
                >
                  {plan.price}
                </p>

                <ul className="space-y-2.5 flex-1 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2.5">
                      <Check
                        size={14}
                        strokeWidth={2.5}
                        className={plan.popular ? 'text-white/60' : 'text-navy/55'}
                      />
                      <span
                        className={`text-[14px] ${
                          plan.popular ? 'text-white/75' : 'text-charcoal/65'
                        }`}
                      >
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <a
                  href="#booking"
                  className={`inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-lg font-medium text-sm transition-all ${
                    plan.popular
                      ? 'bg-white text-navy hover:bg-white/90'
                      : 'bg-navy text-white hover:bg-navy/90 hover:shadow-sm'
                  }`}
                >
                  {plan.cta}
                  <ArrowRight size={14} />
                </a>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
