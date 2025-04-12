import { useState, useEffect } from 'react';
import { useModelStore } from '~/lib/stores/model-store';
import { ModelInfo } from '~/lib/gemini/provider';

export default function ModelSelector() {
  const { 
    geminiModels,
    openRouterModels,
    allModels,
    selectedModel,
    selectedProvider,
    setSelectedModel,
    isLoadingModels,
    fetchOpenRouterModels
  } = useModelStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredModels, setFilteredModels] = useState<ModelInfo[]>(allModels);
  const [activeTab, setActiveTab] = useState<'all' | 'gemini' | 'openrouter'>(
    selectedProvider === 'gemini' ? 'gemini' : 'openrouter'
  );
  
  // Fetch OpenRouter models on mount
  useEffect(() => {
    fetchOpenRouterModels();
  }, [fetchOpenRouterModels]);
  
  // Filter models based on search term and active tab
  useEffect(() => {
    let models = allModels;
    
    if (activeTab === 'gemini') {
      models = geminiModels;
    } else if (activeTab === 'openrouter') {
      models = openRouterModels;
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      models = models.filter(model => 
        model.name.toLowerCase().includes(term) || 
        model.label.toLowerCase().includes(term)
      );
    }
    
    setFilteredModels(models);
  }, [searchTerm, activeTab, allModels, geminiModels, openRouterModels]);
  
  const handleModelSelect = (model: ModelInfo) => {
    setSelectedModel(model.name, model.provider);
  };
  
  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Select AI Model</h2>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search models..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      
      <div className="flex border-b mb-4">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 ${activeTab === 'all' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          All Models
        </button>
        <button
          onClick={() => setActiveTab('gemini')}
          className={`px-4 py-2 ${activeTab === 'gemini' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Gemini
        </button>
        <button
          onClick={() => setActiveTab('openrouter')}
          className={`px-4 py-2 ${activeTab === 'openrouter' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          OpenRouter
        </button>
      </div>
      
      {isLoadingModels ? (
        <div className="text-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading models...</p>
        </div>
      ) : filteredModels.length === 0 ? (
        <div className="text-center py-4 text-gray-600">
          No models found matching "{searchTerm}"
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto">
          {filteredModels.map((model) => (
            <div 
              key={model.name}
              onClick={() => handleModelSelect(model)}
              className={`p-3 mb-2 rounded cursor-pointer border ${
                selectedModel === model.name 
                  ? 'bg-blue-50 border-blue-300' 
                  : 'hover:bg-gray-50 border-gray-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  model.provider === 'gemini' ? 'bg-blue-500' : 'bg-purple-500'
                }`}></div>
                <h3 className="font-medium">{model.label}</h3>
                <span className={`ml-auto text-xs px-2 py-1 rounded ${
                  model.provider === 'gemini' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-purple-100 text-purple-700'
                }`}>
                  {model.provider === 'gemini' ? 'Gemini' : 'OpenRouter'}
                </span>
              </div>
              <div className="mt-1 text-sm text-gray-600">
                <span className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                  {model.name}
                </span>
                <span className="ml-2">
                  {Math.floor(model.maxTokenAllowed / 1000)}k tokens
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>
          {selectedProvider === 'gemini' ? (
            <>Using Gemini API with model: <span className="font-semibold">{selectedModel}</span></>
          ) : (
            <>Using OpenRouter API with model: <span className="font-semibold">{selectedModel}</span></>
          )}
        </p>
      </div>
    </div>
  );
}
