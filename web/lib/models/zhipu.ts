import { AnalysisResult, ModelInput, ModelProvider, ChatMessage } from './types';
import { SCOLIOSIS_ANALYSIS_PROMPT } from '@/lib/prompts';

const API_KEY = process.env.ZHIPU_API_KEY || process.env.OPENAI_API_KEY || 'e4827cc596cb4f83b9071f9398a11976.WcY6UKgyAmk8QxmH';
const BASE_URL = 'https://open.bigmodel.cn/api/paas/v4/chat/completions';

export class ZhipuProvider implements ModelProvider {
  private modelName: string;

  constructor(modelName: string = 'glm-4.6v') {
    this.modelName = modelName;
  }

  async chat(messages: ChatMessage[]): Promise<string> {
    if (!API_KEY) {
      throw new Error('API Key is missing');
    }

    try {
      console.log(`Calling Zhipu API Chat (${this.modelName})...`);
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
          model: 'glm-4-plus', // Use a text-optimized model for chat
          messages: messages,
          max_tokens: 2048,
          temperature: 0.7,
        })
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error?.message || `HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error(`ZhipuProvider Chat Error:`, error);
      throw error;
    }
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
    
    // Extract JSON object
    const firstBrace = jsonStr.indexOf('{');
    const lastBrace = jsonStr.lastIndexOf('}');
    
    if (firstBrace !== -1 && lastBrace !== -1) {
      jsonStr = jsonStr.substring(firstBrace, lastBrace + 1);
    }
    
    try {
      const result = JSON.parse(jsonStr);
      // Validate result structure
      if (!result.type || result.score === undefined || result.score === null) {
         throw new Error('Invalid response structure: missing type or score');
      }
      return result;
    } catch (e) {
      console.error('JSON Parse Error:', e);
      
      // Try to repair common JSON errors (e.g. trailing commas)
      try {
        // Simple regex to remove trailing comma before closing brace
        const fixedJson = jsonStr.replace(/,(\s*})/g, '$1');
        const result = JSON.parse(fixedJson);
        if (!result.type || result.score === undefined || result.score === null) {
            throw new Error('Invalid response structure');
        }
        return result;
      } catch (e2) {
        throw new Error('Failed to parse AI response');
      }
    }
  }
}
