import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { ProjectFile } from '~/lib/code/project-manager';

interface CodeEditorPanelProps {
  file: ProjectFile | null;
  onSaveFile: (content: string) => void;
}

export default function CodeEditorPanel({ file, onSaveFile }: CodeEditorPanelProps) {
  const [content, setContent] = useState('');
  const [isDirty, setIsDirty] = useState(false);
  
  // Update content when file changes
  useState(() => {
    if (file) {
      setContent(file.content);
      setIsDirty(false);
    }
  });
  
  const handleEditorChange = (value: string | undefined) => {
    const newContent = value || '';
    setContent(newContent);
    setIsDirty(newContent !== file?.content);
  };
  
  const handleSave = () => {
    if (file && isDirty) {
      onSaveFile(content);
      setIsDirty(false);
    }
  };
  
  // Determine language based on file extension
  const getLanguage = (filename: string): string => {
    const extension = filename.split('.').pop()?.toLowerCase() || '';
    const languageMap: Record<string, string> = {
      'js': 'javascript',
      'ts': 'typescript',
      'jsx': 'javascript',
      'tsx': 'typescript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
      'json': 'json',
      'md': 'markdown',
      'java': 'java',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'go': 'go',
      'php': 'php',
      'rb': 'ruby',
      'rs': 'rust',
      'swift': 'swift',
      'kt': 'kotlin',
      'sh': 'shell',
    };
    
    return languageMap[extension] || 'plaintext';
  };
  
  return (
    <div className="h-full flex flex-col">
      <div className="bg-gray-100 border-b px-4 py-2 flex justify-between items-center">
        <div className="flex items-center">
          {file ? (
            <>
              <span className="font-medium">{file.name}</span>
              {isDirty && <span className="ml-2 text-gray-500 text-sm">*</span>}
            </>
          ) : (
            <span className="text-gray-500">No file selected</span>
          )}
        </div>
        
        <div>
          {file && (
            <button
              onClick={handleSave}
              disabled={!isDirty}
              className={`px-3 py-1 rounded text-sm ${
                isDirty
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              Save
            </button>
          )}
        </div>
      </div>
      
      <div className="flex-1">
        {file ? (
          <Editor
            height="100%"
            language={getLanguage(file.name)}
            value={content}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              fontSize: 14,
              automaticLayout: true,
              wordWrap: 'on',
            }}
          />
        ) : (
          <div className="h-full flex items-center justify-center bg-gray-50 text-gray-500">
            Select a file to edit
          </div>
        )}
      </div>
    </div>
  );
}
