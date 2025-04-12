import { useState } from 'react';
import { ProjectFile } from '~/lib/code/project-manager';

interface ProjectExplorerProps {
  projects: { name: string; files: ProjectFile[] }[];
  activeProject: string | null;
  onSelectProject: (projectName: string) => void;
  onSelectFile: (file: ProjectFile) => void;
  onCreateFile: (path: string, name: string) => void;
  onCreateFolder: (path: string, name: string) => void;
  onDeleteFile: (path: string) => void;
}

export default function ProjectExplorer({
  projects,
  activeProject,
  onSelectProject,
  onSelectFile,
  onCreateFile,
  onCreateFolder,
  onDeleteFile
}: ProjectExplorerProps) {
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [newItemPath, setNewItemPath] = useState<string | null>(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemType, setNewItemType] = useState<'file' | 'folder'>('file');
  
  const toggleFolder = (path: string) => {
    setExpandedFolders(prev => ({
      ...prev,
      [path]: !prev[path]
    }));
  };
  
  const handleStartNewItem = (path: string, type: 'file' | 'folder') => {
    setNewItemPath(path);
    setNewItemType(type);
    setNewItemName('');
  };
  
  const handleCreateNewItem = () => {
    if (!newItemPath || !newItemName.trim()) return;
    
    if (newItemType === 'file') {
      onCreateFile(newItemPath, newItemName);
    } else {
      onCreateFolder(newItemPath, newItemName);
    }
    
    setNewItemPath(null);
    setNewItemName('');
  };
  
  const handleCancelNewItem = () => {
    setNewItemPath(null);
    setNewItemName('');
  };
  
  const renderFileTree = (files: ProjectFile[], projectName: string, parentPath: string = '') => {
    return (
      <ul className="pl-4">
        {files.map(file => (
          <li key={file.path} className="py-1">
            {file.isDirectory ? (
              <div>
                <div className="flex items-center group">
                  <button
                    onClick={() => toggleFolder(file.path)}
                    className="mr-1 text-gray-500 hover:text-gray-700"
                  >
                    {expandedFolders[file.path] ? '▼' : '►'}
                  </button>
                  <span 
                    className="cursor-pointer hover:text-blue-600 font-medium"
                    onClick={() => toggleFolder(file.path)}
                  >
                    {file.name}
                  </span>
                  <div className="ml-auto hidden group-hover:flex">
                    <button
                      onClick={() => handleStartNewItem(file.path, 'file')}
                      className="text-xs text-gray-500 hover:text-blue-600 mr-1"
                      title="New File"
                    >
                      +F
                    </button>
                    <button
                      onClick={() => handleStartNewItem(file.path, 'folder')}
                      className="text-xs text-gray-500 hover:text-blue-600 mr-1"
                      title="New Folder"
                    >
                      +D
                    </button>
                  </div>
                </div>
                
                {expandedFolders[file.path] && file.children && (
                  renderFileTree(file.children, projectName, file.path)
                )}
                
                {expandedFolders[file.path] && newItemPath === file.path && (
                  <div className="pl-6 mt-1 flex items-center">
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder={newItemType === 'file' ? 'filename.ext' : 'folder name'}
                      className="text-sm border rounded px-1 py-0.5 w-full"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleCreateNewItem();
                        if (e.key === 'Escape') handleCancelNewItem();
                      }}
                    />
                    <button
                      onClick={handleCreateNewItem}
                      className="ml-1 text-xs text-green-600 hover:text-green-800"
                    >
                      ✓
                    </button>
                    <button
                      onClick={handleCancelNewItem}
                      className="ml-1 text-xs text-red-600 hover:text-red-800"
                    >
                      ✕
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center group pl-5">
                <span 
                  className="cursor-pointer hover:text-blue-600"
                  onClick={() => onSelectFile(file)}
                >
                  {file.name}
                </span>
                <button
                  onClick={() => onDeleteFile(file.path)}
                  className="ml-auto hidden group-hover:block text-xs text-gray-500 hover:text-red-600"
                  title="Delete File"
                >
                  ✕
                </button>
              </div>
            )}
          </li>
        ))}
        
        {newItemPath === parentPath && (
          <li className="py-1 pl-5 flex items-center">
            <input
              type="text"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              placeholder={newItemType === 'file' ? 'filename.ext' : 'folder name'}
              className="text-sm border rounded px-1 py-0.5 w-full"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleCreateNewItem();
                if (e.key === 'Escape') handleCancelNewItem();
              }}
            />
            <button
              onClick={handleCreateNewItem}
              className="ml-1 text-xs text-green-600 hover:text-green-800"
            >
              ✓
            </button>
            <button
              onClick={handleCancelNewItem}
              className="ml-1 text-xs text-red-600 hover:text-red-800"
            >
              ✕
            </button>
          </li>
        )}
      </ul>
    );
  };
  
  return (
    <div className="h-full flex flex-col bg-gray-50 border-r">
      <div className="p-3 border-b bg-white flex justify-between items-center">
        <h3 className="font-medium">Projects</h3>
        <div className="flex">
          <button
            onClick={() => handleStartNewItem('', 'file')}
            className="text-xs text-gray-500 hover:text-blue-600 mr-1"
            title="New File"
          >
            +F
          </button>
          <button
            onClick={() => handleStartNewItem('', 'folder')}
            className="text-xs text-gray-500 hover:text-blue-600"
            title="New Folder"
          >
            +D
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-2">
        {projects.length === 0 ? (
          <div className="text-center text-gray-500 mt-4">
            <p>No projects yet</p>
          </div>
        ) : (
          <div>
            {projects.map(project => (
              <div key={project.name} className="mb-4">
                <div 
                  className={`font-medium p-1 rounded cursor-pointer ${
                    activeProject === project.name ? 'bg-blue-100 text-blue-700' : 'hover:bg-gray-200'
                  }`}
                  onClick={() => onSelectProject(project.name)}
                >
                  {project.name}
                </div>
                
                {activeProject === project.name && (
                  renderFileTree(project.files, project.name)
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
