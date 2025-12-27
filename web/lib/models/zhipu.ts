import { AnalysisResult, ModelInput, ModelProvider } from './types';
import { SCOLIOSIS_ANALYSIS_PROMPT } from '@/lib/prompts';

const API_KEY = process.env.ZHIPU_API_KEY || process.env.OPENAI_API_KEY || 'e4827cc596cb4f83b9071f9398a11976.WcY6UKgyAmk8QxmH';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export class ZhipuProvider implements ModelProvider {
  private modelName: string;

  constructor(modelName: string = 'glm-4.6v') {
    this.modelName = modelName;
  }

  async analyzeImage(input: ModelInput): Promise<AnalysisResult> {
    const { imageData } = input;
    const prompt = input.prompt || SCOLIOSIS_ANALYSIS_PROMPT;

    if (!API_KEY) {
      throw new Error('API Key is missing');
    }

    try {
      console.log(`Calling Zhipu API (${this.modelName})...`);
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: this.modelName,
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: prompt },
                { type: "image_url", image_url: { url: imageData } }
              ]
            }
          ],
          max_tokens: 1024, // Increased for detailed analysis
          temperature: 0.1, // Low temperature for consistent results
        })
      });

      console.log(`Zhipu API response status: ${response.status}`);

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;

      return this.parseResponse(content);
    } catch (error) {
      console.error(`ZhipuProvider (${this.modelName}) Error:`, error);
      throw error;
    }
  }

  private parseResponse(content: string): AnalysisResult {
    console.log('AI Response Content:', content);
    
    // Clean up markdown code blocks
    let jsonStr = content.replace(/```json/g, '').replace(/```/g, '').trim();
    
    // Extract JSON object if there's extra text
    const jsonMatch = jsonStr.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      jsonStr = jsonMatch[0];
    }
    
    try {
      const result = JSON.parse(jsonStr);
      // Validate result structure
      if (!result.type || !result.score) {
         throw new Error('Invalid response structure');
      }
      return result;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      throw new Error('Failed to parse AI response');
    }
  }
}
