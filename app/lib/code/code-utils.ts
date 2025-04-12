import { GeminiProvider } from '../gemini/provider';
import { useGeminiStore } from '../stores/gemini-store';

// Function to check if Gemini API is available
export async function checkGeminiAvailability(apiKey: string): Promise<boolean> {
  try {
    const provider = new GeminiProvider();
    await provider.generateContent({
      model: 'gemini-1.5-flash-latest',
      apiKey,
      prompt: 'Test connection',
      maxOutputTokens: 10
    });
    return true;
  } catch (error) {
    console.error('Gemini API availability check failed:', error);
    return false;
  }
}

// Function to get available models dynamically from Gemini API
export async function fetchAvailableModels(apiKey: string): Promise<any[]> {
  try {
    // This would ideally call the Gemini API to get available models
    // For now, we'll return the static list since the API doesn't have a direct endpoint for this
    const provider = new GeminiProvider();
    return provider.models;
  } catch (error) {
    console.error('Error fetching available models:', error);
    return [];
  }
}

// Function to create a coding agent prompt
export function createCodingPrompt(task: string, context?: string, language?: string): string {
  let prompt = `You are an expert coding assistant specialized in writing clean, efficient, and well-documented code. `;
  
  if (language) {
    prompt += `I need you to write code in ${language}. `;
  }
  
  prompt += `${task}`;
  
  if (context) {
    prompt += `\n\nHere is the context or existing code:\n\`\`\`\n${context}\n\`\`\``;
  }
  
  prompt += `\n\nPlease provide the code solution wrapped in triple backticks with the appropriate language identifier.`;
  
  return prompt;
}

// Function to handle code execution (placeholder for now)
export async function executeCode(code: string, language: string): Promise<string> {
  // This would connect to a code execution service
  // For now, we'll return a placeholder
  return `[Execution of ${language} code would happen here]`;
}

// Function to save code to a file (placeholder for now)
export async function saveCodeToFile(code: string, filename: string): Promise<boolean> {
  // This would save to the local filesystem
  // For now, we'll return a placeholder
  console.log(`Would save code to ${filename}`);
  return true;
}

// Function to load code from a file (placeholder for now)
export async function loadCodeFromFile(filename: string): Promise<string> {
  // This would load from the local filesystem
  // For now, we'll return a placeholder
  return `// Code loaded from ${filename}`;
}
