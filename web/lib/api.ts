import { AnalysisResult, ModelProviderName } from '@/lib/models/types';

export type { AnalysisResult };

/**
 * 调用后端 API 进行图片分析
 * @param imageData 图片的 Base64 数据
 * @param model 模型名称 (可选)
 * @param analysisType 分析类型 'photo' | 'xray' (可选)
 * @returns 分析结果
 */
export async function analyzeImageWithAI(
  imageData: string, 
  model?: ModelProviderName,
  analysisType: 'photo' | 'xray' = 'photo'
): Promise<AnalysisResult> {
    const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageData, model, analysisType })
    });

    if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.error || `HTTP ${response.status}`);
    }

    return await response.json();
}
