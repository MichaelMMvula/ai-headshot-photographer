import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  q: string;
  a: string;
}

const FAQS: FAQItem[] = [
  {
    q: 'How does Lumina preserve my facial features and recognizable identity?',
    a: 'Our generative photography pipeline processes your uploaded selfie as a facial identity reference. It preserves key anatomical markers—eye shape, facial symmetry, skin undertones, and smiles—while replacing casual shirts with tailored business suits, refining hair styling, and recreating the lighting using virtual 85mm studio prime lenses.',
  },
  {
    q: 'What kind of selfie produces the best professional headshot?',
    a: 'A front-facing photo captured in natural daylight or bright indoor light with your face looking directly into the camera. Avoid heavy sunglasses, hats, extreme downward angles, or heavy blur. Even a basic everyday smartphone photo taken against a bedroom or office wall works great.',
  },
  {
    q: 'Can I use these headshots on LinkedIn, company websites, and press materials?',
    a: 'Yes, absolutely. All generated headshots are high-resolution, commercial-grade images suitable for LinkedIn avatars, executive team bios, company pitch decks, resumes, speaking engagements, and press releases.',
  },
  {
    q: 'Can I request specific changes like different wardrobe or background adjustments?',
    a: 'Yes! After generating a headshot, use the built-in AI Retouch Bar to request adjustments in natural language—for example, "Change jacket to navy blue", "Make the smile a bit warmer", or "Darken the background for more contrast".',
  },
  {
    q: 'Which style should I choose for my career field?',
    a: 'For law, finance, banking, or traditional corporate boards, Corporate Grey Backdrop is the gold standard. For software engineering, founders, and venture-backed startups, Modern Tech Office provides vibrant ambient warmth. For consultants, coaches, creatives, and authors, Outdoor Natural Light offers approachable elegance.',
  },
];

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-16 border-b border-slate-850" id="faq">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Everything You Need to Know
          </h2>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-800 bg-slate-900/50 overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-850/60 transition-colors"
                >
                  <span className="text-sm font-semibold text-white">{faq.q}</span>
                  <span className="text-slate-400 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
