import { HeadshotStyle } from '../types';

export const SAMPLE_SELFIE_URL = '/src/assets/images/sample_casual_selfie_1793188802254.jpg';
export const HERO_SHOWCASE_URL = '/src/assets/images/hero_headshot_showcase_1793188800597.jpg';

export const HEADSHOT_STYLES: HeadshotStyle[] = [
  {
    id: 'corporate-grey',
    name: 'Corporate Grey Backdrop',
    tagline: 'Timeless studio elegance for executive presence',
    description:
      'Classic neutral slate grey textured backdrop with three-point studio lighting, tailored suit or blazer, and sharp portrait contrast ideal for corporate profiles and boards.',
    previewImage: '/src/assets/images/style_corporate_grey_1793188801210.jpg',
    lightingType: 'Three-Point Studio Key & Rim',
    wardrobeVibe: 'Tailored Navy / Charcoal Suit',
    recommendedFor: 'LinkedIn, Executive Bios, Law & Finance',
    features: ['Slate textured backdrop', 'Crisp business suit', 'Even facial illumination', '85mm portrait compression'],
  },
  {
    id: 'tech-office',
    name: 'Modern Tech Office',
    tagline: 'Vibrant architectural environment with ambient warmth',
    description:
      'Contemporary sunlit open-plan architectural glass office setting with creamy interior background bokeh, smart casual blazer styling, and engaging tech founder charisma.',
    previewImage: '/src/assets/images/style_tech_office_1793188803047.jpg',
    lightingType: 'Sunlit Architectural Ambient + Soft Fill',
    wardrobeVibe: 'Smart Casual Blazer & Elevated Knit',
    recommendedFor: 'Tech Founders, Product Leaders, Startups',
    features: ['Modern glass office bokeh', 'Smart casual wardrobe', 'Warm natural daylight', 'Approachable confidence'],
  },
  {
    id: 'outdoor-natural',
    name: 'Outdoor Natural Light',
    tagline: 'Warm golden hour portrait with creamy organic bokeh',
    description:
      'Approachable executive headshot captured in a lush natural park setting with warm golden sunlight filtering softly through tree leaves, producing radiant natural skin tones.',
    previewImage: '/src/assets/images/style_outdoor_natural_1793188802006.jpg',
    lightingType: 'Golden Hour Dappled Natural Sunlight',
    wardrobeVibe: 'Modern Sports Coat or Refined Knitwear',
    recommendedFor: 'Consultants, Creatives, Public Speakers',
    features: ['Lush park bokeh', 'Warm golden illumination', 'Authentic radiant skin', 'Friendly executive tone'],
  },
  {
    id: 'executive-boardroom',
    name: 'Executive Boardroom',
    tagline: 'High-floor panoramic skyline leadership aesthetic',
    description:
      'Sophisticated high-rise executive boardroom with subtle panoramic metropolitan cityscape backdrop through floor-to-ceiling glass windows, bespoke formal attire, and cinematic rim light.',
    previewImage: '/src/assets/images/hero_headshot_showcase_1793188800597.jpg',
    lightingType: 'Cinematic Edge & Architectural Rim',
    wardrobeVibe: 'Bespoke Executive Suit or Pantsuit',
    recommendedFor: 'CEOs, VPs, Venture Capitalists',
    features: ['Panoramic skyline backdrop', 'Precision lapels & fabric', 'Cinematic depth', 'Commanding authority'],
  },
  {
    id: 'studio-minimalist',
    name: 'Creative Studio Minimalist',
    tagline: 'High-contrast editorial warmth and artistic finesse',
    description:
      'Warm off-white cyclorama studio backdrop with artistic directional soft light, subtle shadows, and contemporary designer wardrobe for creative professionals and authors.',
    previewImage: '/src/assets/images/hero_headshot_showcase_1793188800597.jpg',
    lightingType: 'Directional Window Softbox & Deep Shadows',
    wardrobeVibe: 'Architectural Turtleneck or Structured Jacket',
    recommendedFor: 'Designers, Authors, Architects & Directors',
    features: ['Cyclorama warm backdrop', 'Monochrome wardrobe', 'Sculptural lighting', 'Editorial magazine tone'],
  },
];

export const WARDROBE_PRESETS = [
  'Dark Navy Wool Suit with White Dress Shirt',
  'Charcoal Tailored Suit with Light Blue Shirt',
  'Modern Unstructured Blazer with Dark Crewneck',
  'Executive Black Pantsuit with Silk Blouse',
  'Minimalist Black Cashmere Turtleneck',
  'Smart Casual Oxford Shirt with Tweed Sports Coat',
];

export const LIGHTING_PRESETS = [
  'Rembrandt Studio Lighting (Classic Key & Triangle Shadow)',
  'Soft Commercial Beauty Dish (Flattering Even Skin Tone)',
  'Golden Hour Window Daylight (Warm Natural Glow)',
  'Dramatic High-Contrast Rim Light (Crisp Executive Edge)',
];

export const EXPRESSION_PRESETS = [
  'Warm & Approachable Smile (Friendly & Trustworthy)',
  'Confident & Poised (Direct Eye Contact, Gentle Smile)',
  'Authoritative & Serious (Deep Focus, Determined)',
];

export const ASPECT_RATIOS: Array<{ id: '1:1' | '3:4' | '4:5' | '16:9'; label: string; sub: string }> = [
  { id: '1:1', label: '1:1 Square', sub: 'LinkedIn & Social Avatar' },
  { id: '4:5', label: '4:5 Portrait', sub: 'Company Team Page' },
  { id: '3:4', label: '3:4 Editorial', sub: 'Resume & Press Release' },
];
