import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';

export interface ModelInfo {
  name: string;
  label: string;
  maxTokenAllowed: number;
  provider: 'gemini' | 'openrouter';
}

export class GeminiProvider {
  name = 'Gemini';
  getApiKeyLink = 'https://aistudio.google.com/app/apikey';
  
  // Available Gemini models
  models: ModelInfo[] = [
    {
      name: 'gemini-1.5-flash-latest',
      label: 'Gemini 1.5 Flash',
      maxTokenAllowed: 8192,
      provider: 'gemini'
    },
    {
      name: 'gemini-1.5-pro-latest',
      label: 'Gemini 1.5 Pro',
      maxTokenAllowed: 8192,
      provider: 'gemini'
    },
    {
      name: 'gemini-2.0-flash-exp',
      label: 'Gemini 2.0 Flash',
      maxTokenAllowed: 8192,
      provider: 'gemini'
    },
    {
      name: 'gemini-1.5-flash-002',
      label: 'Gemini 1.5 Flash-002',
      maxTokenAllowed: 8192,
      provider: 'gemini'
    },
    {
      name: 'gemini-1.5-pro-002',
      label: 'Gemini 1.5 Pro-002',
      maxTokenAllowed: 8192,
      provider: 'gemini'
    }
  ];
  
  // Initialize the Gemini API client
  getModelInstance(apiKey: string) {
    if (!apiKey) {
      throw new Error(`Missing API key for Gemini provider`);
    }
    
    return new GoogleGenerativeAI(apiKey);
  }
  
  // Generate content using the Gemini API
  async generateContent(options: {
    model: string;
    apiKey: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
  }) {
    const { model, apiKey, prompt, temperature = 0.2, maxOutputTokens = 8192 } = options;
    
    try {
      const genAI = this.getModelInstance(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });
      
      const result = await geminiModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP: 0.8,
          topK: 40,
        },
      });
      
      return result.response.text();
    } catch (error) {
      console.error('Error generating content with Gemini:', error);
      throw error;
    }
  }
  
  // Stream content using the Gemini API
  async streamContent(options: {
    model: string;
    apiKey: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
    onPartialResponse: (text: string) => void;
  }) {
    const { model, apiKey, prompt, temperature = 0.2, maxOutputTokens = 8192, onPartialResponse } = options;
    
    try {
      const genAI = this.getModelInstance(apiKey);
      const geminiModel = genAI.getGenerativeModel({ 
        model,
        safetySettings: [
          {
            category: HarmCategory.HARM_CATEGORY_HARASSMENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
          {
            category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
            threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
          },
        ],
      });
      
      const result = await geminiModel.generateContentStream({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens,
          topP: 0.8,
          topK: 40,
        },
      });
      
      let fullResponse = '';
      
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        fullResponse += chunkText;
        onPartialResponse(fullResponse);
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error streaming content with Gemini:', error);
      throw error;
    }
  }
}
