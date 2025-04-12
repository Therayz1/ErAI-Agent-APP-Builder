# ErAI Agent

<div align="center">
  <img src="public/erai-logo.png" alt="ErAI Agent Logo" width="200"/>
</div>

ErAI Agent is a powerful coding assistant powered by Google's Gemini API and OpenRouter API. It helps you write, improve, debug, and document code with the help of AI, with access to 200+ AI models.

![ErAI Agent](https://github.com/yourusername/erai-agent/raw/main/public/erai-agent-screenshot.png)

## Features

- **AI-Powered Code Generation**: Generate code in multiple languages using natural language prompts
- **Code Improvement**: Get suggestions to improve your existing code
- **Code Explanation**: Understand complex code with detailed explanations
- **Debugging Assistance**: Find and fix bugs in your code
- **Test Generation**: Automatically generate unit tests for your code
- **Documentation Generation**: Create documentation for your code
- **Local Code Execution**: Run your code directly in the browser
- **Project Management**: Organize your code in projects and files
- **Multiple Language Support**: JavaScript, TypeScript, Python, HTML, CSS, and more
- **Multi-Provider Support**: Use Google's Gemini API or OpenRouter API
- **200+ AI Models**: Access over 200 AI models through OpenRouter including GPT-4, Claude, Llama, and more

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A Gemini API key (get one from [Google AI Studio](https://aistudio.google.com/app/apikey))
- An OpenRouter API key (optional, get one from [OpenRouter](https://openrouter.ai/keys))

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/erai-agent.git
cd erai-agent
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

5. Enter your Gemini API key or OpenRouter API key when prompted

## Usage

### API Key Setup

1. When you first open ErAI Agent, you'll be prompted to enter an API key
2. You can choose between Gemini API or OpenRouter API
3. For Gemini API, get a key from [Google AI Studio](https://aistudio.google.com/app/apikey)
4. For OpenRouter API, get a key from [OpenRouter](https://openrouter.ai/keys)
5. Enter your key and click "Save"

### Model Selection

1. Click the "Settings" tab
2. Go to "API Settings"
3. Choose from 200+ available models:
   - Gemini models (Google's AI models)
   - OpenRouter models (GPT-4, Claude, Llama, and more)
4. Use the search box to find specific models
5. Filter models by provider (All, Gemini, OpenRouter)

### Code Generation

1. Type a description of the code you want to generate in the prompt field
2. Click "Generate Code" or press Enter
3. The generated code will appear in the editor
4. You can modify the code as needed
5. Click "Run Code" to execute the code locally

### Code Improvement

1. Enter or paste your code in the editor
2. Click the "Improve" tab
3. Describe how you want to improve the code
4. Click "Improve Code"
5. The improved code will appear in the editor

### Code Explanation

1. Enter or paste the code you want to understand in the editor
2. Click the "Explain" tab
3. Click "Explain Code"
4. A detailed explanation will appear in the output panel

### Debugging

1. Enter or paste the code with bugs in the editor
2. Click the "Debug" tab
3. Optionally describe the error you're experiencing
4. Click "Debug Code"
5. The debugged code and explanation will appear

### Project Management

1. Use the project explorer on the left to create and manage projects
2. Create new files and folders using the "+" buttons
3. Click on files to open them in the editor
4. Save changes using the "Save" button

### Chat with ErAI

1. Use the chat panel on the right to ask questions about coding
2. ErAI will respond with helpful information and code examples
3. Click "Use this code in editor" to transfer code from chat to the editor

## Configuration

### API Settings

1. Click the "Settings" tab
2. Go to "API Settings"
3. Update your API keys if needed
4. Select a different AI model based on your needs
5. Adjust temperature to control creativity vs. precision

### Editor Settings

1. Click the "Settings" tab
2. Go to "Editor"
3. Adjust font size, tab size, and word wrap settings

## Local Execution

ErAI Agent supports local execution of code in the following languages:

- JavaScript/TypeScript: Executed in a sandboxed environment
- Python: Simulated execution (full Python support requires additional setup)
- HTML: Rendered in a virtual DOM
- CSS: Applied to HTML preview

## Deployment

### Local Deployment

To build and run ErAI Agent locally:

```bash
npm run build
npm start
```

### Server Deployment

To deploy ErAI Agent to a server:

1. Build the application:

```bash
npm run build
```

2. Deploy the `.next` folder to your hosting provider

3. Set up environment variables for your API keys

### Docker Deployment

A Dockerfile is provided for containerized deployment:

```bash
docker build -t erai-agent .
docker run -p 3000:3000 erai-agent
```

## Architecture

ErAI Agent is built with a modern tech stack:

- **Next.js**: React framework for the frontend
- **TypeScript**: Type-safe JavaScript
- **Gemini API**: Google's generative AI model
- **OpenRouter API**: Gateway to 200+ AI models
- **Monaco Editor**: Code editor used by VS Code
- **Zustand**: State management
- **TailwindCSS**: Utility-first CSS framework

The application is structured as follows:

- `app/`: Main application code
  - `components/`: React components
  - `lib/`: Core functionality
    - `api/`: API integration
    - `gemini/`: Gemini API integration
    - `openrouter/`: OpenRouter API integration
    - `code/`: Code-related utilities
    - `runtime/`: Code execution environment
    - `stores/`: State management
  - `routes/`: Application routes
  - `styles/`: Global styles
  - `utils/`: Utility functions
- `public/`: Static assets
- `types/`: TypeScript type definitions
- `config/`: Configuration files

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Inspired by [bolt.diy](https://github.com/stackblitz-labs/bolt.diy) from StackBlitz Labs
- Powered by Google's Gemini API and OpenRouter API
