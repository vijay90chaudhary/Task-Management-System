import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getTasks, 
  createTask, 
  updateTask, 
  deleteTask, 
  getProjectMembers, 
  addMember 
} from '../api';
import { useAuth } from '../context/AuthContext';
import { 
  Plus, 
  Users, 
  Calendar, 
  MoreVertical, 
  Trash2, 
  Edit2, 
  Clock, 
  UserPlus,
  Loader2,
  X,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'TO DO',
    priority: 'MEDIUM',
    dueDate: '',
    assignedTo: '',
    project: id
  });

  const fetchData = async () => {
    try {
      const [tasksRes, membersRes] = await Promise.all([
        getTasks(id),
        getProjectMembers(id)
      ]);
      setTasks(tasksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error(err);
      // If project not found or access denied
      // navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await createTask(newTask);
      setShowTaskModal(false);
      setNewTask({
        title: '',
        description: '',
        status: 'TO DO',
        priority: 'MEDIUM',
        dueDate: '',
        assignedTo: '',
        project: id
      });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatus = async (taskId, newStatus) => {
    try {
      await updateTask(taskId, { status: newStatus });
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await deleteTask(taskId);
        fetchData();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAddMember = async (e) => {
    e.preventDefault();
    try {
      await addMember(id, memberEmail);
      setShowMemberModal(false);
      setMemberEmail('');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to add member');
    }
  };

  const statuses = ['TO DO', 'IN PROGRESS', 'DONE'];

  if (loading) return <div className="flex h-96 items-center justify-center"><Loader2 className="animate-spin text-primary-500" size={32} /></div>;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Project Board</h1>
          <div className="flex items-center space-x-4 mt-2">
            <button 
              onClick={() => setShowMemberModal(true)}
              className="flex items-center space-x-1 text-sm text-gray-400 hover:text-white transition-colors"
            >
              <Users size={16} />
              <span>{members.length} Members</span>
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          {user?.role === 'ADMIN' && (
            <button 
              onClick={() => setShowMemberModal(true)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg flex items-center space-x-2 transition-colors"
            >
              <UserPlus size={18} />
              <span>Add Member</span>
            </button>
          )}
          <button 
            onClick={() => setShowTaskModal(true)}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-500 text-white rounded-lg flex items-center space-x-2 transition-colors shadow-lg shadow-primary-900/20"
          >
            <Plus size={18} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {statuses.map(status => (
          <div key={status} className="bg-slate-900/50 rounded-2xl p-4 border border-slate-800 min-h-[500px]">
            <div className="flex items-center justify-between mb-6 px-2">
              <h3 className="font-bold text-gray-300 flex items-center space-x-2">
                <span>{status}</span>
                <span className="bg-slate-800 text-xs px-2 py-0.5 rounded-full text-gray-500">
                  {tasks.filter(t => t.status === status).length}
                </span>
              </h3>
            </div>

            <div className="space-y-4">
              {tasks.filter(t => t.status === status).map(task => (
                <motion.div
                  key={task._id}
                  layoutId={task._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="glass-card p-4 rounded-xl border border-slate-800 hover:border-slate-700 transition-all group"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                      task.priority === 'HIGH' ? 'bg-rose-500/10 text-rose-500' :
                      task.priority === 'MEDIUM' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {task.priority}
                    </span>
                    <div className="flex items-center space-x-1">
                      {status !== 'DONE' && (
                        <button 
                          onClick={() => handleUpdateStatus(task._id, status === 'TO DO' ? 'IN PROGRESS' : 'DONE')}
                          className="p-1 text-gray-500 hover:text-emerald-400 transition-colors"
                          title="Advance Status"
                        >
                          <CheckCircle2 size={16} />
                        </button>
                      )}
                      {(user?.role === 'ADMIN' || task.createdBy?._id === user?._id) && (
                        <button 
                          onClick={() => handleDeleteTask(task._id)}
                          className="p-1 text-gray-500 hover:text-rose-400 transition-colors"
                          title="Delete Task"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  <h4 className="font-bold text-gray-100 mb-1 group-hover:text-primary-400 transition-colors">
                    {task.title}
                  </h4>
                  <p className="text-gray-400 text-xs mb-4 line-clamp-2">
                    {task.description}
                  </p>

                  <div className="flex items-center justify-between border-t border-slate-800 pt-3">
                    <div className="flex items-center space-x-1.5 text-gray-500 text-[11px]">
                      <Calendar size={12} />
                      <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                    {task.assignedTo && (
                      <div className="flex items-center space-x-1.5">
                        <div className="w-5 h-5 bg-primary-600 rounded-full flex items-center justify-center text-[10px] font-bold">
                          {task.assignedTo.name.charAt(0)}
                        </div>
                        <span className="text-[11px] text-gray-400">{task.assignedTo.name.split(' ')[0]}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {tasks.filter(t => t.status === status).length === 0 && (
                <div className="text-center py-8 border-2 border-dashed border-slate-800 rounded-xl">
                  <p className="text-gray-600 text-sm italic">Empty</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <AnimatePresence>
        {showTaskModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowTaskModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-lg p-8 rounded-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Add New Task</h2>
                <button onClick={() => setShowTaskModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>
              
              <form onSubmit={handleCreateTask} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Title</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="Task name"
                    value={newTask.title}
                    onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                    placeholder="What needs to be done?"
                    value={newTask.description}
                    onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Priority</label>
                    <select
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                      value={newTask.priority}
                      onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                    >
                      <option value="LOW">Low</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="HIGH">High</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Due Date</label>
                    <input
                      type="date"
                      required
                      className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Assign To</label>
                  <select
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors"
                    value={newTask.assignedTo}
                    onChange={(e) => setNewTask({...newTask, assignedTo: e.target.value})}
                  >
                    <option value="">Unassigned</option>
                    {members.map(member => (
                      <option key={member._id} value={member._id}>{member.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="flex space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-primary-900/20"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Member Modal */}
      <AnimatePresence>
        {showMemberModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowMemberModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="glass-card w-full max-w-md p-8 rounded-2xl relative z-10"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Project Members</h2>
                <button onClick={() => setShowMemberModal(false)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-8">
                {members.map(member => (
                  <div key={member._id} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/30">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center font-bold">
                        {member.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{member.name}</p>
                        <p className="text-xs text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-700 text-gray-400 uppercase">
                      {member.role}
                    </span>
                  </div>
                ))}
              </div>
              
              {user?.role === 'ADMIN' && (
                <form onSubmit={handleAddMember} className="space-y-4">
                  <label className="block text-sm font-medium text-gray-300">Add New Member</label>
                  <div className="flex space-x-2">
                    <input
                      type="email"
                      required
                      className="flex-1 bg-slate-800/50 border border-slate-700 rounded-lg py-2 px-4 focus:outline-none focus:border-primary-500 transition-colors text-sm"
                      placeholder="User's email"
                      value={memberEmail}
                      onChange={(e) => setMemberEmail(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-lg transition-colors"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetail;
