import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, FolderKanban, LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold tracking-tight text-primary-400 neon-text">
          Syncro<span className="text-white">Task</span>
        </Link>

        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors">
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>
          <Link to="/projects" className="flex items-center space-x-2 text-gray-300 hover:text-primary-400 transition-colors">
            <FolderKanban size={20} />
            <span>Projects</span>
          </Link>
          
          <div className="flex items-center space-x-4 border-l border-gray-700 pl-8">
            <div className="flex items-center space-x-2">
              <div className="bg-primary-600 p-2 rounded-full">
                <User size={16} />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs text-gray-400">{user?.role}</p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-gray-400 hover:text-red-400 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
