import { useState, useEffect } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import { GeminiProvider, ModelInfo } from '~/lib/gemini/provider';

export default function DynamicModelSupport() {
  const { apiKey, selectedModel, setSelectedModel } = useGeminiStore();
  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch available models when API key changes
  useEffect(() => {
    if (!apiKey) return;
    
    const fetchModels = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // In a real implementation, this would fetch models from the Gemini API
        // For now, we'll use the static list from the provider
        const provider = new GeminiProvider();
        setAvailableModels(provider.models);
      } catch (err) {
        console.error('Error fetching models:', err);
        setError(`Failed to fetch models: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchModels();
  }, [apiKey]);
  
  // Select a model
  const selectModel = (modelName: string) => {
    setSelectedModel(modelName);
  };
  
  // Get model details
  const getModelDetails = (modelName: string): ModelInfo | undefined => {
    return availableModels.find(model => model.name === modelName);
  };
  
  return {
    availableModels,
    selectedModel,
    selectModel,
    getModelDetails,
    isLoading,
    error
  };
}
