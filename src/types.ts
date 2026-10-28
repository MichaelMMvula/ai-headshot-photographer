export interface HeadshotStyle {
  id: string;
  name: string;
  tagline: string;
  description: string;
  previewImage: string;
  lightingType: string;
  wardrobeVibe: string;
  recommendedFor: string;
  features: string[];
}

export interface CustomizationOptions {
  wardrobe: string;
  lighting: string;
  expression: string;
  aspectRatio: '1:1' | '3:4' | '4:5' | '16:9';
  customPrompt: string;
}

export interface GeneratedHeadshot {
  id: string;
  imageUrl: string;
  originalSelfieUrl: string;
  styleId: string;
  styleName: string;
  wardrobe: string;
  lighting: string;
  expression: string;
  aspectRatio: string;
  createdAt: number;
  promptNotes?: string;
}
