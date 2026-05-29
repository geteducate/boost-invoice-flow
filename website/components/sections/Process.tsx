import AnimatedSection from '@/components/ui/AnimatedSection'

const steps = [
  {
    number: '01',
    title: 'Audit',
    description: 'We break down your current messaging, offer, and conversion weak points.',
  },
  {
    number: '02',
    title: 'Rewrite',
    description: 'Your copy is rebuilt for clarity, trust, and action.',
  },
  {
    number: '03',
    title: 'Optimize',
    description:
      'The structure is refined so people consume the message with less friction.',
  },
  {
    number: '04',
    title: 'Convert',
    description: 'Better comprehension creates stronger buying decisions.',
  },
]

export default function Process() {
  return (
    <section
      id="process"
      className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-[#F5F1EB]/40"
    >
      <div className="max-w-6xl mx-auto">
        <AnimatedSection className="text-center mb-16">
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal">
            How It Works
          </h2>
        </AnimatedSection>

        {/* Desktop horizontal timeline */}
        <div className="hidden lg:grid lg:grid-cols-4 gap-8 relative">
          <div
            className="absolute top-8 left-[12.5%] right-[12.5%] h-px bg-warm-border"
            aria-hidden="true"
          />
          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.1}>
              <div className="flex flex-col items-center text-center">
                <div className="relative z-10 w-16 h-16 rounded-full border border-warm-border bg-cream flex items-center justify-center mb-6">
                  <span className="font-serif text-lg font-semibold text-navy">
                    {step.number}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-charcoal mb-2">
                  {step.title}
                </h3>
                <p className="text-[14px] text-charcoal/55 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Mobile vertical timeline */}
        <div className="lg:hidden">
          {steps.map((step, i) => (
            <AnimatedSection key={i} delay={i * 0.08}>
              <div className="flex gap-5">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full border border-warm-border bg-cream flex items-center justify-center flex-shrink-0">
                    <span className="font-serif text-sm font-semibold text-navy">
                      {step.number}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="flex-1 w-px bg-warm-border mt-2" style={{ minHeight: 40 }} />
                  )}
                </div>
                <div className="pt-2 pb-10">
                  <h3 className="font-serif text-lg font-semibold text-charcoal mb-1">
                    {step.title}
                  </h3>
                  <p className="text-[14px] text-charcoal/55 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  )
}
