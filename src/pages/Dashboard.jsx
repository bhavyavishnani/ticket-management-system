import {
    AlertCircle,
    Bell,
    CheckCircle,
    Clock,
    LogOut,
    Plus,
    Search,
    Settings,
    Target,
    TrendingUp,
    Filter,
    Download,
    Calendar,
    User,
    MoreHorizontal,
    Edit,
    Trash2,
    Eye,
    Archive
} from 'lucide-react';
import { useEffect, useState } from 'react';
import TicketColumn from '../components/TicketColumn';
import TicketForm from '../components/TicketForm';
import { useNavigate } from 'react-router-dom';

import { clearLoginStatus } from '../utils/LocalStorage'

const Dashboard = () => {
    const [tickets, setTickets] = useState([]);
    const [isTicketFormOpen, setIsTicketFormOpen] = useState(false);
    const [editingTicket, setEditingTicket] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPriority, setFilterPriority] = useState('all');
    const [filterAssignee, setFilterAssignee] = useState('all');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState('desc');
    const [viewMode, setViewMode] = useState('kanban');
    const [user, setUser] = useState({
        name: 'Bhavya Vishnani',
        email: 'vishnani@outlook.com',
        avatar: 'https://pbs.twimg.com/profile_images/1851842541718523905/LHm3C4mu_400x400.jpg'
    });

    const navigate = useNavigate();

    const uniqueAssignees = [...new Set(tickets.map(ticket => ticket.assignee).filter(Boolean))];

    useEffect(() => {
        const savedTickets = localStorage.getItem('tickets');
        if (savedTickets) {
            setTickets(JSON.parse(savedTickets));
        } else {
            const demoTickets = [
                {
                    id: 1,
                    title: 'System Performance Optimization',
                    description: 'Investigate and resolve slow database queries affecting user experience across multiple modules',
                    status: 'open',
                    priority: 'high',
                    assignee: 'Sarah Johnson',
                    customerName: 'Tech Corp Ltd',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
                    tags: ['performance', 'database'],
                    estimatedHours: 8
                },
                {
                    id: 2,
                    title: 'Mobile App Authentication Bug',
                    description: 'Users unable to login on iOS devices running version 16.x and above',
                    status: 'in-progress',
                    priority: 'critical',
                    assignee: 'Mike Chen',
                    customerName: 'Mobile Solutions Inc',
                    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
                    tags: ['mobile', 'authentication', 'iOS'],
                    estimatedHours: 12
                },
                {
                    id: 3,
                    title: 'Feature Request: Dark Mode',
                    description: 'Implement dark mode theme across the entire application with user preference storage',
                    status: 'resolved',
                    priority: 'medium',
                    assignee: 'Alex Rodriguez',
                    customerName: 'Design Systems Team',
                    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
                    tags: ['feature', 'UI/UX'],
                    estimatedHours: 16
                },
                {
                    id: 4,
                    title: 'Email Notification System',
                    description: 'Set up automated email notifications for ticket status changes and assignments',
                    status: 'open',
                    priority: 'medium',
                    assignee: 'Lisa Wang',
                    customerName: 'Internal Operations',
                    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
                    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
                    tags: ['notifications', 'email'],
                    estimatedHours: 6
                }
            ];
            setTickets(demoTickets);
            localStorage.setItem('tickets', JSON.stringify(demoTickets));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('tickets', JSON.stringify(tickets));
    }, [tickets]);

    const handleCreateTicket = (ticketData) => {
        const newTicket = {
            id: Date.now(),
            ...ticketData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        setTickets([...tickets, newTicket]);
        setIsTicketFormOpen(false);
    };

    const handleUpdateTicket = (ticketId, updates) => {
        setTickets(tickets.map(ticket =>
            ticket.id === ticketId
                ? { ...ticket, ...updates, updatedAt: new Date().toISOString() }
                : ticket
        ));
    };

    const handleEditTicket = (ticket) => {
        setEditingTicket(ticket);
        setIsTicketFormOpen(true);
    };

    const handleDeleteTicket = (ticketId) => {
        if (window.confirm('Are you sure you want to delete this ticket?')) {
            setTickets(tickets.filter(ticket => ticket.id !== ticketId));
        }
    };

    const filteredAndSortedTickets = tickets
        .filter(ticket => {
            const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ticket.customerName?.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = filterStatus === 'all' || ticket.status === filterStatus;
            const matchesPriority = filterPriority === 'all' || ticket.priority === filterPriority;
            const matchesAssignee = filterAssignee === 'all' || ticket.assignee === filterAssignee;

            return matchesSearch && matchesStatus && matchesPriority && matchesAssignee;
        })
        .sort((a, b) => {
            let aValue = a[sortBy];
            let bValue = b[sortBy];

            if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
                aValue = new Date(aValue);
                bValue = new Date(bValue);
            }

            if (sortOrder === 'asc') {
                return aValue > bValue ? 1 : -1;
            } else {
                return aValue < bValue ? 1 : -1;
            }
        });

    const ticketsByStatus = {
        open: filteredAndSortedTickets.filter(ticket => ticket.status === 'open'),
        'in-progress': filteredAndSortedTickets.filter(ticket => ticket.status === 'in-progress'),
        resolved: filteredAndSortedTickets.filter(ticket => ticket.status === 'resolved'),
        closed: filteredAndSortedTickets.filter(ticket => ticket.status === 'closed')
    };

    const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        inProgress: tickets.filter(t => t.status === 'in-progress').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        closed: tickets.filter(t => t.status === 'closed').length,
        critical: tickets.filter(t => t.priority === 'critical').length,
        overdue: tickets.filter(t => t.dueDate && new Date(t.dueDate) < new Date() && t.status !== 'resolved' && t.status !== 'closed').length
    };

    const handleLogout = () => {
        clearLoginStatus(); // clears both status and user
        setUser(null);
        navigate('/'); // redirect to login
    };

    const exportTickets = () => {
        const dataStr = JSON.stringify(filteredAndSortedTickets, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tickets-export-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'critical': return 'text-red-600 bg-red-50 border-red-200';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
            case 'low': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'open': return 'text-blue-600 bg-blue-50 border-blue-200';
            case 'in-progress': return 'text-orange-600 bg-orange-50 border-orange-200';
            case 'resolved': return 'text-green-600 bg-green-50 border-green-200';
            default: return 'text-gray-600 bg-gray-50 border-gray-200';
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="bg-blue-600 p-1.5 sm:p-2 rounded-lg">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">TicketFlow Pro</h1>
                                <p className="text-xs sm:text-sm text-gray-500">Professional Ticket Management</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors relative">
                                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 sm:w-3 sm:h-3 bg-red-500 rounded-full"></span>
                            </button>

                            <button className="p-1.5 sm:p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                                <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
                            </button>

                            <div className="flex items-center space-x-2 sm:space-x-3 border-l pl-2 sm:pl-4">
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover"
                                />
                                <div className="hidden sm:block">
                                    <p className="text-xs sm:text-sm font-medium text-gray-900">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.email}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="p-1.5 sm:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                    title="Logout"
                                >
                                    <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6 sm:mb-8">
                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Total Tickets</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                                <Target className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Open</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.open}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                                <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">In Progress</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.inProgress}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-orange-50 rounded-lg">
                                <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-orange-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Resolved</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.resolved}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                                <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Critical</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.critical}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                                <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Overdue</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.overdue}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-red-50 rounded-lg">
                                <Calendar className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-600">Closed</p>
                                <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.closed}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-gray-50 rounded-lg">
                                <Archive className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="bg-white p-4 lg:p-6 rounded-lg shadow-sm border border-gray-200 mb-6 lg:mb-8">
                    {/* Main Filter Section */}
                    <div className="space-y-4 lg:space-y-6">

                        {/* Top Row: Search and Action Buttons */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                            {/* Left: Search and Filters */}
                            <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 flex-1 max-w-none lg:max-w-4xl">

                                {/* Search Input */}
                                <div className="relative flex-1 min-w-0 lg:max-w-xs">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 lg:w-5 lg:h-5 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search tickets..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 lg:pl-10 pr-3 lg:pr-4 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-sm lg:text-base"
                                    />
                                </div>

                                {/* Filter Dropdowns */}
                                <div className="flex flex-wrap sm:flex-nowrap gap-2 lg:gap-3">
                                    <select
                                        value={filterStatus}
                                        onChange={(e) => setFilterStatus(e.target.value)}
                                        className="flex-1 sm:flex-none px-3 lg:px-4 pr-8 lg:pr-10 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm lg:text-base min-w-[120px] lg:min-w-[140px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDEuNUw2IDYuNUwxMSAxLjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_12px_center] lg:bg-[right_16px_center]"
                                    >
                                        <option value="all">All Status</option>
                                        <option value="open">Open</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="resolved">Resolved</option>
                                        <option value="closed">Closed</option>
                                    </select>

                                    <select
                                        value={filterPriority}
                                        onChange={(e) => setFilterPriority(e.target.value)}
                                        className="flex-1 sm:flex-none px-3 lg:px-4 pr-8 lg:pr-10 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm lg:text-base min-w-[120px] lg:min-w-[140px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDEuNUw2IDYuNUwxMSAxLjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_12px_center] lg:bg-[right_16px_center]"
                                    >
                                        <option value="all">All Priority</option>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>

                                    <select
                                        value={filterAssignee}
                                        onChange={(e) => setFilterAssignee(e.target.value)}
                                        className="flex-1 sm:flex-none px-3 lg:px-4 pr-8 lg:pr-10 py-2.5 lg:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm lg:text-base min-w-[120px] lg:min-w-[150px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDEuNUw2IDYuNUwxMSAxLjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_12px_center] lg:bg-[right_16px_center]"
                                    >
                                        <option value="all">All Assignees</option>
                                        {uniqueAssignees.map(assignee => (
                                            <option key={assignee} value={assignee}>{assignee}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Right: Action Buttons */}
                            <div className="flex flex-wrap sm:flex-nowrap gap-2 lg:gap-3 sm:justify-end lg:flex-shrink-0">

                                {/* Export Button */}
                                <button
                                    onClick={exportTickets}
                                    className="flex-1 sm:flex-none px-3 lg:px-4 py-2.5 lg:py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 text-sm lg:text-base whitespace-nowrap"
                                >
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>

                                {/* View Mode Toggle */}
                                <div className="flex bg-gray-100 rounded-lg p-1">
                                    <button
                                        onClick={() => setViewMode('kanban')}
                                        className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${viewMode === 'kanban'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        Kanban
                                    </button>
                                    <button
                                        onClick={() => setViewMode('list')}
                                        className={`px-3 lg:px-4 py-1.5 lg:py-2 text-xs lg:text-sm font-medium rounded-md transition-colors whitespace-nowrap ${viewMode === 'list'
                                                ? 'bg-white text-gray-900 shadow-sm'
                                                : 'text-gray-600 hover:text-gray-900'
                                            }`}
                                    >
                                        List
                                    </button>
                                </div>

                                {/* Create Ticket Button */}
                                <button
                                    onClick={() => setIsTicketFormOpen(true)}
                                    className="flex-1 sm:flex-none px-4 lg:px-6 py-2.5 lg:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2 text-sm lg:text-base whitespace-nowrap"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Ticket
                                </button>
                            </div>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex flex-wrap items-center gap-3 lg:gap-4 pt-4 border-t border-gray-200">
                            <span className="text-sm lg:text-base font-medium text-gray-700">Sort by:</span>
                            <div className="flex items-center gap-2 lg:gap-3">
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 lg:px-4 pr-8 lg:pr-10 py-2 lg:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white text-sm lg:text-base min-w-[140px] appearance-none bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIiIGhlaWdodD0iOCIgdmlld0JveD0iMCAwIDEyIDgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xIDEuNUw2IDYuNUwxMSAxLjUiIHN0cm9rZT0iIzZCNzI4MCIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L3N2Zz4K')] bg-no-repeat bg-[right_12px_center] lg:bg-[right_16px_center]"
                                >
                                    <option value="createdAt">Created Date</option>
                                    <option value="updatedAt">Updated Date</option>
                                    <option value="dueDate">Due Date</option>
                                    <option value="priority">Priority</option>
                                    <option value="title">Title</option>
                                </select>
                                <button
                                    onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                    className="px-3 lg:px-4 py-2 lg:py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm lg:text-base font-medium whitespace-nowrap"
                                >
                                    {sortOrder === 'asc' ? '↑ Ascending' : '↓ Descending'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content Area */}
                {viewMode === 'kanban' ? (
                    /* Kanban Board */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                        <TicketColumn
                            title="Open"
                            tickets={ticketsByStatus.open}
                            status="open"
                            onUpdateTicket={handleUpdateTicket}
                            onEditTicket={handleEditTicket}
                            onDeleteTicket={handleDeleteTicket}
                            icon={<Clock className="w-4 h-4 sm:w-5 sm:h-5" />}
                            color="blue"
                            description="New tickets awaiting assignment"
                        />
                        <TicketColumn
                            title="In Progress"
                            tickets={ticketsByStatus['in-progress']}
                            status="in-progress"
                            onUpdateTicket={handleUpdateTicket}
                            onEditTicket={handleEditTicket}
                            onDeleteTicket={handleDeleteTicket}
                            icon={<TrendingUp className="w-4 h-4 sm:w-5 sm:h-5" />}
                            color="orange"
                            description="Currently being worked on"
                        />
                        <TicketColumn
                            title="Resolved"
                            tickets={ticketsByStatus.resolved}
                            status="resolved"
                            onUpdateTicket={handleUpdateTicket}
                            onEditTicket={handleEditTicket}
                            onDeleteTicket={handleDeleteTicket}
                            icon={<CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />}
                            color="green"
                            description="Completed and verified"
                        />
                        <TicketColumn
                            title="Closed"
                            tickets={ticketsByStatus.closed || []}
                            status="closed"
                            onUpdateTicket={handleUpdateTicket}
                            onEditTicket={handleEditTicket}
                            onDeleteTicket={handleDeleteTicket}
                            icon={<Archive className="w-4 h-4 sm:w-5 sm:h-5" />}
                            color="gray"
                            isRestricted={true}
                            description="Archived and locked"
                        />
                    </div>
                ) : (
                    /* List View */
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
                            <h3 className="text-base sm:text-lg font-medium text-gray-900">
                                All Tickets ({filteredAndSortedTickets.length})
                            </h3>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Ticket
                                        </th>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Priority
                                        </th>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Assignee
                                        </th>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Due Date
                                        </th>
                                        <th className="px-4 sm:px-6 py-2 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredAndSortedTickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <div>
                                                    <p className="text-xs sm:text-sm font-medium text-gray-900">{ticket.title}</p>
                                                    <p className="text-xs text-gray-500 truncate max-w-[150px] sm:max-w-xs">{ticket.description}</p>
                                                    <p className="text-xs text-gray-400 mt-1">#{ticket.id}</p>
                                                </div>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(ticket.status)}`}>
                                                    {ticket.status.replace('-', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(ticket.priority)}`}>
                                                    {ticket.priority}
                                                </span>
                                            </td>
                                            <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                <td className="flex items-center">
                                                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 mr-1 sm:mr-2" />
                                                    <span className="text-xs sm:text-sm text-gray-900 truncate max-w-[100px] sm:max-w-[150px]">{ticket.assignee}</span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                    <span className="text-xs sm:text-sm text-gray-900">
                                                        {ticket.dueDate ? new Date(ticket.dueDate).toLocaleDateString() : '-'}
                                                    </span>
                                                </td>
                                                <td className="px-4 sm:px-6 py-3 sm:py-4">
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleEditTicket(ticket)}
                                                            className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-colors"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteTicket(ticket.id)}
                                                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                                                            title="Delete"
                                                        >
                                                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {filteredAndSortedTickets.length === 0 && (
                                <div className="text-center py-8 sm:py-12">
                                    <Target className="w-10 h-10 sm:w-12 sm:h-12 text-gray-300 mx-auto mb-4" />
                                    <p className="text-sm sm:text-base text-gray-500">No tickets found matching your filters.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Ticket Form Modal */}
                {isTicketFormOpen && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50">
                        <div className="bg-white max-w-full sm:max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
                            <TicketForm
                                ticket={editingTicket}
                                onSubmit={editingTicket ?
                                    (updates) => {
                                        handleUpdateTicket(editingTicket.id, updates);
                                        setEditingTicket(null);
                                        setIsTicketFormOpen(false);
                                    } :
                                    handleCreateTicket
                                }
                                onCancel={() => {
                                    setIsTicketFormOpen(false);
                                    setEditingTicket(null);
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
