import { GeminiProvider } from '../gemini/provider';
import { useGeminiStore } from '../stores/gemini-store';

// Function to extract code from Gemini response
export function extractCodeFromResponse(response: string): string {
  // Look for code blocks with triple backticks
  const codeBlockRegex = /```(?:[\w]*)\n([\s\S]*?)```/g;
  const matches = [...response.matchAll(codeBlockRegex)];
  
  if (matches.length > 0) {
    // Join all code blocks if there are multiple
    return matches.map(match => match[1]).join('\n\n');
  }
  
  // If no code blocks found, return the original response
  return response;
}

// Main function to generate code using Gemini API
export async function generateCode(prompt: string, options?: {
  temperature?: number;
  maxOutputTokens?: number;
  includeContext?: string;
}) {
  const { apiKey, selectedModel, setLoading } = useGeminiStore.getState();
  
  if (!apiKey) {
    throw new Error('API key is not set');
  }
  
  try {
    setLoading(true);
    const provider = new GeminiProvider();
    
    // Enhance prompt with coding context if provided
    let enhancedPrompt = prompt;
    if (options?.includeContext) {
      enhancedPrompt = `I'm working on the following code:\n\n${options.includeContext}\n\nBased on this context, ${prompt}`;
    }
    
    // Add coding-specific instructions to the prompt
    enhancedPrompt = `You are a coding assistant. Please provide a solution for the following request. 
If you're generating code, wrap it in triple backticks with the appropriate language identifier.
Focus on writing clean, efficient, and well-commented code.

${enhancedPrompt}`;
    
    const result = await provider.generateContent({
      model: selectedModel,
      apiKey,
      prompt: enhancedPrompt,
      temperature: options?.temperature ?? 0.2,
      maxOutputTokens: options?.maxOutputTokens ?? 8192,
    });
    
    return result;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  } finally {
    setLoading(false);
  }
}

// Function to improve existing code
export async function improveCode(code: string, instructions: string) {
  return generateCode(`Improve the following code according to these instructions: ${instructions}\n\nCode:\n\`\`\`\n${code}\n\`\`\``, {
    temperature: 0.3,
    includeContext: code
  });
}

// Function to explain code
export async function explainCode(code: string) {
  return generateCode(`Explain the following code in detail, describing what it does and how it works:\n\`\`\`\n${code}\n\`\`\``, {
    temperature: 0.1,
    includeContext: code
  });
}

// Function to debug code
export async function debugCode(code: string, error?: string) {
  let prompt = `Debug the following code and identify any issues:`;
  
  if (error) {
    prompt += `\n\nThe code is producing this error: ${error}`;
  }
  
  prompt += `\n\nCode:\n\`\`\`\n${code}\n\`\`\``;
  
  return generateCode(prompt, {
    temperature: 0.2,
    includeContext: code
  });
}

// Function to generate unit tests
export async function generateTests(code: string) {
  return generateCode(`Generate comprehensive unit tests for the following code:\n\`\`\`\n${code}\n\`\`\``, {
    temperature: 0.2,
    includeContext: code
  });
}

// Function to generate documentation
export async function generateDocumentation(code: string) {
  return generateCode(`Generate comprehensive documentation for the following code, including function descriptions, parameter details, and usage examples:\n\`\`\`\n${code}\n\`\`\``, {
    temperature: 0.1,
    includeContext: code
  });
}
