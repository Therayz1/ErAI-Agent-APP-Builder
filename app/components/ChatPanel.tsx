import { useState } from 'react';
import { useGeminiStream } from '~/lib/hooks/useGemini';
import { extractCodeFromResponse } from '~/lib/api/gemini-api';

interface ChatPanelProps {
  onGenerateCode: (code: string, language: string) => void;
}

export default function ChatPanel({ onGenerateCode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [input, setInput] = useState('');
  const { streamContent, isStreaming, streamedContent, error } = useGeminiStream();
  
  const handleSendMessage = async () => {
    if (!input.trim() || isStreaming) return;
    
    const userMessage = input.trim();
    setInput('');
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      // Add placeholder for assistant message
      setMessages(prev => [...prev, { role: 'assistant', content: '...' }]);
      
      // Enhanced prompt for coding tasks
      const enhancedPrompt = `You are ErAI, a coding assistant powered by Gemini. 
Please help with the following request. If you're generating code, wrap it in triple backticks with the appropriate language identifier.
Focus on writing clean, efficient, and well-commented code.

${userMessage}`;
      
      await streamContent(enhancedPrompt, {
        temperature: 0.2,
      });
      
      // Update the assistant message with the final response
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: streamedContent
        };
        return newMessages;
      });
      
      // Check if response contains code blocks
      const codeMatch = streamedContent.match(/```(\w+)([\s\S]*?)```/);
      if (codeMatch) {
        const language = codeMatch[1];
        const code = codeMatch[2].trim();
        
        // Add a button to use this code
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: `${newMessages[newMessages.length - 1].content}\n\n[Use this code in editor]`
          };
          return newMessages;
        });
      }
    } catch (err) {
      console.error('Error in chat:', err);
      
      // Update the assistant message with the error
      setMessages(prev => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: `Error: ${err instanceof Error ? err.message : String(err)}`
        };
        return newMessages;
      });
    }
  };
  
  const handleMessageClick = (message: { role: 'user' | 'assistant'; content: string }) => {
    if (message.role !== 'assistant') return;
    
    // Check if the message contains code blocks
    const codeMatch = message.content.match(/```(\w+)([\s\S]*?)```/);
    if (codeMatch) {
      const language = codeMatch[1];
      const code = codeMatch[2].trim();
      
      // If the message contains "[Use this code in editor]" and was clicked
      if (message.content.includes('[Use this code in editor]')) {
        onGenerateCode(code, language);
      }
    }
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-3 border-b">
        <h3 className="font-medium">Chat with ErAI</h3>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-8">
            <p>Ask ErAI to help you with coding tasks</p>
            <p className="text-sm mt-2">Examples:</p>
            <ul className="text-sm mt-1 space-y-1">
              <li>"Write a function to calculate Fibonacci numbers"</li>
              <li>"Create a React component for a todo list"</li>
              <li>"Help me debug this code: [paste your code]"</li>
            </ul>
          </div>
        ) : (
          messages.map((message, index) => (
            <div 
              key={index} 
              className={`p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-100 ml-8' 
                  : 'bg-gray-100 mr-8'
              }`}
              onClick={() => handleMessageClick(message)}
            >
              <div className="font-medium mb-1">
                {message.role === 'user' ? 'You' : 'ErAI'}
              </div>
              <div className="whitespace-pre-wrap">
                {message.content === '...' && isStreaming 
                  ? streamedContent || '...' 
                  : message.content}
              </div>
              {message.content.includes('[Use this code in editor]') && (
                <div className="mt-2 text-sm text-blue-600 cursor-pointer hover:underline">
                  Click to use this code in editor
                </div>
              )}
            </div>
          ))
        )}
        
        {error && (
          <div className="p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
      </div>
      
      <div className="p-3 border-t">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask ErAI for coding help..."
            className="flex-1 p-2 border border-gray-300 rounded-l"
            disabled={isStreaming}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={isStreaming || !input.trim()}
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isStreaming ? 'Thinking...' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}
