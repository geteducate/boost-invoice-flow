import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ArrowLeft, ArrowRight, BadgeCheck, Star } from "lucide-react";

export type Testimonial = {
  q: string;
  n: string;
  r: string;
  org: string;
  sector: string;
  metric: { v: string; l: string };
  logo: string;
  img: string; // photo URL — proof
};

const Stars = () => (
  <div className="flex gap-0.5" style={{ color: "var(--primary-glow)" }}>
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className="h-3.5 w-3.5 fill-current" />
    ))}
  </div>
);

export function TestimonialsCarousel({ items }: { items: Testimonial[] }) {
  const [emblaRef, embla] = useEmblaCarousel(
    { loop: true, align: "start", dragFree: false, containScroll: "trimSnaps" },
    [Autoplay({ delay: 5500, stopOnInteraction: true, stopOnMouseEnter: true })],
  );
  const [selected, setSelected] = useState(0);
  const [snaps, setSnaps] = useState<number[]>([]);

  const scrollTo = useCallback((i: number) => embla?.scrollTo(i), [embla]);
  const prev = useCallback(() => embla?.scrollPrev(), [embla]);
  const next = useCallback(() => embla?.scrollNext(), [embla]);

  useEffect(() => {
    if (!embla) return;
    setSnaps(embla.scrollSnapList());
    const onSelect = () => setSelected(embla.selectedScrollSnap());
    onSelect();
    embla.on("select", onSelect);
    embla.on("reInit", onSelect);
  }, [embla]);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Customer testimonials"
      className="relative"
    >
      <div ref={emblaRef} className="overflow-hidden">
        <div className="flex -ml-4">
          {items.map((t, i) => (
            <article
              key={t.n}
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${items.length}`}
              className="min-w-0 shrink-0 grow-0 basis-full pl-4 sm:basis-[85%] md:basis-1/2 lg:basis-1/2"
            >
              <figure className="card-premium relative h-full overflow-hidden p-6 md:p-7">
                <div
                  aria-hidden
                  className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gradient-to-br from-[var(--primary-glow)]/20 to-transparent blur-2xl"
                />
                <div className="relative flex items-center justify-between">
                  <Stars />
                  <span className="rounded-md border border-border bg-background/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
                    {t.logo}
                  </span>
                </div>
                <blockquote className="relative mt-5 font-serif text-[17px] leading-relaxed text-foreground/90 md:text-lg">
                  “{t.q}”
                </blockquote>
                <figcaption className="relative mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-border/70 pt-5">
                  <div className="flex items-center gap-3">
                    <img
                      src={t.img}
                      alt={`${t.n}, ${t.r} at ${t.org}`}
                      loading="lazy"
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-background shadow-elegant"
                    />
                    <span className="text-sm">
                      <span className="flex items-center gap-1.5 font-semibold text-foreground">
                        {t.n}
                        <BadgeCheck className="h-3.5 w-3.5 text-success" aria-label="Verified" />
                      </span>
                      <span className="text-muted-foreground">
                        {t.r} · {t.org}
                      </span>
                      <span className="mt-0.5 block text-[11px] uppercase tracking-wider text-muted-foreground/80">
                        {t.sector}
                      </span>
                    </span>
                  </div>
                  <div className="rounded-lg border border-border bg-muted/40 px-3.5 py-2">
                    <p className="text-xl font-extrabold tracking-tight text-foreground">
                      {t.metric.v}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {t.metric.l}
                    </p>
                  </div>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-1.5" role="tablist" aria-label="Select testimonial">
          {snaps.map((_, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={selected === i}
              aria-label={`Go to testimonial ${i + 1}`}
              onClick={() => scrollTo(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                selected === i
                  ? "w-8 bg-[var(--primary-glow)]"
                  : "w-3 bg-border hover:bg-muted-foreground/40"
              }`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground shadow-elegant transition-all hover:-translate-y-0.5 hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="ring-focus inline-flex h-10 w-10 items-center justify-center rounded-full bg-cta text-primary-foreground shadow-elegant transition-all hover:-translate-y-0.5"
          >
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
