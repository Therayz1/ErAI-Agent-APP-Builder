import { useState, useEffect } from 'react';
import { saveCodeToFile, loadCodeFromFile } from '~/lib/code/code-utils';

interface FileManagerProps {
  code: string;
  language: string;
  onLoadCode: (code: string) => void;
}

export default function FileManager({ code, language, onLoadCode }: FileManagerProps) {
  const [filename, setFilename] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [savedFiles, setSavedFiles] = useState<string[]>([]);
  
  // Get file extension based on language
  const getFileExtension = (lang: string): string => {
    const extensionMap: Record<string, string> = {
      'javascript': 'js',
      'typescript': 'ts',
      'python': 'py',
      'ruby': 'rb',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'csharp': 'cs',
      'go': 'go',
      'html': 'html',
      'css': 'css',
      'php': 'php',
      'rust': 'rs',
      'swift': 'swift',
      'kotlin': 'kt',
      'shell': 'sh',
    };
    
    return extensionMap[lang] || 'txt';
  };
  
  // Set default filename based on language
  useEffect(() => {
    if (!filename) {
      setFilename(`code.${getFileExtension(language)}`);
    }
  }, [language]);
  
  // Mock function to simulate loading saved files
  useEffect(() => {
    // In a real implementation, this would load from local storage or a backend
    setSavedFiles([
      'example.js',
      'example.py',
      'example.html',
    ]);
  }, []);
  
  const handleSaveCode = async () => {
    if (!code.trim()) {
      setMessage('No code to save');
      return;
    }
    
    if (!filename.trim()) {
      setMessage('Please enter a filename');
      return;
    }
    
    try {
      setIsSaving(true);
      setMessage('');
      
      // Add extension if not present
      let finalFilename = filename;
      const extension = getFileExtension(language);
      if (!finalFilename.endsWith(`.${extension}`)) {
        finalFilename = `${finalFilename}.${extension}`;
      }
      
      const success = await saveCodeToFile(code, finalFilename);
      
      if (success) {
        setMessage(`Saved to ${finalFilename}`);
        // Add to saved files if not already present
        if (!savedFiles.includes(finalFilename)) {
          setSavedFiles([...savedFiles, finalFilename]);
        }
      } else {
        setMessage('Failed to save file');
      }
    } catch (error) {
      console.error('Error saving code:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLoadCode = async (file: string) => {
    try {
      setIsLoading(true);
      setMessage('');
      
      const loadedCode = await loadCodeFromFile(file);
      onLoadCode(loadedCode);
      setMessage(`Loaded ${file}`);
    } catch (error) {
      console.error('Error loading code:', error);
      setMessage(`Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <h3 className="font-medium mb-2">File Manager</h3>
      
      <div className="flex gap-2 mb-3">
        <input
          type="text"
          value={filename}
          onChange={(e) => setFilename(e.target.value)}
          placeholder="Filename"
          className="flex-1 p-2 border border-gray-300 rounded text-sm"
        />
        <button
          onClick={handleSaveCode}
          disabled={isSaving}
          className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>
      
      {message && (
        <div className="mb-3 p-2 bg-gray-100 text-sm rounded">
          {message}
        </div>
      )}
      
      <div className="flex-1 border rounded overflow-auto">
        <h4 className="p-2 bg-gray-100 border-b font-medium text-sm">Saved Files</h4>
        {savedFiles.length === 0 ? (
          <p className="p-3 text-gray-500 text-sm">No saved files</p>
        ) : (
          <ul className="divide-y">
            {savedFiles.map((file) => (
              <li key={file} className="p-2 hover:bg-gray-50 flex justify-between items-center">
                <span className="text-sm">{file}</span>
                <button
                  onClick={() => handleLoadCode(file)}
                  disabled={isLoading}
                  className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300"
                >
                  Load
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
