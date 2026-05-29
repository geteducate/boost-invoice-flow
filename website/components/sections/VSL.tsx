'use client'

import { useState } from 'react'
import AnimatedSection from '@/components/ui/AnimatedSection'
import { Play } from 'lucide-react'

export default function VSL() {
  const [playing, setPlaying] = useState(false)

  return (
    <section className="py-24 lg:py-32 px-6 lg:px-12 border-t border-warm-border">
      <div className="max-w-3xl mx-auto text-center">
        <AnimatedSection>
          <h2 className="font-serif text-[clamp(1.75rem,4vw,3rem)] font-semibold tracking-tight text-charcoal mb-4">
            Watch This Before You Rewrite Another Word.
          </h2>
        </AnimatedSection>

        <AnimatedSection delay={0.08}>
          <p className="text-[17px] text-charcoal/60 leading-relaxed mb-10 max-w-xl mx-auto">
            In the next 7 minutes, you&apos;ll see why most offers fail, what makes people decide
            faster, and how small wording shifts change buying behavior.
          </p>
        </AnimatedSection>

        <AnimatedSection delay={0.16}>
          <div className="relative rounded-xl overflow-hidden border border-warm-border shadow-md aspect-video mb-8 bg-navy/[0.04]">
            {!playing ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                <button
                  onClick={() => setPlaying(true)}
                  className="w-16 h-16 rounded-full bg-navy text-white flex items-center justify-center hover:scale-105 transition-transform shadow-lg"
                  aria-label="Play video"
                >
                  <Play size={22} fill="white" className="ml-1" />
                </button>
                <p className="text-sm text-charcoal/35">Why Most Offers Fail — 7 min</p>
              </div>
            ) : (
              /* Replace /video/explainer.mp4 with your actual video source */
              <video
                className="w-full h-full object-cover"
                controls
                controlsList="nodownload nofullscreen noremoteplayback"
                autoPlay
                playsInline
                onContextMenu={(e) => e.preventDefault()}
                aria-label="BoostProfits explainer video"
              >
                <source src="/video/explainer.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </div>
        </AnimatedSection>

        <AnimatedSection delay={0.24}>
          <a
            href="#booking"
            className="inline-flex items-center px-6 py-3 bg-navy text-white font-medium rounded-lg hover:bg-navy/90 transition-all hover:shadow-sm"
          >
            Book Your Audit
          </a>
        </AnimatedSection>
      </div>
    </section>
  )
}
