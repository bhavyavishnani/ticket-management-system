import { AlertCircle, Calendar, Clock, FileText, Tag, Target, User, X, Zap } from 'lucide-react';
import { useState } from 'react';

const TicketForm = ({ onSubmit, onCancel, ticket = null }) => {
    const [formData, setFormData] = useState({
        title: ticket?.title || '',
        description: ticket?.description || '',
        priority: ticket?.priority || 'medium',
        assignee: ticket?.assignee || '',
        dueDate: ticket?.dueDate ? ticket.dueDate.split('T')[0] : '',
        status: ticket?.status || 'open',
        customerName: ticket?.customerName || '',
        estimatedHours: ticket?.estimatedHours || '',
        tags: ticket?.tags?.join(', ') || ''
    });

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [focusedField, setFocusedField] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = 'Title is required';
        } else if (formData.title.length < 3) {
            newErrors.title = 'Title must be at least 3 characters';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        } else if (formData.description.length < 10) {
            newErrors.description = 'Description must be at least 10 characters';
        }

        if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
            newErrors.dueDate = 'Due date cannot be in the past';
        }

        if (formData.estimatedHours && (isNaN(formData.estimatedHours) || formData.estimatedHours < 0)) {
            newErrors.estimatedHours = 'Please enter a valid number of hours';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 800));

            const submitData = {
                ...formData,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null,
                estimatedHours: formData.estimatedHours ? parseInt(formData.estimatedHours) : null,
                tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : []
            };

            await onSubmit(submitData);
            setSubmitSuccess(true);
            setTimeout(() => setSubmitSuccess(false), 3000); // Hide success message after 3s
        } catch (error) {
            console.error('Error submitting ticket:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const getPriorityConfig = (priority) => {
        const configs = {
            low: {
                color: 'border-green-300 text-green-700 bg-green-50/50',
                activeColor: 'border-green-500 text-green-800 bg-green-100/80',
                icon: '🟢'
            },
            medium: {
                color: 'border-yellow-300 text-yellow-700 bg-yellow-50/50',
                activeColor: 'border-yellow-500 text-yellow-800 bg-yellow-100/80',
                icon: '🟡'
            },
            high: {
                color: 'border-orange-300 text-orange-700 bg-orange-50/50',
                activeColor: 'border-orange-500 text-orange-800 bg-orange-100/80',
                icon: '🟠'
            },
            critical: {
                color: 'border-red-300 text-red-700 bg-red-50/50',
                activeColor: 'border-red-500 text-red-800 bg-red-100/80',
                icon: '🔴'
            }
        };
        return configs[priority] || configs.medium;
    };

    const getStatusConfig = (status) => {
        const configs = {
            open: { color: 'border-blue-300 text-blue-700 bg-blue-50/50', icon: '📋' },
            'in-progress': { color: 'border-orange-300 text-orange-700 bg-orange-50/50', icon: '⚡' },
            resolved: { color: 'border-green-300 text-green-700 bg-green-50/50', icon: '✅' }
        };
        return configs[status] || configs.open;
    };

    return (
        <div className="relative max-w-3xl mx-auto">
            {/* Success Message */}
            {submitSuccess && (
                <div className="fixed top-4 right-4 bg-green-100/80 border border-green-300 text-green-800 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
                    <Target className="w-5 h-5" />
                    <span>Ticket {ticket ? 'updated' : 'created'} successfully!</span>
                </div>
            )}

            <div className="relative p-4 sm:p-6 md:p-8">
                {/* Header */}
                
                <div className="flex items-center justify-between mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <div className="p-2 sm:p-3 rounded-lg bg-blue-100/80">
                            <FileText className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">
                                {ticket ? 'Edit Ticket' : 'Create New Ticket'}
                            </h2>
                            <p className="text-gray-600 text-sm sm:text-base mt-1 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                {ticket ? `Updating ticket #${ticket.id}` : 'Fill in the details to create a new support ticket'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onCancel}
                        className="p-2 sm:p-3 rounded-lg bg-white/80 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200"
                        aria-label="Cancel ticket form"
                    >
                        <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 hover:text-red-600" />
                    </button>
                </div>

                <div className="space-y-6 sm:space-y-8">
                    {/* Title Field */}
                    <div>
                        <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            <Tag className="w-4 h-4 text-blue-600" />
                            Title <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                onFocus={() => setFocusedField('title')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 outline-none rounded-lg border transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 ${errors.title
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                                        : focusedField === 'title'
                                            ? 'border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="Enter a clear, descriptive title..."
                                maxLength={100}
                                aria-invalid={!!errors.title}
                                aria-describedby={errors.title ? 'title-error' : undefined}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500 transition-all duration-200">
                                {formData.title.length}/100
                            </div>
                        </div>
                        {errors.title && (
                            <div id="title-error" className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {errors.title}
                            </div>
                        )}
                    </div>

                    {/* Customer Name Field */}
                    <div>
                        <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            <User className="w-4 h-4 text-green-600" />
                            Customer Name
                        </label>
                        <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => handleChange('customerName', e.target.value)}
                            onFocus={() => setFocusedField('customerName')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-4 py-3 sm:px-5 sm:py-4 outline-none rounded-lg border transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 ${focusedField === 'customerName'
                                    ? 'border-green-400 focus:border-green-500 focus:ring-2 focus:ring-green-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            placeholder="Enter customer or company name..."
                        />
                    </div>

                    {/* Description Field */}
                    <div>
                        <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            <FileText className="w-4 h-4 text-purple-600" />
                            Description <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleChange('description', e.target.value)}
                                onFocus={() => setFocusedField('description')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border outline-none transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 resize-none ${errors.description
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                                        : focusedField === 'description'
                                            ? 'border-purple-400 focus:border-purple-500 focus:ring-2 focus:ring-purple-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="Describe the issue, request, or task in detail..."
                                rows="4 sm:rows-5"
                                maxLength={1000}
                                aria-invalid={!!errors.description}
                                aria-describedby={errors.description ? 'description-error' : undefined}
                            />
                            <div className="absolute right-3 bottom-3 text-xs text-gray-500 transition-all duration-200">
                                {formData.description.length}/1000
                            </div>
                        </div>
                        {errors.description && (
                            <div id="description-error" className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
                                <AlertCircle className="w-4 h-4" />
                                {errors.description}
                            </div>
                        )}
                    </div>

                    {/* Priority Selection */}
                    <div>
                        <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            <Zap className="w-4 h-4 text-red-600" />
                            Priority Level
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                            {['low', 'medium', 'high', 'critical'].map((priority) => {
                                const config = getPriorityConfig(priority);
                                const isSelected = formData.priority === priority;

                                return (
                                    <button
                                        key={priority}
                                        type="button"
                                        onClick={() => handleChange('priority', priority)}
                                        className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 text-sm font-medium ${isSelected
                                                ? config.activeColor
                                                : `${config.color} hover:bg-opacity-70`
                                            }`}
                                        aria-pressed={isSelected}
                                    >
                                        <div className="flex flex-col items-center gap-1">
                                            <span className="text-lg sm:text-xl">{config.icon}</span>
                                            <span className="capitalize">{priority}</span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Assignee and Estimated Hours Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Assignee */}
                        <div>
                            <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                <User className="w-4 h-4 text-indigo-600" />
                                Assignee
                            </label>
                            <input
                                type="text"
                                value={formData.assignee}
                                onChange={(e) => handleChange('assignee', e.target.value)}
                                onFocus={() => setFocusedField('assignee')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 outline-none rounded-lg border transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 ${focusedField === 'assignee'
                                        ? 'border-indigo-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200'
                                        : 'border-gray-200 hover:border-gray-300'
                                    }`}

                                placeholder="Assign to team member..."
                            />
                        </div>

                        {/* Estimated Hours */}
                        <div>
                            <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                <Clock className="w-4 h-4 text-orange-600" />
                                Estimated Hours
                            </label>
                            <input
                                type="number"
                                min="0"
                                max="999"
                                value={formData.estimatedHours}
                                onChange={(e) => handleChange('estimatedHours', e.target.value)}
                                onFocus={() => setFocusedField('estimatedHours')}
                                onBlur={() => setFocusedField(null)}
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg outline-none border transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 ${errors.estimatedHours
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                                        : focusedField === 'estimatedHours'
                                            ? 'border-orange-400 focus:border-orange-500 focus:ring-2 focus:ring-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                placeholder="e.g., 8"
                                aria-invalid={!!errors.estimatedHours}
                                aria-describedby={errors.estimatedHours ? 'estimatedHours-error' : undefined}
                            />
                            {errors.estimatedHours && (
                                <div id="estimatedHours-error" className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.estimatedHours}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Due Date and Status Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        {/* Due Date */}
                        <div>
                            <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                <Calendar className="w-4 h-4 text-teal-600" />
                                Due Date
                            </label>
                            <input
                                type="date"
                                value={formData.dueDate}
                                onChange={(e) => handleChange('dueDate', e.target.value)}
                                onFocus={() => setFocusedField('dueDate')}
                                onBlur={() => setFocusedField(null)}
                                min={new Date().toISOString().split('T')[0]}
                                className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg border outline-none transition-all duration-200 bg-white/90 text-gray-800 ${errors.dueDate
                                        ? 'border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-200'
                                        : focusedField === 'dueDate'
                                            ? 'border-teal-400 focus:border-teal-500 focus:ring-2 focus:ring-teal-200'
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                aria-invalid={!!errors.dueDate}
                                aria-describedby={errors.dueDate ? 'dueDate-error' : undefined}
                            />
                            {errors.dueDate && (
                                <div id="dueDate-error" className="mt-2 flex items-center gap-2 text-red-600 text-sm animate-fade-in">
                                    <AlertCircle className="w-4 h-4" />
                                    {errors.dueDate}
                                </div>
                            )}
                        </div>

                        {/* Status (only for edit mode) */}
                        {ticket && (
                            <div>
                                <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                                    <Target className="w-4 h-4 text-blue-600" />
                                    Status
                                </label>
                                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                                    {['open', 'in-progress', 'resolved'].map((status) => {
                                        const config = getStatusConfig(status);
                                        const isSelected = formData.status === status;

                                        return (
                                            <button
                                                key={status}
                                                type="button"
                                                onClick={() => handleChange('status', status)}
                                                className={`p-3 sm:p-4 rounded-lg border transition-all duration-200 text-sm font-medium ${isSelected
                                                        ? config.color
                                                        : 'bg-white/50 border-gray-200 hover:bg-gray-50/70'
                                                    }`}
                                                aria-pressed={isSelected}
                                            >
                                                <div className="flex flex-col items-center gap-1">
                                                    <span className="text-lg sm:text-xl">{config.icon}</span>
                                                    <span className="capitalize text-xs sm:text-sm">{status.replace('-', ' ')}</span>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="flex items-center gap-2 sm:gap-3 text-sm font-medium text-gray-700 mb-2 sm:mb-3">
                            <Tag className="w-4 h-4 text-pink-600" />
                            Tags
                        </label>
                        <input
                            type="text"
                            value={formData.tags}
                            onChange={(e) => handleChange('tags', e.target.value)}
                            onFocus={() => setFocusedField('tags')}
                            onBlur={() => setFocusedField(null)}
                            className={`w-full px-4 py-3 sm:px-5 sm:py-4 rounded-lg outline-none border transition-all duration-200 bg-white/90 text-gray-800 placeholder-gray-400 ${focusedField === 'tags'
                                    ? 'border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200'
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            placeholder="Add tags separated by commas (e.g., bug, urgent, frontend)"
                        />
                        <p className="mt-2 text-xs text-gray-500">Separate multiple tags with commas</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-gray-700 bg-white/90 border border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-colors duration-200 disabled:opacity-50"
                            aria-label="Cancel ticket form"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="flex-1 px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                            aria-label={ticket ? 'Update ticket' : 'Create ticket'}
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    {ticket ? 'Updating...' : 'Creating...'}
                                </>
                            ) : (
                                <>
                                    <Target className="w-4 h-4" />
                                    {ticket ? 'Update Ticket' : 'Create Ticket'}
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Footer Info */}
                <div className="mt-6 sm:mt-8 p-4 sm:p-6 rounded-lg bg-gray-50/80 border border-gray-200">
                    <div className="flex items-start gap-2 sm:gap-3">
                        <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-gray-800 mb-1">Ticket Information</h4>
                            <ul className="text-xs sm:text-sm text-gray-600 space-y-1">
                                <li>• <span className="text-red-500 font-medium">*</span> Required fields must be completed</li>
                                <li>• All tickets are automatically tracked and timestamped</li>
                                <li>• You can update ticket details anytime after creation</li>
                                <li>• Email notifications will be sent to assigned team members</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default TicketForm;