import { useState, useEffect } from 'react';
import { useGeminiConfig } from '~/lib/hooks/useGemini';

export default function LocalExecutionEnvironment() {
  const [isSetup, setIsSetup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [output, setOutput] = useState('');
  const { isConfigured } = useGeminiConfig();
  
  // Setup local execution environment
  useEffect(() => {
    const setupEnvironment = async () => {
      if (!isConfigured) return;
      
      setIsLoading(true);
      setOutput('Setting up local execution environment...');
      
      try {
        // Simulate setup process
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setIsSetup(true);
        setOutput('Local execution environment is ready.');
      } catch (error) {
        console.error('Error setting up environment:', error);
        setOutput(`Error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };
    
    setupEnvironment();
  }, [isConfigured]);
  
  // Mock function to execute code locally
  const executeCodeLocally = async (code: string, language: string) => {
    if (!isSetup) {
      setOutput('Environment not set up yet. Please wait...');
      return;
    }
    
    setIsLoading(true);
    setOutput(`Executing ${language} code...`);
    
    try {
      // Simulate code execution
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock different outputs based on language
      let result = '';
      
      switch (language) {
        case 'javascript':
        case 'typescript':
          result = 'JavaScript execution completed successfully.';
          break;
        case 'python':
          result = 'Python execution completed successfully.';
          break;
        case 'html':
          result = 'HTML rendered successfully.';
          break;
        default:
          result = `${language} code executed successfully.`;
      }
      
      setOutput(result);
      return result;
    } catch (error) {
      const errorMessage = `Execution error: ${error instanceof Error ? error.message : String(error)}`;
      setOutput(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isSetup,
    isLoading,
    output,
    executeCodeLocally
  };
}
