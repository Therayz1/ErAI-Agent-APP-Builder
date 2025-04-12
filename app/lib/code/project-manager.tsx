import { useState, useEffect } from 'react';
import { useGeminiStore } from '~/lib/stores/gemini-store';

// Interface for project structure
export interface ProjectFile {
  name: string;
  path: string;
  content: string;
  language: string;
  isDirectory: boolean;
  children?: ProjectFile[];
}

export default function ProjectManager() {
  const [projects, setProjects] = useState<{ name: string; files: ProjectFile[] }[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { apiKey } = useGeminiStore();
  
  // Initialize with sample project
  useEffect(() => {
    if (apiKey && projects.length === 0) {
      // Create a sample project structure
      const sampleProject = {
        name: 'Sample Project',
        files: [
          {
            name: 'src',
            path: '/src',
            content: '',
            language: '',
            isDirectory: true,
            children: [
              {
                name: 'index.js',
                path: '/src/index.js',
                content: '// Main entry point\nconsole.log("Hello from ErAI Agent!");',
                language: 'javascript',
                isDirectory: false
              },
              {
                name: 'styles.css',
                path: '/src/styles.css',
                content: 'body {\n  font-family: sans-serif;\n  margin: 0;\n  padding: 20px;\n}',
                language: 'css',
                isDirectory: false
              }
            ]
          },
          {
            name: 'README.md',
            path: '/README.md',
            content: '# Sample Project\n\nThis is a sample project created by ErAI Agent.',
            language: 'markdown',
            isDirectory: false
          }
        ]
      };
      
      setProjects([sampleProject]);
      setActiveProject(sampleProject.name);
    }
  }, [apiKey, projects.length]);
  
  // Create a new project
  const createProject = (name: string) => {
    const newProject = {
      name,
      files: [
        {
          name: 'README.md',
          path: '/README.md',
          content: `# ${name}\n\nProject created by ErAI Agent.`,
          language: 'markdown',
          isDirectory: false
        }
      ]
    };
    
    setProjects([...projects, newProject]);
    setActiveProject(name);
    return newProject;
  };
  
  // Get active project
  const getActiveProject = () => {
    if (!activeProject) return null;
    return projects.find(p => p.name === activeProject) || null;
  };
  
  // Add file to project
  const addFile = (projectName: string, path: string, name: string, content: string = '', language: string = 'text') => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.name !== projectName) return project;
        
        const newFile: ProjectFile = {
          name,
          path: `${path}/${name}`,
          content,
          language,
          isDirectory: false
        };
        
        // Helper function to add file to the correct directory
        const addFileToDirectory = (files: ProjectFile[]): ProjectFile[] => {
          return files.map(file => {
            if (file.isDirectory && path.startsWith(file.path)) {
              return {
                ...file,
                children: file.children ? addFileToDirectory(file.children) : [newFile]
              };
            }
            return file;
          });
        };
        
        // If path is root, add directly to project files
        if (path === '') {
          return {
            ...project,
            files: [...project.files, newFile]
          };
        }
        
        // Otherwise, find the correct directory and add the file
        return {
          ...project,
          files: addFileToDirectory(project.files)
        };
      });
    });
  };
  
  // Update file content
  const updateFileContent = (projectName: string, filePath: string, content: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.name !== projectName) return project;
        
        // Helper function to update file content
        const updateContent = (files: ProjectFile[]): ProjectFile[] => {
          return files.map(file => {
            if (file.path === filePath) {
              return {
                ...file,
                content
              };
            }
            
            if (file.isDirectory && file.children) {
              return {
                ...file,
                children: updateContent(file.children)
              };
            }
            
            return file;
          });
        };
        
        return {
          ...project,
          files: updateContent(project.files)
        };
      });
    });
  };
  
  // Delete file
  const deleteFile = (projectName: string, filePath: string) => {
    setProjects(prevProjects => {
      return prevProjects.map(project => {
        if (project.name !== projectName) return project;
        
        // Helper function to delete file
        const removeFile = (files: ProjectFile[]): ProjectFile[] => {
          return files.filter(file => {
            if (file.path === filePath) return false;
            
            if (file.isDirectory && file.children) {
              file.children = removeFile(file.children);
            }
            
            return true;
          });
        };
        
        return {
          ...project,
          files: removeFile(project.files)
        };
      });
    });
  };
  
  return {
    projects,
    activeProject,
    setActiveProject,
    getActiveProject,
    createProject,
    addFile,
    updateFileContent,
    deleteFile,
    isLoading
  };
}
