import { useState } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import { generateCode, improveCode, explainCode, debugCode, generateTests, generateDocumentation, extractCodeFromResponse } from '~/lib/api/gemini-api';
import Editor from '@monaco-editor/react';

export default function CodingAgent() {
  const [prompt, setPrompt] = useState('');
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState('generate'); // generate, improve, explain, debug, test, document
  const { apiKey, selectedModel, isLoading } = useGeminiStore();
  
  const handleGenerateCode = async () => {
    if (!apiKey) {
      alert('Please set your Gemini API key first');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter a prompt');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await generateCode(prompt);
      const extractedCode = extractCodeFromResponse(result);
      setCode(extractedCode || result);
      setOutput('Code generated successfully');
      
      // Try to detect language from code blocks
      const langMatch = result.match(/```(\w+)/);
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
    } catch (error) {
      console.error('Error generating code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleImproveCode = async () => {
    if (!code.trim()) {
      alert('Please generate or enter code first');
      return;
    }
    
    if (!prompt.trim()) {
      alert('Please enter improvement instructions');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await improveCode(code, prompt);
      const extractedCode = extractCodeFromResponse(result);
      setCode(extractedCode || result);
      setOutput('Code improved successfully');
    } catch (error) {
      console.error('Error improving code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleExplainCode = async () => {
    if (!code.trim()) {
      alert('Please generate or enter code first');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await explainCode(code);
      setOutput(result);
    } catch (error) {
      console.error('Error explaining code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleDebugCode = async () => {
    if (!code.trim()) {
      alert('Please generate or enter code first');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await debugCode(code, prompt.trim() ? prompt : undefined);
      const extractedCode = extractCodeFromResponse(result);
      if (extractedCode) {
        setCode(extractedCode);
        setOutput('Debugged code applied. Original explanation:\n\n' + result);
      } else {
        setOutput(result);
      }
    } catch (error) {
      console.error('Error debugging code:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateTests = async () => {
    if (!code.trim()) {
      alert('Please generate or enter code first');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await generateTests(code);
      setOutput(result);
    } catch (error) {
      console.error('Error generating tests:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleGenerateDocumentation = async () => {
    if (!code.trim()) {
      alert('Please generate or enter code first');
      return;
    }
    
    try {
      setIsProcessing(true);
      const result = await generateDocumentation(code);
      setOutput(result);
    } catch (error) {
      console.error('Error generating documentation:', error);
      setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsProcessing(false);
    }
  };
  
  const handleAction = async () => {
    switch (activeTab) {
      case 'generate':
        await handleGenerateCode();
        break;
      case 'improve':
        await handleImproveCode();
        break;
      case 'explain':
        await handleExplainCode();
        break;
      case 'debug':
        await handleDebugCode();
        break;
      case 'test':
        await handleGenerateTests();
        break;
      case 'document':
        await handleGenerateDocumentation();
        break;
    }
  };
  
  const getPromptPlaceholder = () => {
    switch (activeTab) {
      case 'generate':
        return 'Describe the code you want to generate...';
      case 'improve':
        return 'Describe how you want to improve the code...';
      case 'explain':
        return 'Ask specific questions about the code (optional)...';
      case 'debug':
        return 'Describe the error or issue you are experiencing (optional)...';
      case 'test':
        return 'Specific testing requirements (optional)...';
      case 'document':
        return 'Specific documentation requirements (optional)...';
      default:
        return 'Enter your prompt...';
    }
  };
  
  const getActionButtonText = () => {
    if (isProcessing) return 'Processing...';
    
    switch (activeTab) {
      case 'generate':
        return 'Generate Code';
      case 'improve':
        return 'Improve Code';
      case 'explain':
        return 'Explain Code';
      case 'debug':
        return 'Debug Code';
      case 'test':
        return 'Generate Tests';
      case 'document':
        return 'Generate Docs';
      default:
        return 'Submit';
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('generate')}
          className={`px-4 py-2 ${activeTab === 'generate' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Generate
        </button>
        <button
          onClick={() => setActiveTab('improve')}
          className={`px-4 py-2 ${activeTab === 'improve' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Improve
        </button>
        <button
          onClick={() => setActiveTab('explain')}
          className={`px-4 py-2 ${activeTab === 'explain' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Explain
        </button>
        <button
          onClick={() => setActiveTab('debug')}
          className={`px-4 py-2 ${activeTab === 'debug' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Debug
        </button>
        <button
          onClick={() => setActiveTab('test')}
          className={`px-4 py-2 ${activeTab === 'test' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Test
        </button>
        <button
          onClick={() => setActiveTab('document')}
          className={`px-4 py-2 ${activeTab === 'document' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Document
        </button>
      </div>
      
      <div className="p-4 bg-white border-b">
        <div className="flex gap-2">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder={getPromptPlaceholder()}
            className="flex-1 p-2 border border-gray-300 rounded"
            disabled={isProcessing}
          />
          <button
            onClick={handleAction}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
            disabled={isProcessing || !apiKey}
          >
            {getActionButtonText()}
          </button>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-4 p-4 min-h-0">
        <div className="flex flex-col h-full">
          <h3 className="font-medium mb-2">Code</h3>
          <div className="flex-1 border rounded overflow-hidden">
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
        </div>
        
        <div className="flex flex-col h-full">
          <h3 className="font-medium mb-2">Output</h3>
          <div className="flex-1 border rounded p-4 bg-gray-50 overflow-auto whitespace-pre-wrap">
            {output}
          </div>
        </div>
      </div>
    </div>
  );
}
