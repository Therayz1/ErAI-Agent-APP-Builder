import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GeminiProvider, ModelInfo } from '~/lib/gemini/provider';
import { OpenRouterProvider } from '~/lib/openrouter/provider';

interface ModelState {
  // API Keys
  geminiApiKey: string;
  openRouterApiKey: string;
  
  // Selected model
  selectedModel: string;
  selectedProvider: 'gemini' | 'openrouter';
  
  // Available models
  geminiModels: ModelInfo[];
  openRouterModels: ModelInfo[];
  allModels: ModelInfo[];
  
  // Loading states
  isLoadingModels: boolean;
  
  // Actions
  setGeminiApiKey: (key: string) => void;
  setOpenRouterApiKey: (key: string) => void;
  setSelectedModel: (model: string, provider: 'gemini' | 'openrouter') => void;
  setGeminiModels: (models: ModelInfo[]) => void;
  setOpenRouterModels: (models: ModelInfo[]) => void;
  fetchOpenRouterModels: () => Promise<void>;
  
  // Utility
  isConfigured: () => boolean;
  getSelectedModelInfo: () => ModelInfo | undefined;
}

// Initialize providers
const geminiProvider = new GeminiProvider();
const openRouterProvider = new OpenRouterProvider();

export const useModelStore = create<ModelState>()(
  persist(
    (set, get) => ({
      // Initial state
      geminiApiKey: '',
      openRouterApiKey: '',
      selectedModel: 'gemini-1.5-pro-latest',
      selectedProvider: 'gemini',
      geminiModels: geminiProvider.models,
      openRouterModels: openRouterProvider.defaultModels,
      allModels: [...geminiProvider.models, ...openRouterProvider.defaultModels],
      isLoadingModels: false,
      
      // Actions
      setGeminiApiKey: (key: string) => set({ geminiApiKey: key }),
      
      setOpenRouterApiKey: (key: string) => {
        set({ openRouterApiKey: key });
        // Fetch OpenRouter models when API key is set
        if (key) {
          get().fetchOpenRouterModels();
        }
      },
      
      setSelectedModel: (model: string, provider: 'gemini' | 'openrouter') => 
        set({ selectedModel: model, selectedProvider: provider }),
      
      setGeminiModels: (models: ModelInfo[]) => 
        set(state => ({ 
          geminiModels: models,
          allModels: [...models, ...state.openRouterModels]
        })),
      
      setOpenRouterModels: (models: ModelInfo[]) => 
        set(state => ({ 
          openRouterModels: models,
          allModels: [...state.geminiModels, ...models]
        })),
      
      fetchOpenRouterModels: async () => {
        const { openRouterApiKey } = get();
        if (!openRouterApiKey) return;
        
        set({ isLoadingModels: true });
        
        try {
          const models = await openRouterProvider.fetchAvailableModels(openRouterApiKey);
          get().setOpenRouterModels(models);
        } catch (error) {
          console.error('Failed to fetch OpenRouter models:', error);
        } finally {
          set({ isLoadingModels: false });
        }
      },
      
      // Utility functions
      isConfigured: () => {
        const { geminiApiKey, openRouterApiKey, selectedProvider } = get();
        return selectedProvider === 'gemini' ? !!geminiApiKey : !!openRouterApiKey;
      },
      
      getSelectedModelInfo: () => {
        const { selectedModel, allModels } = get();
        return allModels.find(model => model.name === selectedModel);
      }
    }),
    {
      name: 'erai-model-storage',
    }
  )
);
