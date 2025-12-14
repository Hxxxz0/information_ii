import React, { useState } from 'react';
import { MessageCircle, Send, Bell, CheckCircle, Clock, User } from 'lucide-react';

interface Message {
  id: string;
  type: 'notification' | 'message' | 'system';
  title: string;
  content: string;
  time: string;
  read: boolean;
  sender?: string;
}

export const MessageBoardApp: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'notification',
      title: '新考试发布',
      content: '期中考试：信号处理与调制已发布，请及时查看',
      time: '2小时前',
      read: false,
    },
    {
      id: '2',
      type: 'message',
      title: '老师回复',
      content: '关于OFDM的问题，我已经在课程中详细讲解...',
      time: '5小时前',
      read: false,
      sender: '张教授',
    },
    {
      id: '3',
      type: 'system',
      title: '系统通知',
      content: '你的学习计划"14天正念计划"即将到期',
      time: '1天前',
      read: true,
    },
  ]);

  const [newMessage, setNewMessage] = useState('');

  const unreadCount = messages.filter(m => !m.read).length;

  const markAsRead = (id: string) => {
    setMessages(messages.map(m => m.id === id ? { ...m, read: true } : m));
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    const message: Message = {
      id: Date.now().toString(),
      type: 'message',
      title: '我的消息',
      content: newMessage,
      time: '刚刚',
      read: true,
      sender: '我',
    };
    setMessages([message, ...messages]);
    setNewMessage('');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'notification':
        return Bell;
      case 'message':
        return MessageCircle;
      case 'system':
        return CheckCircle;
      default:
        return MessageCircle;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'notification':
        return 'bg-amber-100 text-amber-600';
      case 'message':
        return 'bg-blue-100 text-blue-600';
      case 'system':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="h-full p-8 bg-gradient-to-br from-amber-50 to-yellow-100 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-amber-900 mb-2">留言板</h1>
            <p className="text-amber-700">查看消息和通知</p>
          </div>
          {unreadCount > 0 && (
            <div className="bg-red-500 text-white px-4 py-2 rounded-full font-bold flex items-center gap-2">
              <Bell className="w-5 h-5" />
              {unreadCount} 条未读
            </div>
          )}
        </div>

        {/* Send Message */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-amber-200 mb-6">
          <div className="flex gap-3">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="发送消息..."
              className="flex-1 px-4 py-2 rounded-xl border border-amber-200 focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              onClick={sendMessage}
              className="px-6 py-2 bg-amber-500 text-white rounded-xl font-bold hover:bg-amber-600 transition-colors flex items-center gap-2"
            >
              <Send className="w-5 h-5" />
              发送
            </button>
          </div>
        </div>

        {/* Messages List */}
        <div className="space-y-4">
          {messages.map((message) => {
            const Icon = getIcon(message.type);
            const colorClass = getColor(message.type);
            return (
              <div
                key={message.id}
                className={`bg-white/90 backdrop-blur-sm rounded-2xl p-5 shadow-md border transition-all cursor-pointer ${
                  message.read ? 'border-amber-200' : 'border-amber-400 ring-2 ring-amber-300'
                }`}
                onClick={() => !message.read && markAsRead(message.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${colorClass} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-800">{message.title}</h3>
                        {!message.read && (
                          <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-500">
                        <Clock className="w-4 h-4" />
                        <span>{message.time}</span>
                      </div>
                    </div>
                    {message.sender && (
                      <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                        <User className="w-4 h-4" />
                        <span>{message.sender}</span>
                      </div>
                    )}
                    <p className="text-slate-600">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {messages.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-300" />
            <p className="text-lg">还没有消息</p>
          </div>
        )}
      </div>
    </div>
  );
};

