import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// High payload limit for image base64 uploads
app.use(express.json({ limit: '25mb' }));

// Server-side GoogleGenAI client with required User-Agent
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Style definitions with expert photography prompt expansions
const STYLE_PROMPTS: Record<string, { title: string; prompt: string }> = {
  'corporate-grey': {
    title: 'Corporate Grey Backdrop',
    prompt:
      'High-end corporate executive headshot photograph. Transform the person in the reference photo into a polished, professional business leader. Retain their facial identity, core facial structure, skin tone, gender, and recognizable appearance. Replace casual clothing with tailored premium business attire (fitted navy or charcoal wool blazer/suit jacket with crisp white or light blue dress shirt/blouse). Studio lighting setup with soft key light, gentle hair rim light, and neutral fill. Clean, textured studio slate-grey backdrop with subtle vignette. Shot on 85mm f/2.0 portrait lens, sharp focus on eyes, natural skin texture, commercial publication quality.',
  },
  'tech-office': {
    title: 'Modern Tech Office',
    prompt:
      'Contemporary tech founder and modern executive professional headshot. Transform the subject while preserving their distinct facial features, facial identity, eye shape, and smile. Dressed in elevated smart-casual executive wardrobe (unstructured dark blazer over a high-quality knit crewneck or modern collar). Bright architectural glass office interior with soft blurred background bokeh showing sunlit workstations and plants. Warm natural daylight balanced with soft studio fill. Approachable, confident, innovative energy. 50mm f/1.8 documentary portrait aesthetic.',
  },
  'outdoor-natural': {
    title: 'Outdoor Natural Light',
    prompt:
      'Warm natural light professional headshot. Retain the exact facial likeness, contours, and identity of the subject from the reference image. Dressed in stylish, approachable business casual attire (tailored sports coat, trench, or refined knitwear). Background is a lush outdoor park setting during golden hour, with dappled afternoon sunlight filtering through tree leaves with creamy circular bokeh. Radiant, authentic skin tones, warm engaging expression, sharp eye clarity, 85mm f/1.4 prime lens photography.',
  },
  'executive-boardroom': {
    title: 'Executive Boardroom',
    prompt:
      'Prestigious Fortune 500 C-suite executive headshot. Retain the facial likeness, age, and identity of the person in the image. Dressed in bespoke dark formal corporate suit or executive pantsuit with clean lapels and immaculate styling. Background features an expansive high-floor glass boardroom with softly blurred panoramic city skyline views and warm mahogany accents. Subtle cinematic edge lighting, commanding yet approachable presence.',
  },
  'studio-minimalist': {
    title: 'Creative Studio Minimalist',
    prompt:
      'Editorial creative director portrait. Retain the authentic facial likeness and character of the subject. Styled in understated minimalist creative attire (architectural black turtleneck or structured monochrome jacket). Pure warm off-white studio cyclorama background with gentle side window lighting, delicate directional shadow, and rich tonal grading. High-fashion magazine editorial aesthetic, crisp detail.',
  },
};

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: !!process.env.GEMINI_API_KEY,
    availableStyles: Object.keys(STYLE_PROMPTS),
  });
});

// Helper to extract clean base64 data & mime type
function parseImageData(rawImage: string): { mimeType: string; data: string } {
  if (rawImage.startsWith('data:')) {
    const matches = rawImage.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      return { mimeType: matches[1], data: matches[2] };
    }
  }
  // Assume jpeg if raw base64 string
  return { mimeType: 'image/jpeg', data: rawImage };
}

// Generate professional headshot from selfie + style
app.post('/api/generate-headshot', async (req, res) => {
  try {
    const {
      imageBase64,
      styleId = 'corporate-grey',
      wardrobe,
      lighting,
      expression,
      customPrompt,
      aspectRatio = '1:1',
      model = 'gemini-nano-banana-2.1',
    } = req.body;

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: 'GEMINI_API_KEY is not configured on the server. Please check your environment configuration.',
      });
    }

    const selectedStyle = STYLE_PROMPTS[styleId] || STYLE_PROMPTS['corporate-grey'];

    // Construct high-fidelity photography prompt
    let promptText = selectedStyle.prompt;

    if (wardrobe) {
      promptText += ` Specific wardrobe styling: ${wardrobe}.`;
    }
    if (lighting) {
      promptText += ` Specific lighting style: ${lighting}.`;
    }
    if (expression) {
      promptText += ` Subject expression: ${expression}.`;
    }
    if (customPrompt) {
      promptText += ` Additional artistic direction: ${customPrompt}.`;
    }

    promptText +=
      ' Strictly ensure the headshot looks realistic, professional, in sharp focus, without distorted hands, unnatural skin smoothing, or artificial artifacts.';

    const parts: any[] = [];

    if (imageBase64) {
      const { mimeType, data } = parseImageData(imageBase64);
      parts.push({
        inlineData: {
          mimeType,
          data,
        },
      });
      parts.push({
        text: `You are an expert commercial portrait photographer. Transform the person in the provided input selfie into a master-grade professional headshot matching these specifications: ${promptText}. Maintain the person's unique facial features and authentic likeness while dramatically elevating hair styling, professional wardrobe, studio lighting, and background.`,
      });
    } else {
      // Creation without reference image
      parts.push({
        text: `Master-grade professional portrait headshot photography: ${promptText}`,
      });
    }

    // Call Gemini Image model
    const response = await ai.models.generateContent({
      model,
      contents: {
        parts,
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: '1K',
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let textDescription = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textDescription += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: 'No image was returned from the generative model. The model returned: ' + (textDescription || 'Empty response'),
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      style: selectedStyle.title,
      description: textDescription || 'Professional headshot generated successfully.',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error('Error in /api/generate-headshot:', err);
    res.status(500).json({
      error: err.message || 'Failed to generate professional headshot.',
    });
  }
});

// Refine/edit generated headshot with conversational prompt instruction
app.post('/api/refine-headshot', async (req, res) => {
  try {
    const { imageBase64, instruction, aspectRatio = '1:1', model = 'gemini-nano-banana-2.1' } = req.body;

    if (!imageBase64 || !instruction) {
      return res.status(400).json({ error: 'Both imageBase64 and instruction are required.' });
    }

    const { mimeType, data } = parseImageData(imageBase64);

    const response = await ai.models.generateContent({
      model,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType,
              data,
            },
          },
          {
            text: `You are an expert digital photo retoucher and commercial portrait photographer. Apply the following refinement to this professional headshot while preserving the overall composition and subject likeness: ${instruction}. Keep the image sharp, ultra-realistic, and professional.`,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
          imageSize: '1K',
        },
      },
    });

    let generatedImageUrl: string | null = null;
    let textDescription = '';

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          const mime = part.inlineData.mimeType || 'image/png';
          generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
        } else if (part.text) {
          textDescription += part.text;
        }
      }
    }

    if (!generatedImageUrl) {
      return res.status(502).json({
        error: 'Refinement model did not return an image: ' + (textDescription || 'Empty response'),
      });
    }

    res.json({
      success: true,
      imageUrl: generatedImageUrl,
      description: textDescription || 'Headshot refined successfully.',
      timestamp: Date.now(),
    });
  } catch (err: any) {
    console.error('Error in /api/refine-headshot:', err);
    res.status(500).json({
      error: err.message || 'Failed to refine headshot.',
    });
  }
});

// Dev server / production static handling
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, () => {
    console.log(`Lumina AI Headshot Studio server running on port ${port}`);
  });
}

startServer();
