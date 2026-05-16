import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProjects, createProject } from '../api';
import { useAuth } from '../context/AuthContext';
import { Plus, Folder, Users, ChevronRight, Loader2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  const fetchProjects = async () => {
    try {
      const { data } = await getProjects();
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProject(newProject);
      setShowModal(false);
      setNewProject({ name: '', description: '' });
      fetchProjects();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-gray-400">Manage and organize your team workspaces.</p>
        </div>
        {user?.role === 'ADMIN' && (
          <button 
            onClick={() => setShowModal(true)}
            className="bg-primary-600 hover:bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-all shadow-lg shadow-primary-900/20"
          >
            <Plus size={20} />
            <span>New Project</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link 
              to={`/projects/${project._id}`}
              className="glass-card p-6 rounded-xl block hover:border-primary-500/50 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Folder size={80} />
              </div>
              
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-primary-500/20 p-2 rounded-lg">
                  <Folder className="text-primary-400" size={24} />
                </div>
                <h3 className="text-xl font-bold truncate pr-8">{project.name}</h3>
              </div>
              
              <p className="text-gray-400 text-sm mb-6 line-clamp-2 h-10">
                {project.description}
              </p>
              
              <div className="flex items-center justify-between border-t border-slate-800 pt-4 mt-auto">
                <div className="flex items-center space-x-2 text-xs text-gray-400">
                  <Users size={14} />
                  <span>{project.members?.length || 0} Members</span>
                </div>
                <div className="text-primary-400 flex items-center space-x-1 text-sm font-medium">
                  <span>View Details</span>
                  <ChevronRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-20 glass-card rounded-2xl">
          <Folder size={48} className="mx-auto text-gray-600 mb-4" />
          <h2 className="text-xl font-bold">No projects found</h2>
          <p className="text-gray-400 mt-2">Get started by creating your first project.</p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg p-8 rounded-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Create New Project</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Project Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="e.g. Website Redesign"
                    value={newProject.name}
                    onChange={(e) => setNewProject({...newProject, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                  <textarea
                    required
                    rows="4"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2.5 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Describe the project goals..."
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  />
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold px-6 py-3 rounded-lg transition-all flex items-center justify-center space-x-2 shadow-lg shadow-primary-900/20"
                  >
                    {submitting ? <Loader2 className="animate-spin" /> : <span>Create Project</span>}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Projects;
