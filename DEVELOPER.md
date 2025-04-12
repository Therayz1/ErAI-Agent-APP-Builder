# ErAI Agent Developer Guide

This guide provides detailed information for developers who want to understand, modify, or extend the ErAI Agent codebase.

## Project Structure

```
erai-agent/
├── app/
│   ├── components/       # React components
│   ├── lib/              # Core functionality
│   │   ├── api/          # API integration
│   │   ├── gemini/       # Gemini API integration
│   │   ├── openrouter/   # OpenRouter API integration
│   │   ├── code/         # Code-related utilities
│   │   ├── runtime/      # Code execution environment
│   │   ├── stores/       # State management
│   │   └── hooks/        # React hooks
│   ├── routes/           # Application routes
│   ├── styles/           # Global styles
│   └── utils/            # Utility functions
├── public/               # Static assets
├── types/                # TypeScript type definitions
└── config/               # Configuration files
```

## Core Components

### AI Provider Integration

The AI integration is handled by the following files:

- `app/lib/gemini/provider.ts`: Provides the interface to the Gemini API
- `app/lib/openrouter/provider.ts`: Provides the interface to the OpenRouter API
- `app/lib/hooks/useAI.ts`: Unified hook for AI interactions
- `app/lib/hooks/useGemini.ts`: Specialized hooks for code-related tasks

The provider classes are the main entry points for API interactions. They handle:
- Model configuration
- API key management
- Content generation
- Streaming responses

### State Management

State management is handled using Zustand:

- `app/lib/stores/model-store.ts`: Manages AI model state (API keys, selected model, available models)

### Code Execution

Local code execution is handled by:

- `app/lib/runtime/local-execution.ts`: Provides a hook for executing code locally
- `app/components/CodeRunner.tsx`: UI component for code execution

### Project Management

Project and file management is handled by:

- `app/lib/code/project-manager.tsx`: Manages projects, files, and directories

## UI Components

The main UI components are:

- `app/components/Header.tsx`: Application header with status information
- `app/components/ProjectExplorer.tsx`: File and project explorer
- `app/components/CodeEditorPanel.tsx`: Code editor using Monaco Editor
- `app/components/ChatPanel.tsx`: Chat interface for interacting with AI
- `app/components/SettingsPanel.tsx`: Application settings
- `app/components/ModelSelector.tsx`: AI model selection
- `app/components/ApiKeyForm.tsx`: Form for entering API keys
- `app/components/CodeRunner.tsx`: Component for running code
- `app/components/FileManager.tsx`: Component for file operations
- `app/components/CodingAgent.tsx`: Main coding assistant component
- `app/components/TestSuite.tsx`: Test suite for validating functionality

## Routes

The application has the following routes:

- `app/routes/index.tsx`: Main application page
- `app/routes/test.tsx`: Test suite page
- `app/routes/_app.tsx`: Next.js app wrapper

## Multi-Provider Support

ErAI Agent supports multiple AI providers:

### Gemini API

- Provider: Google
- Configuration: `app/lib/gemini/provider.ts`
- API Key: Required from Google AI Studio
- Models: Gemini 1.5 Flash, Gemini 1.5 Pro, etc.

### OpenRouter API

- Provider: OpenRouter
- Configuration: `app/lib/openrouter/provider.ts`
- API Key: Required from OpenRouter
- Models: 200+ models including GPT-4, Claude, Llama, etc.

### Adding a New Provider

To add support for a new AI provider:

1. Create a new provider class in `app/lib/[provider-name]/provider.ts`
2. Implement the required methods (generateContent, streamContent)
3. Update the model store in `app/lib/stores/model-store.ts`
4. Update the useAI hook in `app/lib/hooks/useAI.ts`
5. Update the ApiKeyForm component to include the new provider

## Adding New Features

### Adding a New AI Model

To add support for a new AI model:

1. Update the appropriate provider class:
   - For Gemini: `app/lib/gemini/provider.ts`
   - For OpenRouter: `app/lib/openrouter/provider.ts`

