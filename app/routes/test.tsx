import { useState } from 'react';
import Header from '~/components/Header';
import TestSuite from '~/components/TestSuite';
import ApiKeyForm from '~/components/ApiKeyForm';
import { useGeminiStore } from '~/lib/stores/gemini-store';

export default function TestPage() {
  const { apiKey } = useGeminiStore();
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      {!apiKey ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 text-center">ErAI Agent Test Suite</h2>
            <p className="mb-6 text-gray-600 text-center">
              To run tests, please set up your Gemini API key first
            </p>
            <ApiKeyForm />
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          <TestSuite />
        </div>
      )}
    </div>
  );
}
