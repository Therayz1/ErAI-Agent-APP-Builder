import { useState } from 'react';
import Header from '~/components/Header';
import ProjectExplorer from '~/components/ProjectExplorer';
import CodeEditorPanel from '~/components/CodeEditorPanel';
import ChatPanel from '~/components/ChatPanel';
import SettingsPanel from '~/components/SettingsPanel';
import ApiKeyForm from '~/components/ApiKeyForm';
import { useGeminiStore } from '~/lib/stores/gemini-store';
import ProjectManager, { ProjectFile } from '~/lib/code/project-manager';

export default function Home() {
  const { apiKey } = useGeminiStore();
  const [activeTab, setActiveTab] = useState('code');
  const [selectedFile, setSelectedFile] = useState<ProjectFile | null>(null);
  
  // Project management
  const projectManager = ProjectManager();
  const { 
    projects, 
    activeProject, 
    setActiveProject, 
    getActiveProject,
    createProject,
    addFile,
    updateFileContent,
    deleteFile
  } = projectManager;
  
  // Create a default project if none exists
  useState(() => {
    if (apiKey && projects.length === 0) {
      createProject('My First Project');
    }
  });
  
  const handleSelectProject = (projectName: string) => {
    setActiveProject(projectName);
    setSelectedFile(null);
  };
  
  const handleSelectFile = (file: ProjectFile) => {
    if (!file.isDirectory) {
      setSelectedFile(file);
    }
  };
  
  const handleCreateFile = (path: string, name: string) => {
    if (activeProject) {
      addFile(activeProject, path, name);
    }
  };
  
  const handleCreateFolder = (path: string, name: string) => {
    if (activeProject) {
      addFile(activeProject, path, name, '', '');
    }
  };
  
  const handleDeleteFile = (path: string) => {
    if (activeProject) {
      deleteFile(activeProject, path);
      if (selectedFile && selectedFile.path === path) {
        setSelectedFile(null);
      }
    }
  };
  
  const handleSaveFile = (content: string) => {
    if (activeProject && selectedFile) {
      updateFileContent(activeProject, selectedFile.path, content);
      // Update selected file reference
      setSelectedFile({
        ...selectedFile,
        content
      });
    }
  };
  
  const handleGenerateCode = (code: string, language: string) => {
    if (!activeProject) return;
    
    // Create a new file with the generated code
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = language === 'javascript' ? 'js' : 
                     language === 'typescript' ? 'ts' :
                     language === 'python' ? 'py' :
                     language === 'html' ? 'html' :
                     language === 'css' ? 'css' : 'txt';
    
    const fileName = `generated-${timestamp}.${extension}`;
    addFile(activeProject, '', fileName, code, language);
    
    // Find and select the newly created file
    const project = getActiveProject();
    if (project) {
      const newFile = project.files.find(f => f.name === fileName);
      if (newFile) {
        setSelectedFile(newFile);
      }
    }
  };
  
  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <Header />
      
      {!apiKey ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md">
            <div className="flex justify-center mb-6">
              <img src="/erai-logo.png" alt="ErAI Agent Logo" className="w-32 h-32" />
            </div>
            <h2 className="text-xl font-bold mb-4 text-center">Welcome to ErAI Agent</h2>
            <p className="mb-6 text-gray-600 text-center">
              To get started, please set up your Gemini API key
            </p>
            <ApiKeyForm />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex overflow-hidden">
          {/* Left sidebar - Project Explorer */}
          <div className="w-64 flex-shrink-0">
            <ProjectExplorer 
              projects={projects}
              activeProject={activeProject}
              onSelectProject={handleSelectProject}
              onSelectFile={handleSelectFile}
              onCreateFile={handleCreateFile}
              onCreateFolder={handleCreateFolder}
              onDeleteFile={handleDeleteFile}
            />
          </div>
          
          {/* Main content area */}
          <div className="flex-1 flex overflow-hidden">
            {/* Code editor or settings area */}
            <div className="flex-1 overflow-hidden">
              {activeTab === 'code' ? (
                <CodeEditorPanel 
                  file={selectedFile}
                  onSaveFile={handleSaveFile}
                />
              ) : (
                <SettingsPanel />
              )}
            </div>
            
            {/* Right sidebar - Chat Panel */}
            <div className="w-80 flex-shrink-0 border-l">
              <div className="h-full flex">
                <div className="w-10 bg-gray-100 border-r flex flex-col">
                  <button
                    onClick={() => setActiveTab('code')}
                    className={`p-2 ${activeTab === 'code' ? 'bg-white border-l-2 border-blue-500' : 'hover:bg-gray-200'}`}
                    title="Code Editor"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setActiveTab('settings')}
                    className={`p-2 ${activeTab === 'settings' ? 'bg-white border-l-2 border-blue-500' : 'hover:bg-gray-200'}`}
                    title="Settings"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="flex-1">
                  <ChatPanel 
                    onGenerateCode={handleGenerateCode}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
