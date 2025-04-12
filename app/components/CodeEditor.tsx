import { useState, useEffect } from 'react';
import { useGeminiStream } from '~/lib/hooks/useGemini';
import { extractCodeFromResponse } from '~/lib/api/gemini-api';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import Editor from '@monaco-editor/react';

export default function CodeEditor() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const { apiKey } = useGeminiStore();
  const { streamContent, isStreaming, streamedContent, error } = useGeminiStream();
  
  // Update code when stream content changes
  useEffect(() => {
    if (streamedContent) {
      const extractedCode = extractCodeFromResponse(streamedContent);
      setCode(extractedCode || streamedContent);
      
      // Try to detect language from code blocks
      const langMatch = streamedContent.match(/```(\w+)/);
      if (langMatch && langMatch[1]) {
        const detectedLang = langMatch[1].toLowerCase();
        // Map common language identifiers to Monaco editor language IDs
        const langMap: Record<string, string> = {
          'js': 'javascript',
          'ts': 'typescript',
          'py': 'python',
          'rb': 'ruby',
          'java': 'java',
          'c': 'c',
          'cpp': 'cpp',
          'cs': 'csharp',
          'go': 'go',
          'html': 'html',
          'css': 'css',
          'php': 'php',
          'rust': 'rust',
          'swift': 'swift',
          'kotlin': 'kotlin',
          'shell': 'shell',
          'bash': 'shell',
          'sh': 'shell',
        };
        
        setLanguage(langMap[detectedLang] || detectedLang);
      }
    }
  }, [streamedContent]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKey) {
      alert('Please set your Gemini API key first');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    try {
      // Enhanced prompt for coding tasks
      const enhancedPrompt = `You are a coding assistant. Please provide a solution for the following request. 
If you're generating code, wrap it in triple backticks with the appropriate language identifier.
Focus on writing clean, efficient, and well-commented code.

${prompt}`;
      
      await streamContent(enhancedPrompt, {
        temperature: 0.2,
      });
    } catch (err) {
      console.error('Error generating code:', err);
      alert(`Error generating code: ${err instanceof Error ? err.message : String(err)}`);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-white border-b">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the code you want to generate..."
            className="flex-1 p-2 border border-gray-300 rounded"
            disabled={isStreaming}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isStreaming || !apiKey}
          >
            {isStreaming ? 'Generating...' : 'Generate Code'}
          </button>
        </form>
      </div>
      
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={language}
          value={code}
          onChange={(value) => setCode(value || '')}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            automaticLayout: true,
          }}
        />
      </div>
      
      {error && (
        <div className="p-2 bg-red-100 text-red-700 border-t">
          {error}
        </div>
      )}
    </div>
  );
}
