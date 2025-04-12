import { ModelInfo } from '~/lib/gemini/provider';

export class OpenRouterProvider {
  name = 'OpenRouter';
  getApiKeyLink = 'https://openrouter.ai/keys';
  
  // Available OpenRouter models - this is a subset, the full list is fetched dynamically
  defaultModels: ModelInfo[] = [
    {
      name: 'openai/gpt-4o',
      label: 'GPT-4o',
      maxTokenAllowed: 128000,
      provider: 'openrouter'
    },
    {
      name: 'anthropic/claude-3-opus',
      label: 'Claude 3 Opus',
      maxTokenAllowed: 200000,
      provider: 'openrouter'
    },
    {
      name: 'anthropic/claude-3-sonnet',
      label: 'Claude 3 Sonnet',
      maxTokenAllowed: 200000,
      provider: 'openrouter'
    },
    {
      name: 'meta-llama/llama-3-70b-instruct',
      label: 'Llama 3 70B',
      maxTokenAllowed: 8192,
      provider: 'openrouter'
    },
    {
      name: 'google/gemini-pro',
      label: 'Gemini Pro (via OpenRouter)',
      maxTokenAllowed: 32768,
      provider: 'openrouter'
    }
  ];
  
  // Fetch all available models from OpenRouter
  async fetchAvailableModels(apiKey: string): Promise<ModelInfo[]> {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/models', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the OpenRouter model data to our ModelInfo format
      return data.data.map((model: any) => ({
        name: model.id,
        label: model.name || model.id,
        maxTokenAllowed: model.context_length || 4096,
        provider: 'openrouter'
      }));
    } catch (error) {
      console.error('Error fetching OpenRouter models:', error);
      // Return default models if we can't fetch the full list
      return this.defaultModels;
    }
  }
  
  // Generate content using the OpenRouter API
  async generateContent(options: {
    model: string;
    apiKey: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
  }) {
    const { model, apiKey, prompt, temperature = 0.2, maxOutputTokens = 4096 } = options;
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://erai-agent.app',
          'X-Title': 'ErAI Agent'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: temperature,
          max_tokens: maxOutputTokens
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('Error generating content with OpenRouter:', error);
      throw error;
    }
  }
  
  // Stream content using the OpenRouter API
  async streamContent(options: {
    model: string;
    apiKey: string;
    prompt: string;
    temperature?: number;
    maxOutputTokens?: number;
    onPartialResponse: (text: string) => void;
  }) {
    const { model, apiKey, prompt, temperature = 0.2, maxOutputTokens = 4096, onPartialResponse } = options;
    
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://erai-agent.app',
          'X-Title': 'ErAI Agent'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            { role: 'user', content: prompt }
          ],
          temperature: temperature,
          max_tokens: maxOutputTokens,
          stream: true
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenRouter API error: ${response.status} ${response.statusText} - ${errorText}`);
      }
      
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }
      
      const decoder = new TextDecoder();
      let fullResponse = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices[0]?.delta?.content || '';
              if (content) {
                fullResponse += content;
                onPartialResponse(fullResponse);
              }
            } catch (e) {
              console.error('Error parsing streaming response:', e);
            }
          }
        }
      }
      
      return fullResponse;
    } catch (error) {
      console.error('Error streaming content with OpenRouter:', error);
      throw error;
    }
  }
}