```typescript
models: ModelInfo[] = [
  // Existing models...
  {
    name: 'new-model-name',
    label: 'New Model Display Name',
    maxTokenAllowed: 8192,
    provider: 'gemini' // or 'openrouter'
  }
];
```

### Adding a New Code Language

To add support for a new programming language:

1. Update the language detection in `app/components/CodeEditorPanel.tsx`
2. Add language-specific execution in `app/lib/runtime/local-execution.ts`
3. Update the file extension mapping in `app/components/FileManager.tsx`

### Adding a New UI Theme

To add a new UI theme:

1. Update the theme options in `app/components/SettingsPanel.tsx`
2. Add theme-specific CSS variables in `app/styles/globals.css`
3. Implement theme switching logic

## Testing

The application includes a test suite for validating functionality:

- `app/components/TestSuite.tsx`: UI for running tests
- `app/routes/test.tsx`: Test page

To add new tests:

1. Open `app/components/TestSuite.tsx`
2. Add a new test case to the `runTests` function:

```typescript
await runTest('Your test name', async () => {
  // Test implementation
  const result = await yourTestFunction();
  if (!result.includes('expected value')) {
    throw new Error('Test failed: expected value not found');
  }
  return 'Test passed successfully';
});
```

## Performance Considerations

### API Usage Optimization

To optimize API usage:

1. Use appropriate temperature settings for different tasks
2. Set reasonable token limits
3. Implement caching for common requests
4. Use streaming for better user experience

### UI Performance

For better UI performance:

1. Use React.memo for expensive components
2. Implement virtualization for large lists
3. Optimize Monaco Editor settings
4. Use efficient state management patterns

## Security Best Practices

When extending the application, follow these security best practices:

1. Never expose API keys in client-side code
2. Validate all user inputs
3. Implement proper error handling
4. Use Content Security Policy (CSP)
5. Keep dependencies updated

## Contributing Guidelines

When contributing to the project:

1. Follow the existing code style and conventions
2. Write clear, descriptive commit messages
3. Add appropriate comments for complex logic
4. Update documentation for new features
5. Add tests for new functionality

## Troubleshooting Development Issues

### Common Development Issues

#### Monaco Editor Not Loading

If Monaco Editor fails to load:

1. Check that `@monaco-editor/react` is properly installed
2. Ensure the editor container has a defined height
3. Check for console errors related to Monaco

#### API Issues

If you encounter issues with the AI APIs:

1. Verify API key permissions
2. Check for rate limiting
3. Ensure the model name is correct
4. Check network requests for detailed error messages

#### State Management Issues

If state updates aren't working as expected:

1. Use Zustand devtools to debug state
2. Check for proper state initialization
3. Verify that state updates are being triggered

## API Reference

### AI Provider Functions

```typescript
// Generate content using the selected provider
async function generateContent(
  prompt: string, 
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string>

// Stream content using the selected provider
async function streamContent(
  prompt: string,
  onPartialResponse: (text: string) => void,
  options?: {
    temperature?: number;
    maxOutputTokens?: number;
  }
): Promise<string>
```

### Code-Related Functions

```typescript
// Generate code based on a prompt
async function generateCode(prompt: string): Promise<string>

// Improve existing code
async function improveCode(code: string, instructions: string): Promise<string>

// Explain code
async function explainCode(code: string): Promise<string>

// Debug code
async function debugCode(code: string, error?: string): Promise<string>
```

### Project Management Functions

```typescript
// Create a new project
function createProject(name: string): { name: string; files: ProjectFile[] }

// Add a file to a project
function addFile(projectName: string, path: string, name: string, content?: string, language?: string): void

// Update file content
function updateFileContent(projectName: string, filePath: string, content: string): void

// Delete a file
function deleteFile(projectName: string, filePath: string): void
```

## Further Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Gemini API Documentation](https://ai.google.dev/docs/gemini_api)
- [OpenRouter API Documentation](https://openrouter.ai/docs)
- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)
