import { create } from 'zustand';

interface GeminiState {
  apiKey: string | null;
  selectedModel: string;
  isLoading: boolean;
  setApiKey: (key: string) => void;
  setSelectedModel: (model: string) => void;
  setLoading: (loading: boolean) => void;
}

export const useGeminiStore = create<GeminiState>((set) => ({
  apiKey: null,
  selectedModel: 'gemini-1.5-flash-latest',
  isLoading: false,
  setApiKey: (key) => set({ apiKey: key }),
  setSelectedModel: (model) => set({ selectedModel: model }),
  setLoading: (loading) => set({ isLoading: loading }),
}));
