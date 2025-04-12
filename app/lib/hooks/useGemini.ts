import { useAI } from '~/lib/hooks/useAI';
import { useState, useEffect } from 'react';
import { useModelStore } from '~/lib/stores/model-store';

export function useGeminiConfig() {
  const { 
    geminiApiKey, 
    openRouterApiKey,
    selectedModel,
    selectedProvider,
    isConfigured: storeIsConfigured
  } = useModelStore();
  
  return {
    apiKey: selectedProvider === 'gemini' ? geminiApiKey : openRouterApiKey,
    model: selectedModel,
    provider: selectedProvider,
    isConfigured: storeIsConfigured()
  };
}

export function useGeminiChat() {
  const { generateContent, streamContent, isGenerating, error } = useAI();
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([]);
  const [streamingContent, setStreamingContent] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const sendMessage = async (content: string) => {
    // Add user message
    const newMessages = [...messages, { role: 'user', content }];
    setMessages(newMessages);
    
    // Start streaming
    setIsStreaming(true);
    setStreamingContent('');
    
    try {
      // Create prompt from conversation history
      const prompt = newMessages
        .map(msg => `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`)
        .join('\n\n') + '\n\nAssistant: ';
      
      // Stream response
      const response = await streamContent(
        prompt,
        (partialResponse) => {
          setStreamingContent(partialResponse);
        }
      );
      
      // Add assistant message
      setMessages([...newMessages, { role: 'assistant', content: response }]);
    } catch (err) {
      console.error('Error in chat:', err);
    } finally {
      setIsStreaming(false);
    }
  };
  
  const clearMessages = () => {
    setMessages([]);
    setStreamingContent('');
  };
  
  return {
    messages,
    streamingContent,
    isStreaming,
    isGenerating,
    error,
    sendMessage,
    clearMessages
  };
}

export function useGeminiCode() {
  const { generateContent, streamContent, isGenerating, error } = useAI();
  const [result, setResult] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  
  const generateCode = async (prompt: string) => {
    setIsStreaming(true);
    setResult('');
    
    try {
      const fullPrompt = `Generate code for the following request. Only provide the code without explanations or comments unless specifically requested:\n\n${prompt}`;
      
      const response = await streamContent(
        fullPrompt,
        (partialResponse) => {
          setResult(partialResponse);
        }
      );
      
      return response;
    } catch (err) {
      console.error('Error generating code:', err);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };
  
  const improveCode = async (code: string, instructions: string) => {
    setIsStreaming(true);
    setResult('');
    
    try {
      const fullPrompt = `Improve the following code according to these instructions: ${instructions}\n\nCode:\n\`\`\`\n${code}\n\`\`\`\n\nImproved code:`;
      
      const response = await streamContent(
        fullPrompt,
        (partialResponse) => {
          setResult(partialResponse);
        }
      );
      
      return response;
    } catch (err) {
      console.error('Error improving code:', err);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };
  
  const explainCode = async (code: string) => {
    setIsStreaming(true);
    setResult('');
    
    try {
      const fullPrompt = `Explain the following code in detail:\n\`\`\`\n${code}\n\`\`\``;
      
      const response = await streamContent(
        fullPrompt,
        (partialResponse) => {
          setResult(partialResponse);
        }
      );
      
      return response;
    } catch (err) {
      console.error('Error explaining code:', err);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };
  
  const debugCode = async (code: string, error?: string) => {
    setIsStreaming(true);
    setResult('');
    
    try {
      const fullPrompt = `Debug the following code${error ? ` that produces this error: ${error}` : ''}:\n\`\`\`\n${code}\n\`\`\`\n\nFixed code:`;
      
      const response = await streamContent(
        fullPrompt,
        (partialResponse) => {
          setResult(partialResponse);
        }
      );
      
      return response;
    } catch (err) {
      console.error('Error debugging code:', err);
      throw err;
    } finally {
      setIsStreaming(false);
    }
  };
  
  return {
    result,
    isStreaming,
    isGenerating,
    error,
    generateCode,
    improveCode,
    explainCode,
    debugCode
  };
}
