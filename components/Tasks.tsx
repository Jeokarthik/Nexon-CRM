import React, { useState, useEffect } from 'react';
import { Task, TaskPriority } from '../types';
import { PlusIcon, EditIcon, TrashIcon } from './icons';

interface TaskModalProps {
    task: Task | null;
    onSave: (task: Task) => void;
    onClose: () => void;
}

const TaskModal: React.FC<TaskModalProps> = ({ task, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Task, 'id' | 'completed'>>({
        title: '', dueDate: '', dueTime: '', relatedTo: '', priority: TaskPriority.Medium, reminder: 'none'
    });

    useEffect(() => {
        if (task) {
            setFormData(task);
        } else {
             setFormData({ title: '', dueDate: '', dueTime: '', relatedTo: '', priority: TaskPriority.Medium, reminder: 'none' });
        }
    }, [task]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: task?.id || `task_${Date.now()}`, completed: task?.completed || false });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-lg" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 p-4 border-b dark:border-gray-600">{task ? 'Edit Task' : 'Add Task'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Task Title" className="w-full p-2 border rounded sm:col-span-2 dark:bg-gray-700 dark:border-gray-600" required />
                        <input name="relatedTo" value={formData.relatedTo} onChange={handleChange} placeholder="Related To (e.g., Deal, Contact)" className="w-full p-2 border rounded sm:col-span-2 dark:bg-gray-700 dark:border-gray-600" />
                        <input name="dueDate" type="date" value={formData.dueDate} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                        <input name="dueTime" type="time" value={formData.dueTime} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                         <select name="priority" value={formData.priority} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                            {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                         <select name="reminder" value={formData.reminder} onChange={handleChange} className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600">
                            <option value="none">No reminder</option>
                            <option value="5m">5 mins before</option>
                            <option value="15m">15 mins before</option>
                            <option value="1h">1 hour before</option>
                            <option value="1d">1 day before</option>
                        </select>
                    </div>
                    <div className="flex justify-end p-4 border-t dark:border-gray-600">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#4F46E5] text-white rounded">Save Task</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface TasksProps {
    tasks: Task[];
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const getPriorityClasses = (priority: TaskPriority, completed: boolean) => {
    if (completed) {
        return 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700';
    }
    switch (priority) {
        case TaskPriority.High: return 'border-red-500 text-red-600 bg-red-50 dark:bg-red-900/50 dark:text-red-400';
        case TaskPriority.Medium: return 'border-amber-500 text-amber-600 bg-amber-50 dark:bg-amber-900/50 dark:text-amber-400';
        case TaskPriority.Low: return 'border-blue-500 text-blue-600 bg-blue-50 dark:bg-blue-900/50 dark:text-blue-400';
        default: return 'border-gray-400 text-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-300';
    }
};

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'all'>('all');
    const [sortBy, setSortBy] = useState<'dueDate' | 'priority'>('dueDate');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);

    const handleSaveTask = (task: Task) => {
        if (tasks.some(t => t.id === task.id)) {
            setTasks(tasks.map(t => t.id === task.id ? task : t));
        } else {
            setTasks([task, ...tasks]);
        }
        setIsModalOpen(false);
        setEditingTask(null);
    }

    const handleDeleteTask = (taskId: string) => {
        setTasks(tasks.filter(t => t.id !== taskId));
    }

    const toggleTaskCompletion = (taskId: string) => {
        setTasks(tasks.map(task => 
            task.id === taskId ? { ...task, completed: !task.completed } : task
        ));
    };
    
    const getDueDateColor = (dueDate: string, completed: boolean) => {
        if (completed) return 'text-gray-500';
        const today = new Date();
        const due = new Date(dueDate);
        today.setHours(0,0,0,0);
        due.setHours(0,0,0,0);

        if (due < today) return 'text-red-500';
        if (due.getTime() === today.getTime()) return 'text-amber-500';
        return 'text-gray-600 dark:text-gray-300';
    };
    
    const formatTime = (time: string): string => {
        const [hours, minutes] = time.split(':').map(Number);
        const ampm = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 || 12;
        return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
    };

    const priorityOrder = {
        [TaskPriority.High]: 1,
        [TaskPriority.Medium]: 2,
        [TaskPriority.Low]: 3,
    };

    const filteredAndSortedTasks = tasks
        .filter(task =>
            (task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.relatedTo.toLowerCase().includes(searchTerm.toLowerCase())) &&
            (priorityFilter === 'all' || task.priority === priorityFilter)
        )
        .sort((a, b) => {
            if (a.completed && !b.completed) return 1;
            if (!a.completed && b.completed) return -1;

            if (sortBy === 'priority') {
                return priorityOrder[a.priority] - priorityOrder[b.priority];
            }
            const aDateTime = new Date(`${a.dueDate}T${a.dueTime || '00:00'}`).getTime();
            const bDateTime = new Date(`${b.dueDate}T${b.dueTime || '00:00'}`).getTime();
            return aDateTime - bDateTime;
        });

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 sr-only md:not-sr-only dark:text-gray-100">Tasks & Reminders</h1>
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Search by title or related entity..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full sm:w-auto flex-grow max-w-md p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    aria-label="Search tasks"
                />
                 <select
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value as TaskPriority | 'all')}
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    aria-label="Filter by priority"
                >
                    <option value="all">All Priorities</option>
                    <option value={TaskPriority.High}>High</option>
                    <option value={TaskPriority.Medium}>Medium</option>
                    <option value={TaskPriority.Low}>Low</option>
                </select>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'dueDate' | 'priority')}
                    className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                    aria-label="Sort by"
                >
                    <option value="dueDate">Sort by Due Date</option>
                    <option value="priority">Sort by Priority</option>
                </select>
                <button onClick={() => { setEditingTask(null); setIsModalOpen(true); }} className="flex items-center ml-auto px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] font-medium text-sm">
                    <PlusIcon />
                    <span className="ml-2">Add Task</span>
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredAndSortedTasks.map(task => (
                        <li key={task.id} className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 group transition-colors duration-200 ${
                            task.priority === TaskPriority.High && !task.completed
                                ? 'py-4 pr-4 pl-3 border-l-4 border-red-500 bg-red-50/50 dark:bg-red-900/20'
                                : 'p-4 border-l-4 border-transparent'
                        }`}>
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    checked={task.completed}
                                    onChange={() => toggleTaskCompletion(task.id)}
                                    className="h-5 w-5 rounded border-gray-300 text-[#4F46E5] focus:ring-[#4F46E5] bg-transparent dark:bg-gray-600 dark:border-gray-500 flex-shrink-0"
                                    aria-labelledby={`task-title-${task.id}`}
                                />
                                <div className="ml-4">
                                    <p id={`task-title-${task.id}`} className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                                        {task.title}
                                    </p>
                                    <p className={`text-sm ${task.completed ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                        Related to: {task.relatedTo}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center self-stretch sm:self-auto justify-between sm:justify-end gap-4 text-sm w-full sm:w-auto">
                                <span className={`font-semibold px-2 py-1 border rounded-full text-xs ${getPriorityClasses(task.priority, task.completed)}`}>
                                    {task.priority}
                                </span>
                                <div className="flex flex-col items-end w-32">
                                     <span className={`font-semibold ${getDueDateColor(task.dueDate, task.completed)}`}>
                                        {new Date(task.dueDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                    </span>
                                    {task.dueTime && !task.completed && (
                                        <span className="text-xs text-gray-500 dark:text-gray-400">{formatTime(task.dueTime)}</span>
                                    )}
                                </div>
                                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => { setEditingTask(task); setIsModalOpen(true); }} className="p-1 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"><EditIcon/></button>
                                    <button onClick={() => handleDeleteTask(task.id)} className="p-1 text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"><TrashIcon/></button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            {isModalOpen && <TaskModal task={editingTask} onSave={handleSaveTask} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Tasks;