import { useState, useEffect } from 'react';
import useLocalExecution from '~/lib/runtime/local-execution';

interface CodeRunnerProps {
  code: string;
  language: string;
}

export default function CodeRunner({ code, language }: CodeRunnerProps) {
  const [output, setOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { executeCode, isLoading, isSetup } = useLocalExecution();
  
  const handleRunCode = async () => {
    if (!code.trim()) {
      setError('No code to run');
      return;
    }
    
    try {
      setIsRunning(true);
      setError(null);
      setOutput('Running code...');
      
      const result = await executeCode(code, language);
      setOutput(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(`Error running code: ${errorMessage}`);
      setOutput('');
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-medium">Code Execution</h3>
        <div className="flex items-center">
          <span className={`w-2 h-2 rounded-full mr-2 ${isSetup ? 'bg-green-500' : 'bg-yellow-500'}`}></span>
          <span className="text-sm mr-3">{isSetup ? 'Ready' : 'Setting up...'}</span>
          <button
            onClick={handleRunCode}
            disabled={isRunning || !isSetup}
            className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600 disabled:bg-gray-400"
          >
            {isRunning ? 'Running...' : 'Run Code'}
          </button>
        </div>
      </div>
      
      <div className="flex-1 border rounded p-3 bg-black text-green-400 font-mono text-sm overflow-auto">
        {error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <pre>{output || 'Output will appear here...'}</pre>
        )}
      </div>
    </div>
  );
}
