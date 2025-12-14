import React, { useState } from 'react';
import { CheckCircle2, Circle, Plus, Calendar, Clock, Trash2, Edit2, Save, X } from 'lucide-react';

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
  const [newTaskDate, setNewTaskDate] = useState('');
  const [newTaskTime, setNewTaskTime] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const addTask = () => {
    if (!newTask.trim()) return;
    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      completed: false,
      dueDate: newTaskDate || undefined,
      time: newTaskTime || undefined,
    };
    setTasks([...tasks, task]);
    setNewTask('');
    setNewTaskDate('');
    setNewTaskTime('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditTitle(task.title);
    setEditDate(task.dueDate || '');
    setEditTime(task.time || '');
  };

  const saveEdit = () => {
    if (!editingId) return;
    if (!editTitle.trim()) {
      alert('任务标题不能为空');
      return;
    }
    setTasks(tasks.map(t => 
      t.id === editingId 
        ? { ...t, title: editTitle.trim(), dueDate: editDate || undefined, time: editTime || undefined }
        : t
    ));
    setEditingId(null);
    setEditTitle('');
    setEditDate('');
    setEditTime('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle('');
    setEditDate('');
    setEditTime('');
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
          <div className="space-y-3">
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
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <Calendar className="w-4 h-4 text-emerald-600" />
                <input
                  type="date"
                  value={newTaskDate}
                  onChange={(e) => setNewTaskDate(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700"
                  placeholder="选择日期"
                />
              </div>
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                <Clock className="w-4 h-4 text-emerald-600" />
                <input
                  type="time"
                  value={newTaskTime}
                  onChange={(e) => setNewTaskTime(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700"
                  placeholder="选择时间"
                />
              </div>
            </div>
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
              {editingId === task.id ? (
                // Edit Mode
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2 rounded-xl border border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-400 font-bold text-lg"
                    placeholder="任务标题"
                    autoFocus
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      <Calendar className="w-4 h-4 text-emerald-600" />
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700"
                      />
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 rounded-xl border border-emerald-200">
                      <Clock className="w-4 h-4 text-emerald-600" />
                      <input
                        type="time"
                        value={editTime}
                        onChange={(e) => setEditTime(e.target.value)}
                        className="flex-1 bg-transparent border-none focus:outline-none text-sm text-slate-700"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <button
                      onClick={cancelEdit}
                      className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      取消
                    </button>
                    <button
                      onClick={saveEdit}
                      className="px-4 py-2 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      保存
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
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
                    <div className="flex items-center gap-4 text-sm text-slate-500">
                      {task.dueDate ? (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>{task.dueDate}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Calendar className="w-4 h-4" />
                          <span>未设置日期</span>
                        </div>
                      )}
                      {task.time ? (
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{task.time}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-slate-300">
                          <Clock className="w-4 h-4" />
                          <span>未设置时间</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => startEdit(task)}
                      className="p-2 hover:bg-emerald-50 rounded-lg text-emerald-400 hover:text-emerald-600 transition-colors"
                      title="编辑任务"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="p-2 hover:bg-red-50 rounded-lg text-red-400 hover:text-red-600 transition-colors"
                      title="删除任务"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
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

