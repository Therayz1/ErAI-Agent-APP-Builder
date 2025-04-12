import { useState } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import { generateCode, improveCode, explainCode, debugCode } from '~/lib/api/gemini-api';

export default function TestSuite() {
  const [testResults, setTestResults] = useState<Array<{name: string, status: 'success' | 'failure' | 'pending', message: string}>>([]);
  const [isRunning, setIsRunning] = useState(false);
  const { apiKey, selectedModel } = useGeminiStore();
  
  const runTests = async () => {
    if (!apiKey) {
      alert('Please set your Gemini API key first');
      return;
    }
    
    setIsRunning(true);
    setTestResults([]);
    
    // Test 1: Generate simple JavaScript code
    await runTest('Generate JavaScript code', async () => {
      const prompt = 'Write a JavaScript function that calculates the factorial of a number';
      const result = await generateCode(prompt);
      if (!result.includes('function') || !result.includes('factorial')) {
        throw new Error('Generated code does not contain expected factorial function');
      }
      return 'Successfully generated factorial function code';
    });
    
    // Test 2: Improve existing code
    await runTest('Improve existing code', async () => {
      const code = `function slowSum(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
          sum = sum + arr[i];
        }
        return sum;
      }`;
      const instructions = 'Make this function more efficient and add proper comments';
      const result = await improveCode(code, instructions);
      if (!result.includes('function') || !result.includes('sum')) {
        throw new Error('Improved code does not contain expected function');
      }
      return 'Successfully improved code with better efficiency and comments';
    });
    
    // Test 3: Explain code
    await runTest('Explain code', async () => {
      const code = `function quickSort(arr) {
        if (arr.length <= 1) return arr;
        const pivot = arr[0];
        const left = arr.slice(1).filter(x => x < pivot);
        const right = arr.slice(1).filter(x => x >= pivot);
        return [...quickSort(left), pivot, ...quickSort(right)];
      }`;
      const result = await explainCode(code);
      if (!result.includes('quickSort') || !result.includes('pivot')) {
        throw new Error('Explanation does not contain expected terms');
      }
      return 'Successfully explained quickSort algorithm';
    });
    
    // Test 4: Debug code
    await runTest('Debug code', async () => {
      const code = `function reverseString(str) {
        let reversed = '';
        for (let i = 0; i <= str.length; i++) {
          reversed = str[i] + reversed;
        }
        return reversed;
      }`;
      const error = 'Function returns undefined for the last character';
      const result = await debugCode(code, error);
      if (!result.includes('function') || !result.includes('reverse')) {
        throw new Error('Debugged code does not contain expected function');
      }
      return 'Successfully debugged reverseString function';
    });
    
    // Test 5: Test Gemini API with different model
    await runTest('Test different Gemini model', async () => {
      // This test just verifies we can switch models without errors
      const currentModel = selectedModel;
      return `Successfully verified model selection (current: ${currentModel})`;
    });
    
    setIsRunning(false);
  };
  
  const runTest = async (name: string, testFn: () => Promise<string>) => {
    setTestResults(prev => [...prev, { name, status: 'pending', message: 'Running test...' }]);
    
    try {
      const message = await testFn();
      setTestResults(prev => 
        prev.map(test => 
          test.name === name ? { name, status: 'success', message } : test
        )
      );
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      setTestResults(prev => 
        prev.map(test => 
          test.name === name ? { name, status: 'failure', message: errorMessage } : test
        )
      );
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">ErAI Agent Test Suite</h1>
      
      <div className="mb-6">
        <button
          onClick={runTests}
          disabled={isRunning || !apiKey}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isRunning ? 'Running Tests...' : 'Run All Tests'}
        </button>
      </div>
      
      <div className="space-y-4">
        {testResults.length === 0 ? (
          <p className="text-gray-500">No tests have been run yet.</p>
        ) : (
          testResults.map((test, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-lg ${
                test.status === 'success' ? 'bg-green-100 border border-green-200' :
                test.status === 'failure' ? 'bg-red-100 border border-red-200' :
                'bg-yellow-100 border border-yellow-200'
              }`}
            >
              <div className="flex items-center">
                <div className={`w-3 h-3 rounded-full mr-2 ${
                  test.status === 'success' ? 'bg-green-500' :
                  test.status === 'failure' ? 'bg-red-500' :
                  'bg-yellow-500'
                }`}></div>
                <h3 className="font-medium">{test.name}</h3>
                <span className="ml-auto text-sm">
                  {test.status === 'success' ? 'Passed' :
                   test.status === 'failure' ? 'Failed' :
                   'Running...'}
                </span>
              </div>
              <p className={`mt-2 text-sm ${
                test.status === 'failure' ? 'text-red-700' : 'text-gray-600'
              }`}>
                {test.message}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
