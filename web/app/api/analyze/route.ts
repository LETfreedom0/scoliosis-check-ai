import { NextResponse } from 'next/server';
import { ModelFactory } from '@/lib/models/factory';
import { ModelProviderName } from '@/lib/models/types';
import { SCOLIOSIS_ANALYSIS_PROMPT, SCOLIOSIS_XRAY_ANALYSIS_PROMPT } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const { imageData, model = 'glm-4.6v', analysisType = 'photo' } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: 'Image data is required' },
        { status: 400 }
      );
    }

    const providerName: ModelProviderName = model as ModelProviderName;
    const provider = ModelFactory.create(providerName);
    
    const prompt = analysisType === 'xray' ? SCOLIOSIS_XRAY_ANALYSIS_PROMPT : SCOLIOSIS_ANALYSIS_PROMPT;

    console.log(`Starting analysis with model: ${providerName}, type: ${analysisType}`);

    try {
      const result = await provider.analyzeImage({
        imageData,
        prompt: prompt
      });
      
      // Inject analysisType into the result
      result.analysisType = analysisType;

      console.log('Analysis completed successfully');
      return NextResponse.json(result);
    } catch (err: any) {
       console.error('Model Analysis Error:', err);
       return NextResponse.json(
        { error: err.message || 'Model Analysis Failed' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Server Error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
