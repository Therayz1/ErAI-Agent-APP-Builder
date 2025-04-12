import { useState } from 'react';
import { useModelStore } from '~/lib/stores/model-store';

export default function ApiKeyForm() {
  const { 
    geminiApiKey, 
    openRouterApiKey, 
    setGeminiApiKey, 
    setOpenRouterApiKey,
    selectedProvider,
    setSelectedModel
  } = useModelStore();
  
  const [geminiKey, setGeminiKey] = useState(geminiApiKey);
  const [openRouterKey, setOpenRouterKey] = useState(openRouterApiKey);
  const [activeTab, setActiveTab] = useState<'gemini' | 'openrouter'>(selectedProvider);
  
  const handleGeminiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeminiApiKey(geminiKey);
    setSelectedModel('gemini-1.5-pro-latest', 'gemini');
  };
  
  const handleOpenRouterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setOpenRouterApiKey(openRouterKey);
    setSelectedModel('openai/gpt-4o', 'openrouter');
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md">
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('gemini')}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === 'gemini' 
              ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
              : 'hover:bg-gray-100'
          }`}
        >
          Gemini API
        </button>
        <button
          onClick={() => setActiveTab('openrouter')}
          className={`flex-1 px-4 py-2 text-center ${
            activeTab === 'openrouter' 
              ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' 
              : 'hover:bg-gray-100'
          }`}
        >
          OpenRouter API
        </button>
      </div>
      
      <div className="p-4">
        {activeTab === 'gemini' ? (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Enter your Gemini API key to access Google's AI models. 
                <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  Get a key
                </a>
              </p>
            </div>
            
            <form onSubmit={handleGeminiSubmit}>
              <div className="mb-4">
                <label htmlFor="gemini-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                  Gemini API Key
                </label>
                <input
                  id="gemini-api-key"
                  type="password"
                  value={geminiKey}
                  onChange={(e) => setGeminiKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your Gemini API key"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
              >
                Save Gemini API Key
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                Enter your OpenRouter API key to access 200+ AI models including GPT-4, Claude, Llama, and more. 
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-700 ml-1"
                >
                  Get a key
                </a>
              </p>
            </div>
            
            <form onSubmit={handleOpenRouterSubmit}>
              <div className="mb-4">
                <label htmlFor="openrouter-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                  OpenRouter API Key
                </label>
                <input
                  id="openrouter-api-key"
                  type="password"
                  value={openRouterKey}
                  onChange={(e) => setOpenRouterKey(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded"
                  placeholder="Enter your OpenRouter API key"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full bg-purple-500 text-white py-2 px-4 rounded hover:bg-purple-600"
              >
                Save OpenRouter API Key
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
