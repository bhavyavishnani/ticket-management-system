import { AlertTriangle, Calendar, CheckCircle2, Clock, Edit, MoreVertical, Pause, Play, Trash2, User } from 'lucide-react';
import { useState } from 'react';

const TicketCard = ({ ticket, onUpdate, onDelete }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: ticket.title,
    description: ticket.description,
    assignee: ticket.assignee || '',
    priority: ticket.priority,
    dueDate: ticket.dueDate ? ticket.dueDate.split('T')[0] : ''
  });

  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      medium: 'bg-amber-50 text-amber-700 border-amber-200',
      high: 'bg-orange-50 text-orange-700 border-orange-200',
      critical: 'bg-red-50 text-red-700 border-red-200'
    };
    return colors[priority] || colors.medium;
  };

  const getPriorityIcon = (priority) => {
    if (priority === 'critical' || priority === 'high') {
      return <AlertTriangle className="w-3 h-3" />;
    }
    return null;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays > 0) return `${diffDays} days left`;
    return `${Math.abs(diffDays)} days overdue`;
  };

  const isOverdue = (dateString) => {
    if (!dateString) return false;
    return new Date(dateString) < new Date();
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', ticket.id.toString());
  };

  const handleStatusChange = (newStatus) => {
    onUpdate(ticket.id, { status: newStatus });
    setShowDropdown(false);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setShowDropdown(false);
  };

  const handleSaveEdit = () => {
    onUpdate(ticket.id, {
      ...editData,
      dueDate: editData.dueDate ? new Date(editData.dueDate).toISOString() : null
    });
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditData({
      title: ticket.title,
      description: ticket.description,
      assignee: ticket.assignee || '',
      priority: ticket.priority,
      dueDate: ticket.dueDate ? ticket.dueDate.split('T')[0] : ''
    });
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this ticket?')) {
      onDelete(ticket.id);
    }
    setShowDropdown(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] p-7 space-y-4 overflow-hidden">
        <input
          type="text"
          value={editData.title}
          onChange={(e) => setEditData({ ...editData, title: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Ticket title..."
        />
        
        <textarea
          value={editData.description}
          onChange={(e) => setEditData({ ...editData, description: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Description..."
          rows="3"
        />
        
        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={editData.assignee}
            onChange={(e) => setEditData({ ...editData, assignee: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Assignee..."
          />
          
          <select
            value={editData.priority}
            onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        
        <input
          type="date"
          value={editData.dueDate}
          onChange={(e) => setEditData({ ...editData, dueDate: e.target.value })}
          className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
        />
        
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleSaveEdit}
            className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white transition-all shadow-sm"
          >
            Save
          </button>
          <button
            onClick={handleCancelEdit}
            className="flex-1 px-6 py-3 rounded-xl text-sm font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="bg-white/95 backdrop-blur-sm rounded-3xl border border-slate-200/60 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.08)] hover:shadow-[0_8px_40px_-8px_rgba(0,0,0,0.12)] cursor-move hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 ease-out group relative overflow-hidden"
      draggable
      onDragStart={handleDragStart}
    >
      {/* Priority accent */}
      <div className={`h-2 w-full rounded-t-3xl ${
        ticket.priority === 'critical' ? 'bg-gradient-to-r from-red-500 to-red-600' :
        ticket.priority === 'high' ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
        ticket.priority === 'medium' ? 'bg-gradient-to-r from-amber-500 to-amber-600' :
        'bg-gradient-to-r from-emerald-500 to-emerald-600'
      }`} />
      
      <div className="p-7">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className={`px-3 py-1.5 rounded-full text-xs font-semibold border flex items-center gap-1.5 ${getPriorityColor(ticket.priority)}`}>
            {getPriorityIcon(ticket.priority)}
            {ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1)}
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="p-2.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-slate-100/80 backdrop-blur-sm"
            >
              <MoreVertical className="w-4 h-4 text-slate-600" />
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 top-12 bg-white/95 backdrop-blur-lg border border-slate-200/60 rounded-2xl py-3 min-w-[170px] shadow-[0_10px_40px_-8px_rgba(0,0,0,0.15)] z-20">
                {ticket.status !== 'in-progress' && (
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50/80 rounded-xl mx-2 transition-all duration-200 flex items-center gap-3 text-slate-700"
                  >
                    <Play className="w-4 h-4" />
                    Start Progress
                  </button>
                )}
                {ticket.status !== 'resolved' && (
                  <button
                    onClick={() => handleStatusChange('resolved')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50/80 rounded-xl mx-2 transition-all duration-200 flex items-center gap-3 text-slate-700"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Mark Resolved
                  </button>
                )}
                {ticket.status !== 'open' && (
                  <button
                    onClick={() => handleStatusChange('open')}
                    className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50/80 rounded-xl mx-2 transition-all duration-200 flex items-center gap-3 text-slate-700"
                  >
                    <Pause className="w-4 h-4" />
                    Reopen
                  </button>
                )}
                <div className="my-1 border-t border-slate-200" />
                <button
                  onClick={handleEdit}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50/80 rounded-xl mx-2 transition-all duration-200 flex items-center gap-3 text-slate-700"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full px-4 py-3 text-left text-sm hover:bg-red-50/80 rounded-xl mx-2 transition-all duration-200 flex items-center gap-3 text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Title */}
        <h4 className="font-semibold text-slate-900 mb-3 line-clamp-2 leading-snug">
          {ticket.title}
        </h4>

        {/* Description */}
        {ticket.description && (
          <p className="text-sm text-slate-600 mb-5 line-clamp-3 leading-relaxed">
            {ticket.description}
          </p>
        )}

        {/* Footer */}
        <div className="space-y-3">
          {/* Assignee */}
          {ticket.assignee && (
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-slate-500" />
              <span className="text-slate-700 font-medium">{ticket.assignee}</span>
            </div>
          )}
          
          {/* Due Date */}
          {ticket.dueDate && (
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4 text-slate-500" />
              <span className={`font-medium ${isOverdue(ticket.dueDate) ? 'text-red-600' : 'text-slate-700'}`}>
                {formatDate(ticket.dueDate)}
              </span>
            </div>
          )}
          
          {/* Created Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500 pt-2 border-t border-slate-100">
            <Clock className="w-3 h-3" />
            <span>Created {new Date(ticket.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Drag Indicator */}
      <div className="absolute top-5 left-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
        <div className="w-1.5 h-10 bg-gradient-to-b from-blue-500 via-purple-500 to-indigo-600 rounded-r-2xl shadow-lg"></div>
      </div>
    </div>
  );
};

export default TicketCard;