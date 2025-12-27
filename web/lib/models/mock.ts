import { AnalysisResult, ModelInput, ModelProvider } from './types';

export class MockProvider implements ModelProvider {
  async analyzeImage(input: ModelInput): Promise<AnalysisResult> {
    console.warn('Using MockProvider for analysis');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const mockResults: AnalysisResult[] = [
      { type: 'normal', score: 98, angle: 5, reason: "脊柱线条流畅，肩部基本等高。", abnormalIndicators: [] },
      { type: 'warning', score: 85, angle: 15, reason: "右肩略高，腰际线轻微不对称。", abnormalIndicators: ["双肩高度差", "腰际线倾斜"] },
      { type: 'danger', score: 60, angle: 35, reason: "明显的脊柱侧弯，Cobb角较大，建议立即就医。", abnormalIndicators: ["双肩高度差", "腰际线倾斜", "骨盆倾斜"] }
    ];
    
    // Random result skewed towards normal/warning
    const random = Math.random();
    const result = random > 0.8 ? mockResults[2] : (random > 0.4 ? mockResults[1] : mockResults[0]);
    
    return result;
  }
}
