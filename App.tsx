import React, { useState, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import Leads from './components/Leads';
import Contacts from './components/Contacts';
import Deals from './components/Deals';
import Tasks from './components/Tasks';
import AIAssistant from './components/AIAssistant';
import Login from './components/Login';
import Reports from './components/Reports';
import Profile from './components/Profile';
import Settings from './components/Settings';
import GlobalSearch from './components/GlobalSearch';
import { tasks as initialTasks, leads as initialLeads, contacts as initialContacts, deals as initialDeals } from './data';
import type { Task, Lead, Contact, Deal, AppNotification } from './types';
import { MenuIcon } from './components/icons';
import LeadDetailModal from './components/LeadDetailModal';
import { DealStatus } from './types';

type View = 'dashboard' | 'leads' | 'contacts' | 'deals' | 'tasks' | 'reports' | 'ai-assistant' | 'profile' | 'settings';

const useOnClickOutside = (ref: React.RefObject<HTMLElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
    useEffect(() => {
        const listener = (event: MouseEvent | TouchEvent) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        document.addEventListener('touchstart', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
            document.removeEventListener('touchstart', listener);
        };
    }, [ref, handler]);
};

const timeSince = (date: Date): string => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
    return "Just now";
};


const App: React.FC = () => {
    // --- STATE MANAGEMENT ---
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [sentReminders, setSentReminders] = useState<Set<string>>(new Set());
    
    // Centralized Data State
    const [leads, setLeads] = useState<Lead[]>(initialLeads);
    const [contacts, setContacts] = useState<Contact[]>(initialContacts);
    const [deals, setDeals] = useState<Deal[]>(initialDeals);
    const [tasks, setTasks] = useState<Task[]>(initialTasks);

    // Header Dropdown State
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    
    // Modal State
    const [selectedLead, setSelectedLead] = useState<Lead | null | 'new'>(null);
    
    // Notifications State
    const [notifications, setNotifications] = useState<AppNotification[]>([]);

    // --- REFS FOR CLICK-OUTSIDE ---
    const notificationsRef = useRef<HTMLDivElement>(null);
    const userMenuRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(notificationsRef, () => setIsNotificationsOpen(false));
    useOnClickOutside(userMenuRef, () => setIsUserMenuOpen(false));

    // --- UI TITLES ---
    const viewTitles: Record<View, string> = {
        dashboard: 'Welcome back, Matthew',
        deals: 'Deals Pipeline',
        tasks: 'Tasks & Reminders',
        leads: 'Leads',
        contacts: 'Contacts',
        reports: 'Reports & Analytics',
        'ai-assistant': 'AI Assistant',
        profile: 'My Profile',
        settings: 'Settings'
    };

    // --- CRUD HANDLERS ---
    const handleSaveLead = (leadToSave: Lead) => {
        if (leads.some(l => l.id === leadToSave.id)) {
            setLeads(leads.map(l => l.id === leadToSave.id ? leadToSave : l));
        } else {
            setLeads([leadToSave, ...leads]);
        }
        setSelectedLead(null);
    };
    
    const handleDeleteLead = (leadId: string) => {
        setLeads(leads.filter(l => l.id !== leadId));
        setSelectedLead(null);
    };
    
    const handleOpenLeadModal = (lead: Lead | 'new' | null) => {
        setActiveView('leads');
        setSelectedLead(lead);
    }
    
    // --- NOTIFICATION LOGIC ---
     useEffect(() => {
        const generatedNotifications: AppNotification[] = [];
        const todayStr = new Date().toISOString().split('T')[0];

        // Notification for a task due today
        const dueTodayTask = initialTasks.find(task => task.dueDate === todayStr && !task.completed);
        if (dueTodayTask) {
            generatedNotifications.push({
                id: `notif_task_${dueTodayTask.id}`,
                message: `Task "${dueTodayTask.title}" is due today.`,
                type: 'task',
                relatedId: dueTodayTask.id,
                read: false,
                timestamp: new Date().toISOString(),
            });
        }

        // Notification for a new lead
        const newLead = initialLeads.find(lead => lead.status === 'New');
        if (newLead) {
            generatedNotifications.push({
                id: `notif_lead_${newLead.id}`,
                message: `New lead: ${newLead.name} from ${newLead.company}.`,
                type: 'lead',
                relatedId: newLead.id,
                read: false,
                timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
            });
        }

        // Notification for a deal in negotiation
        const negotiationDeal = initialDeals.find(deal => deal.status === DealStatus.Negotiation);
        if (negotiationDeal) {
            generatedNotifications.push({
                id: `notif_deal_${negotiationDeal.id}`,
                message: `Deal "${negotiationDeal.title}" is in negotiation.`,
                type: 'deal',
                relatedId: negotiationDeal.id,
                read: true,
                timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
            });
        }
        
        generatedNotifications.push({
            id: 'notif_welcome',
            message: 'Welcome to Nexora CRM!',
            type: 'general',
            read: true,
            timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
        });

        setNotifications(generatedNotifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
    }, []);

    useEffect(() => {
        if (typeof Notification !== 'undefined' && Notification.permission !== 'granted') {
            Notification.requestPermission().then(permission => {
                if (permission !== 'granted') {
                    console.warn("Notification permission was not granted. Task reminders will not be shown.");
                }
            });
        }

        const checkReminders = () => {
            if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;

            const now = new Date();
            const updatedSentReminders = new Set(sentReminders);
            let remindersHaveBeenSent = false;

            tasks.forEach(task => {
                if (task.completed || !task.reminder || task.reminder === 'none' || sentReminders.has(task.id)) {
                    return;
                }

                const dueDateTime = new Date(`${task.dueDate}T${task.dueTime || '09:00:00'}`);
                if (isNaN(dueDateTime.getTime())) return;

                let reminderTime = new Date(dueDateTime);
                switch (task.reminder) {
                    case '5m': reminderTime.setMinutes(dueDateTime.getMinutes() - 5); break;
                    case '15m': reminderTime.setMinutes(dueDateTime.getMinutes() - 15); break;
                    case '1h': reminderTime.setHours(dueDateTime.getHours() - 1); break;
                    case '1d': reminderTime.setDate(dueDateTime.getDate() - 1); break;
                    default: return;
                }

                if (now >= reminderTime && now <= dueDateTime) {
                    new Notification('Nexora CRM Task Reminder', {
                        body: `Reminder: "${task.title}" is due soon.`,
                    });
                    updatedSentReminders.add(task.id);
                    remindersHaveBeenSent = true;
                }
            });

            if (remindersHaveBeenSent) {
                setSentReminders(updatedSentReminders);
            }
        };

        const intervalId = setInterval(checkReminders, 30000); // Check every 30 seconds

        return () => clearInterval(intervalId);
    }, [tasks, sentReminders]);

    // --- NOTIFICATION HANDLERS ---
    const handleNotificationClick = (notification: AppNotification) => {
        setNotifications(notifications.map(n => n.id === notification.id ? { ...n, read: true } : n));
        setIsNotificationsOpen(false);

        switch(notification.type) {
            case 'lead':
                if (notification.relatedId) {
                    const lead = leads.find(l => l.id === notification.relatedId);
                    if (lead) handleOpenLeadModal(lead);
                }
                break;
            case 'deal':
                setActiveView('deals');
                break;
            case 'task':
                setActiveView('tasks');
                break;
            default:
                break;
        }
    };

    const handleMarkAllAsRead = (e: React.MouseEvent) => {
        e.stopPropagation();
        setNotifications(notifications.map(n => ({ ...n, read: true })));
    };
    
    const unreadCount = notifications.filter(n => !n.read).length;


    // --- VIEW RENDERER ---
    const renderView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard deals={deals} leads={leads} tasks={tasks} />;
            case 'leads':
                return <Leads leads={leads} onSelectLead={handleOpenLeadModal} />;
            case 'contacts':
                return <Contacts contacts={contacts} setContacts={setContacts} />;
            case 'deals':
                return <Deals deals={deals} setDeals={setDeals} />;
            case 'tasks':
                return <Tasks tasks={tasks} setTasks={setTasks} />;
            case 'reports':
                return <Reports deals={deals} leads={leads} />;
            case 'ai-assistant':
                return <AIAssistant />;
            case 'profile':
                return <Profile />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard deals={deals} leads={leads} tasks={tasks}/>;
        }
    };

    if (!isLoggedIn) {
        return <Login onLogin={() => setIsLoggedIn(true)} />;
    }

    return (
        <div className="flex h-screen bg-gray-100 text-gray-800 transition-colors duration-300">
            <Sidebar 
              activeView={activeView} 
              setActiveView={setActiveView}
              onLogout={() => setIsLoggedIn(false)}
              isOpen={isSidebarOpen}
              setIsOpen={setIsSidebarOpen}
            />
            <div className="flex flex-col flex-1 w-full overflow-hidden">
                 <header className="sticky top-0 z-20 bg-gray-100/80 backdrop-blur-md">
                    <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200">
                        <div className="flex items-center">
                            <button
                                className="md:hidden mr-4 text-gray-600 hover:text-gray-900"
                                onClick={() => setIsSidebarOpen(true)}
                                aria-label="Open sidebar"
                            >
                                <MenuIcon />
                            </button>
                            <div>
                                <h1 className="text-xl md:text-3xl font-bold text-gray-900">{viewTitles[activeView]}</h1>
                                {activeView === 'dashboard' && <p className="hidden md:block mt-1 text-gray-500">Here are today's stats from your online store!</p>}
                            </div>
                        </div>
                        <div className="flex items-center space-x-2 md:space-x-6">
                            <GlobalSearch 
                                allData={{ leads, contacts, deals, tasks }}
                                onResultClick={(item, type) => {
                                    if(type === 'Lead') {
                                        handleOpenLeadModal(item as Lead);
                                    }
                                    // Add handlers for other types here if needed
                                }}
                            />
                            <div className="relative" ref={notificationsRef}>
                                <button 
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="relative p-2 text-gray-500 rounded-full hover:bg-gray-200 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-indigo-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                    </svg>
                                    {unreadCount > 0 && (
                                        <span className="absolute top-1.5 right-1.5 flex h-4 w-4">
                                            <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-red-500 text-white text-[10px] font-bold">{unreadCount}</span>
                                        </span>
                                    )}
                                </button>
                                {isNotificationsOpen && (
                                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-10">
                                        <div className="p-4 flex justify-between items-center border-b">
                                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                                            {unreadCount > 0 && (
                                                <button onClick={handleMarkAllAsRead} className="text-sm text-[#4F46E5] hover:underline focus:outline-none">
                                                    Mark all as read
                                                </button>
                                            )}
                                        </div>
                                        <ul className="divide-y max-h-80 overflow-y-auto no-scrollbar">
                                            {notifications.length > 0 ? notifications.map(notification => (
                                                <li key={notification.id} className={`${!notification.read ? 'bg-indigo-50' : 'bg-white'}`}>
                                                    <button onClick={() => handleNotificationClick(notification)} className="w-full text-left p-4 hover:bg-gray-50/50">
                                                        <div className="flex items-start">
                                                            {!notification.read && <div className="w-2 h-2 bg-indigo-500 rounded-full mt-1.5 mr-3 flex-shrink-0"></div>}
                                                            <div className="flex-1">
                                                                <p className={`text-sm ${!notification.read ? 'text-gray-800 font-medium' : 'text-gray-600'}`}>
                                                                    {notification.message}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {timeSince(new Date(notification.timestamp))}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </button>
                                                </li>
                                            )) : (
                                                <li className="p-4 text-center text-sm text-gray-500">No notifications yet.</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                            <div className="relative" ref={userMenuRef}>
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="flex items-center space-x-3 cursor-pointer">
                                    <img className="h-9 w-9 rounded-full object-cover" src="https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100" alt="User avatar" />
                                    <div className="hidden sm:block">
                                        <span className="font-semibold text-sm text-gray-800">Matthew Parker</span>
                                    </div>
                                </button>
                                {isUserMenuOpen && (
                                     <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 z-10">
                                        <button onClick={() => { setActiveView('profile'); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Your Profile</button>
                                        <button onClick={() => { setActiveView('settings'); setIsUserMenuOpen(false); }} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</button>
                                        <div className="border-t border-gray-200"></div>
                                        <button onClick={() => setIsLoggedIn(false)} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>
                <main className="flex-1 p-4 md:p-8 overflow-y-auto no-scrollbar">
                    {renderView()}
                </main>
            </div>
            {selectedLead !== null && (
                 <LeadDetailModal
                    lead={selectedLead === 'new' ? null : selectedLead}
                    onClose={() => setSelectedLead(null)}
                    onSave={handleSaveLead}
                    onDelete={handleDeleteLead}
                />
            )}
        </div>
    );
};

export default App;