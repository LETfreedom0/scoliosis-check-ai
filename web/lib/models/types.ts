export interface AnalysisResult {
  type: 'normal' | 'warning' | 'danger' | 'invalid';
  score: number;
  angle?: number;
  reason?: string;
  abnormalIndicators?: string[];
  analysisType?: 'photo' | 'xray';
}

export interface HistoryRecord {
  id: string;
  date: string;
  result: AnalysisResult;
  imageData: string; // Base64 or URL
  userEmail?: string; // Optional, to link to a user
}

export interface ModelInput {
  imageData: string;
  prompt?: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ModelProvider {
  analyzeImage(input: ModelInput): Promise<AnalysisResult>;
  chat(messages: ChatMessage[]): Promise<string>;
}

export type ModelProviderName = 'glm-4.6v' | 'glm-4.5v' | 'mock';
