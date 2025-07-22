import { AlertTriangle, Archive, Clock, Lock, X } from 'lucide-react';
import { useState } from 'react';
import '../styles/glass.css';
import TicketCard from './TicketCard';

const TicketColumn = ({
    title,
    tickets,
    status,
    onUpdateTicket,
    onDeleteTicket,
    onEditTicket,
    icon,
    color,
    isRestricted = false,
    description
}) => {
    const getColorClasses = (color) => {
        const colors = {
            yellow: {
                header: 'bg-yellow-100/80 text-yellow-800 border-yellow-200/50',
                count: 'bg-yellow-200/80 text-yellow-900',
                accent: 'border-l-yellow-500',
                glow: 'shadow-yellow-500/20'
            },
            blue: {
                header: 'bg-blue-100/80 text-blue-800 border-blue-200/50',
                count: 'bg-blue-200/80 text-blue-900',
                accent: 'border-l-blue-500',
                glow: 'shadow-blue-500/20'
            },
            orange: {
                header: 'bg-orange-100/80 text-orange-800 border-orange-200/50',
                count: 'bg-orange- pinching-200/80 text-orange-900',
                accent: 'border-l-orange-500',
                glow: 'shadow-orange-500/20'
            },
            green: {
                header: 'bg-green-100/80 text-green-800 border-green-200/50',
                count: 'bg-green-200/80 text-green-900',
                accent: 'border-l-green-500',
                glow: 'shadow-green-500/20'
            },
            gray: {
                header: 'bg-gray-100/80 text-gray-800 border-gray-200/50',
                count: 'bg-gray-200/80 text-gray-900',
                accent: 'border-l-gray-500',
                glow: 'shadow-gray-500/20'
            },
            red: {
                header: 'bg-red-100/80 text-red-800 border-red-200/50',
                count: 'bg-red-200/80 text-red-900',
                accent: 'border-l-red-500',
                glow: 'shadow-red-500/20'
            }
        };
        return colors[color] || colors.blue;
    };

    const colorClasses = getColorClasses(color);

    const [isDraggingOver, setIsDraggingOver] = useState(false);

    const handleDragOver = (e) => {
        e.preventDefault();
        if (isRestricted) return;
        setIsDraggingOver(true);
    };

    const handleDragLeave = (e) => {
        if (isRestricted) return;
        setIsDraggingOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDraggingOver(false);
        const ticketId = parseInt(e.dataTransfer.getData('text/plain'));
        if (!isRestricted && ticketId) {
            onUpdateTicket(ticketId, { status });
        }
    };


    const getPriorityStats = () => {
        const stats = {
            critical: tickets.filter(t => t.priority === 'critical').length,
            high: tickets.filter(t => t.priority === 'high').length,
            medium: tickets.filter(t => t.priority === 'medium').length,
            low: tickets.filter(t => t.priority === 'low').length,
        };
        return stats;
    };

    const getOverdueCount = () => {
        return tickets.filter(t =>
            t.dueDate &&
            new Date(t.dueDate) < new Date() &&
            t.status !== 'resolved' &&
            t.status !== 'closed'
        ).length;
    };

    const priorityStats = getPriorityStats();
    const overdueCount = getOverdueCount();

    return (
        <div
            className={`
        glass-card p-4 sm:p-6 rounded-2xl w-full max-w-[90vw] sm:max-w-[400px] min-h-[400px] 
        sm:min-h-[500px] transition-all duration-300 
        hover:shadow-glass-strong border-l-4 ${colorClasses.accent}
        ${isRestricted ? 'opacity-90' : 'hover:transform hover:-translate-y-1'}
        ${isRestricted ? 'cursor-not-allowed' : 'cursor-default'}
        drag-drop-zone mx-auto
      `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            {/* Column Header */}
            <div className={`backdrop-blur-md rounded-xl p-3 sm:p-4 mb-4 sm:mb-6 border ${colorClasses.header} relative overflow-hidden`}>
                <div className="absolute inset-0 opacity-5">
                    <div className="w-full h-full bg-gradient-to-br from-white/20 to-transparent"></div>
                </div>

                <div className="relative">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-3 gap-3">
                        <div className="flex items-center gap-2 sm:gap-3">
                            <div className={`glass p-1.5 sm:p-2 rounded-lg ${colorClasses.glow} shadow-lg`}>
                                {icon}
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-semibold flex items-center gap-2">
                                    {title}
                                    {isRestricted && (
                                        <Lock className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" title="Drop restricted" />
                                    )}
                                </h3>
                                {description && (
                                    <p className="text-xs sm:text-sm opacity-80 mt-1 max-w-[90%]">{description}</p>
                                )}
                            </div>
                        </div>
                        <div className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${colorClasses.count} shadow-sm`}>
                            {tickets.length}
                        </div>
                    </div>

                    {/* Stats Row */}
                    {tickets.length > 0 && !isRestricted && (
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                            {priorityStats.critical > 0 && (
                                <span className="flex items-center gap-1 bg-red-100/50 text-red-700 px-2 py-1 rounded-full">
                                    <AlertTriangle className="w-3 h-3" />
                                    {priorityStats.critical} Critical
                                </span>
                            )}
                            {overdueCount > 0 && (
                                <span className="flex items-center gap-1 bg-red-100/50 text-red-700 px-2 py-1 rounded-full">
                                    <Clock className="w-3 h-3" />
                                    {overdueCount} Overdue
                                </span>
                            )}
                            {priorityStats.high > 0 && (
                                <span className="flex items-center gap-1 bg-orange-100/50 text-orange-700 px-2 py-1 rounded-full">
                                    {priorityStats.high} High
                                </span>
                            )}
                        </div>
                    )}
                </div>

                {/* Restriction Overlay */}
                {isRestricted && (
                    <div className="absolute top-2 right-2">
                        <div className="bg-gray-500/20 p-1 rounded-full">
                            <Archive className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                        </div>
                    </div>
                )}
            </div>

            {/* Drop Zone Indicator */}
            {isDraggingOver && !isRestricted && (
                <div className="glass-subtle border-2 border-dashed border-blue-400/50 rounded-xl p-4 sm:p-8 mb-4 text-center animate-fade-in">
                    <div className="text-blue-600 font-medium text-sm">Drop ticket here</div>
                </div>
            )}

            {/* Restricted Drop Indicator */}
            {isDraggingOver && isRestricted && (
                <div className="glass-subtle border-2 border-dashed border-red-400/50 rounded-xl p-4 sm:p-8 mb-4 text-center bg-red-50/50 animate-fade-in">
                    <div className="text-red-600 font-medium flex items-center justify-center gap-2 text-sm">
                        <X className="w-4 h-4 sm:w-5 sm:h-5" />
                        Cannot drop tickets here
                    </div>
                </div>
            )}

            {/* Tickets */}
            <div className="space-y-4">
                {tickets.length === 0 ? (
                    <div className="glass-subtle p-4 sm:p-8 text-center rounded-xl border-2 border-dashed border-white/30">
                        <div className="text-gray-500 text-xs sm:text-sm flex flex-col items-center gap-2">
                            {icon && <div className="opacity-50">{icon}</div>}
                            <span>No tickets in {title.toLowerCase()}</span>
                            {isRestricted && (
                                <span className="text-xs text-gray-400">
                                    Archived tickets appear here
                                </span>
                            )}
                        </div>
                    </div>
                ) : (
                    tickets.map((ticket, index) => (
                        <div
                            key={ticket.id}
                            className="animate-fade-in"
                            style={{
                                animationDelay: `${index * 100}ms`,
                                animationFillMode: 'both'
                            }}
                        >
                            <TicketCard
                                ticket={ticket}
                                onUpdate={onUpdateTicket}
                                onDelete={onDeleteTicket}
                                onEdit={onEditTicket}
                                isRestricted={isRestricted}
                            />
                        </div>
                    ))
                )}
            </div>

            {/* Footer Info */}
            {tickets.length > 0 && (
                <div className="mt-4 sm:mt-6 pt-4 border-t border-white/20">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs text-gray-600 gap-2">
                        <span>
                            {status === 'closed' ? 'Archived' : 'Active'} tickets
                        </span>
                        <span>
                            Updated {new Date().toLocaleDateString()}
                        </span>
                    </div>
                </div>
            )}

            <style jsx>{`
        .drag-drop-zone.drag-over {
          transform: scale(1.02);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.3);
        }
        
        .drag-drop-zone.drag-over .drag-over-indicator {
          display: block !important;
        }
        
        .drag-drop-zone.drag-over .drag-over-restricted {
          display: block !important;
        }
        
        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .glass {
          backdrop-filter: blur(10px);
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .glass-card {
          backdrop-filter: blur(20px);
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .glass-subtle {
          backdrop-filter: blur(5px);
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        @media (max-width: 640px) {
          .glass-card {
            padding: 1rem;
          }
          
          .glass-card:hover {
            transform: none !important;
          }
        }
      `}</style>
        </div>
    );
};

export default TicketColumn;