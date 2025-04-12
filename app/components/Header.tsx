import { useState } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import { useGeminiConfig } from '~/lib/hooks/useGemini';

export default function Header() {
  const { apiKey, selectedModel } = useGeminiStore();
  const { isConfigured, validateApiKey } = useGeminiConfig();
  const [isValidating, setIsValidating] = useState(false);
  
  const handleValidateApiKey = async () => {
    if (!apiKey) return;
    
    setIsValidating(true);
    try {
      await validateApiKey();
    } finally {
      setIsValidating(false);
    }
  };
  
  return (
    <header className="bg-white border-b px-6 py-4 flex justify-between items-center">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-blue-600">ErAI Agent</h1>
        <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
          Beta
        </span>
      </div>
      
      <div className="flex items-center space-x-4">
        {apiKey ? (
          <>
            <div className="flex items-center text-sm">
              <span className="text-gray-500 mr-2">Model:</span>
              <span className="font-medium">{selectedModel}</span>
            </div>
            
            <div className="flex items-center">
              <span className={`w-2 h-2 rounded-full mr-2 ${isConfigured ? 'bg-green-500' : 'bg-red-500'}`}></span>
              <span className="text-sm">{isConfigured ? 'Connected' : 'Not Connected'}</span>
              
              {!isConfigured && (
                <button
                  onClick={handleValidateApiKey}
                  disabled={isValidating}
                  className="ml-2 text-xs text-blue-600 hover:text-blue-800"
                >
                  {isValidating ? 'Checking...' : 'Check Connection'}
                </button>
              )}
            </div>
          </>
        ) : (
          <span className="text-sm text-gray-500">API Key Not Set</span>
        )}
      </div>
    </header>
  );
}
