'use client'

import { useState, FormEvent } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import CountdownTimer from '@/components/ui/CountdownTimer'
import { ArrowRight, CheckCircle2, Loader2 } from 'lucide-react'

export default function UrgencyCTA() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setStatus('loading')

    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (supabaseUrl && supabaseKey) {
        const res = await fetch(`${supabaseUrl}/rest/v1/leads`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: 'return=minimal',
          },
          body: JSON.stringify({ name, email, source: 'booking_cta' }),
        })
        if (!res.ok) throw new Error('Submission failed')
      }

      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  return (
    <section
      id="booking"
      className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border bg-navy text-white"
    >
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight mb-4">
            Every Day Of Weak Messaging Costs You Buyers.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[18px] text-white/65 leading-relaxed mb-10">
            People decide in seconds online. If your message takes too long to understand, they
            leave.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <p className="text-[11px] font-semibold tracking-[0.15em] text-white/35 uppercase mb-5">
            Next onboarding window closes in:
          </p>
          <CountdownTimer />
        </AnimatedSection>

        <AnimatedSection delay={0.24} className="mt-10">
          {status === 'success' ? (
            <div className="inline-flex flex-col items-center gap-3 py-4">
              <CheckCircle2 size={32} className="text-white/70" />
              <p className="text-lg font-medium">You&apos;re in. We&apos;ll be in touch shortly.</p>
              <p className="text-sm text-white/45">Check your inbox for next steps.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto"
            >
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all min-w-0"
              />
              <input
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/15 text-white placeholder:text-white/35 text-sm focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all min-w-0"
              />
              <button
                type="submit"
                disabled={status === 'loading'}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-navy font-semibold rounded-lg hover:bg-white/90 transition-all disabled:opacity-60 whitespace-nowrap"
              >
                {status === 'loading' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <>
                    Book Free Audit
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>
          )}

          {status === 'error' && (
            <p className="mt-3 text-sm text-white/40">
              Something went wrong — email us at{' '}
              <a href="mailto:hello@boostprofits.com" className="underline">
                hello@boostprofits.com
              </a>
            </p>
          )}

          <p className="mt-4 text-xs text-white/25">
            Limited onboarding spots available each week.
          </p>
        </AnimatedSection>
      </div>
    </section>
  )
}
