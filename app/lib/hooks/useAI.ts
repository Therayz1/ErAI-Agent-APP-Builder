import { useModelStore } from '~/lib/stores/model-store';
import { GeminiProvider } from '~/lib/gemini/provider';
import { OpenRouterProvider } from '~/lib/openrouter/provider';
import { useState, useCallback } from 'react';

// Initialize providers
const geminiProvider = new GeminiProvider();
const openRouterProvider = new OpenRouterProvider();

export function useAI() {
  const { 
    geminiApiKey, 
    openRouterApiKey, 
    selectedModel, 
    selectedProvider,
    isConfigured 
  } = useModelStore();
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Generate content using the selected provider
  const generateContent = useCallback(async (
    prompt: string, 
    options?: { 
      temperature?: number; 
      maxOutputTokens?: number;
    }
  ) => {
    if (!isConfigured()) {
      throw new Error('API key not configured');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      if (selectedProvider === 'gemini') {
        return await geminiProvider.generateContent({
          model: selectedModel,
          apiKey: geminiApiKey,
          prompt,
          ...options
        });
      } else {
        return await openRouterProvider.generateContent({
          model: selectedModel,
          apiKey: openRouterApiKey,
          prompt,
          ...options
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [geminiApiKey, openRouterApiKey, selectedModel, selectedProvider, isConfigured]);
  
  // Stream content using the selected provider
  const streamContent = useCallback(async (
    prompt: string, 
    onPartialResponse: (text: string) => void,
    options?: { 
      temperature?: number; 
      maxOutputTokens?: number;
    }
  ) => {
    if (!isConfigured()) {
      throw new Error('API key not configured');
    }
    
    setIsGenerating(true);
    setError(null);
    
    try {
      if (selectedProvider === 'gemini') {
        return await geminiProvider.streamContent({
          model: selectedModel,
          apiKey: geminiApiKey,
          prompt,
          onPartialResponse,
          ...options
        });
      } else {
        return await openRouterProvider.streamContent({
          model: selectedModel,
          apiKey: openRouterApiKey,
          prompt,
          onPartialResponse,
          ...options
        });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  }, [geminiApiKey, openRouterApiKey, selectedModel, selectedProvider, isConfigured]);
  
  return {
    generateContent,
    streamContent,
    isGenerating,
    error,
    isConfigured: isConfigured()
  };
}
