import { useState } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';

export default function SettingsPanel() {
  const { apiKey, selectedModel, setSelectedModel } = useGeminiStore();
  const [activeSection, setActiveSection] = useState('general');
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b">
        <h3 className="font-medium">Settings</h3>
      </div>
      
      <div className="flex border-b">
        <button
          onClick={() => setActiveSection('general')}
          className={`px-4 py-2 ${activeSection === 'general' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          General
        </button>
        <button
          onClick={() => setActiveSection('api')}
          className={`px-4 py-2 ${activeSection === 'api' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          API Settings
        </button>
        <button
          onClick={() => setActiveSection('editor')}
          className={`px-4 py-2 ${activeSection === 'editor' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          Editor
        </button>
        <button
          onClick={() => setActiveSection('about')}
          className={`px-4 py-2 ${activeSection === 'about' ? 'bg-blue-100 text-blue-700 border-b-2 border-blue-500' : 'hover:bg-gray-100'}`}
        >
          About
        </button>
      </div>
      
      <div className="flex-1 overflow-auto p-4">
        {activeSection === 'general' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Theme</h4>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="light"
                    checked={true}
                    className="mr-2"
                  />
                  Light
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="theme"
                    value="dark"
                    className="mr-2"
                    disabled
                  />
                  Dark (Coming soon)
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Language</h4>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="en">English</option>
                <option value="tr">Türkçe</option>
              </select>
            </div>
          </div>
        )}
        
        {activeSection === 'api' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Gemini API Key</h4>
              <p className="text-sm text-gray-600 mb-2">
                Your API key is securely stored in your browser's local storage.
              </p>
              <div className="flex items-center">
                <input
                  type="password"
                  value="••••••••••••••••••••••••••••••"
                  disabled
                  className="flex-1 p-2 border border-gray-300 rounded-l"
                />
                <button className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600">
                  Update
                </button>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Model Selection</h4>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
              >
                <option value="gemini-1.5-flash-latest">Gemini 1.5 Flash</option>
                <option value="gemini-1.5-pro-latest">Gemini 1.5 Pro</option>
                <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Temperature</h4>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                defaultValue="0.2"
                className="w-full"
              />
              <div className="flex justify-between text-sm text-gray-600">
                <span>More Precise (0.0)</span>
                <span>More Creative (1.0)</span>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'editor' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">Font Size</h4>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="12">12px</option>
                <option value="14" selected>14px</option>
                <option value="16">16px</option>
                <option value="18">18px</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Tab Size</h4>
              <select className="w-full p-2 border border-gray-300 rounded">
                <option value="2" selected>2 spaces</option>
                <option value="4">4 spaces</option>
              </select>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Word Wrap</h4>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wordWrap"
                    value="on"
                    checked={true}
                    className="mr-2"
                  />
                  On
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="wordWrap"
                    value="off"
                    className="mr-2"
                  />
                  Off
                </label>
              </div>
            </div>
          </div>
        )}
        
        {activeSection === 'about' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-medium mb-2">ErAI Agent</h4>
              <p className="text-gray-600">Version 1.0.0</p>
              <p className="mt-4">
                ErAI Agent is a coding assistant powered by Google's Gemini API.
                It helps you write, improve, debug, and document code.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Credits</h4>
              <p>Inspired by bolt.diy from StackBlitz Labs</p>
            </div>
            
            <div>
              <h4 className="text-lg font-medium mb-2">Technologies</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Next.js</li>
                <li>React</li>
                <li>TypeScript</li>
                <li>Gemini API</li>
                <li>Monaco Editor</li>
                <li>Zustand</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
