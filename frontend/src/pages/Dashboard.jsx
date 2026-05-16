import { useState, useEffect } from 'react';
import { getDashboardStats } from '../api';
import { 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Layers, 
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await getDashboardStats();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return (
    <div className="flex h-96 items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>
  );

  const statCards = [
    { 
      title: 'Total Tasks', 
      value: stats?.totalTasks || 0, 
      icon: <Layers className="text-blue-400" />, 
      color: 'blue' 
    },
    { 
      title: 'In Progress', 
      value: stats?.tasksByStatus?.['IN PROGRESS'] || 0, 
      icon: <Clock className="text-amber-400" />, 
      color: 'amber' 
    },
    { 
      title: 'Completed', 
      value: stats?.tasksByStatus?.['DONE'] || 0, 
      icon: <CheckCircle2 className="text-emerald-400" />, 
      color: 'emerald' 
    },
    { 
      title: 'Overdue', 
      value: stats?.overdueTasks || 0, 
      icon: <AlertCircle className="text-rose-400" />, 
      color: 'rose' 
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <p className="text-gray-400">Track your team's progress and performance.</p>
        </div>
        <div className="bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-lg flex items-center space-x-2">
          <TrendingUp size={18} className="text-primary-400" />
          <span className="text-primary-400 font-medium">Updated just now</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-6 rounded-xl hover:border-primary-500/30 transition-colors group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm font-medium">{card.title}</p>
                <h3 className="text-3xl font-bold mt-1 group-hover:neon-text transition-all">{card.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-${card.color}-500/10`}>
                {card.icon}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass-card p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold flex items-center space-x-2">
              <BarChart3 className="text-primary-400" size={20} />
              <span>Tasks by Status</span>
            </h3>
          </div>
          <div className="space-y-4">
            {Object.entries(stats?.tasksByStatus || {}).map(([status, count]) => {
              const percentage = stats?.totalTasks > 0 ? (count / stats.totalTasks) * 100 : 0;
              return (
                <div key={status} className="space-y-1.5">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-300">{status}</span>
                    <span className="font-medium">{count}</span>
                  </div>
                  <div className="w-full bg-slate-800 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        status === 'DONE' ? 'bg-emerald-500' : 
                        status === 'IN PROGRESS' ? 'bg-amber-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="glass-card p-6 rounded-2xl flex flex-col justify-center items-center text-center">
          <div className="bg-primary-500/20 p-4 rounded-full mb-4">
            <Layers className="text-primary-400" size={32} />
          </div>
          <h3 className="text-xl font-bold mb-2">Projects Insight</h3>
          <p className="text-gray-400 mb-6">You are currently managing or participating in {stats?.projectCount || 0} active projects.</p>
          <button className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-2 rounded-lg transition-colors border border-slate-700">
            View All Projects
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
