import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Calendar, Clock, Trash2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  dueDate?: string;
  time?: string;
}

export const PlanApp: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: '完成OFDM章节学习', completed: false, dueDate: '2024-12-25', time: '14:00' },
    { id: '2', title: '复习采样定理', completed: true, dueDate: '2024-12-24', time: '10:00' },
    { id: '3', title: '完成MIMO练习题', completed: false, dueDate: '2024-12-26', time: '16:00' },
  ]);
  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
    };
    setTasks([...tasks, task]);
    setNewTask('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-emerald-50 to-green-100 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-black text-emerald-900 mb-2">学习计划</h1>
          <p className="text-emerald-700">管理你的学习任务和目标</p>
        </div>

        {/* Add Task */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 mb-6 shadow-lg border border-emerald-200">
          <div className="flex gap-3">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addTask()}
              placeholder="添加新任务..."
              className="flex-1 px-4 py-2 rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-400"
            />
            <button
              onClick={addTask}
              className="px-6 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              添加
            </button>
          </div>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md border transition-all ${
                task.completed ? 'border-emerald-300 opacity-75' : 'border-emerald-200'
              }`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => toggleTask(task.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-emerald-400" />
                  )}
                </button>
                <div className="flex-1">
                  <h3
                    className={`font-bold text-lg mb-2 ${
                      task.completed ? 'line-through text-slate-400' : 'text-slate-800'
                    }`}
                  >
                    {task.title}
                  </h3>
                  {task.dueDate && (
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>{task.dueDate}</span>
                      </div>
                      {task.time && (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-lg">还没有任务，添加一个开始吧！</p>
          </div>
        )}
      </div>
    </div>
  );
};

