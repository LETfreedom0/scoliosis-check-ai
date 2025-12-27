import { ModelProvider, ModelProviderName } from './types';
import { ZhipuProvider } from './zhipu';
import { MockProvider } from './mock';

export class ModelFactory {
  static create(name: ModelProviderName = 'glm-4.6v'): ModelProvider {
    switch (name) {
      case 'glm-4.6v':
        return new ZhipuProvider('glm-4.6v');
      case 'glm-4.5v':
        return new ZhipuProvider('glm-4.5v');
      case 'mock':
        return new MockProvider();
      default:
        console.warn(`Unknown model ${name}, falling back to glm-4.6v`);
        return new ZhipuProvider('glm-4.6v');
    }
  }
}
