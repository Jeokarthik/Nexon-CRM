import React, { useState, Fragment } from 'react';
import { DashboardIcon, LeadsIcon, ContactsIcon, DealsIcon, TasksIcon, AIIcon, LogoutIcon, ReportsIcon, LogoIcon, ChevronDownIcon, CloseIcon } from './icons';

// FIX: Added 'profile' and 'settings' to the View type to match the definition in App.tsx
type View = 'dashboard' | 'leads' | 'contacts' | 'deals' | 'tasks' | 'ai-assistant' | 'reports' | 'profile' | 'settings';

interface SidebarProps {
    activeView: View;
    setActiveView: (view: View) => void;
    onLogout: () => void;
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

const NavItem: React.FC<{
    icon: React.ReactNode;
    label: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ icon, label, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`flex items-center w-full px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out rounded-lg
            ${isActive
                ? 'bg-gray-800 text-white'
                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
            }`}
        >
            {icon}
            <span className="ml-4">{label}</span>
        </button>
    );
};

const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView, onLogout, isOpen, setIsOpen }) => {
    const [openSections, setOpenSections] = useState({
        main: true,
        clients: true,
        tools: true
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };
    
    const handleNavItemClick = (view: View) => {
        setActiveView(view);
        if (window.innerWidth < 768) { // md breakpoint
            setIsOpen(false);
        }
    };

    const navItems = {
        main: [
            { id: 'dashboard', icon: <DashboardIcon />, label: 'Dashboard' },
            { id: 'deals', icon: <DealsIcon />, label: 'Deals' },
            { id: 'tasks', icon: <TasksIcon />, label: 'Tasks' },
        ],
        clients: [
            { id: 'leads', icon: <LeadsIcon />, label: 'Leads' },
            { id: 'contacts', icon: <ContactsIcon />, label: 'Contacts' },
        ],
        tools: [
            { id: 'reports', icon: <ReportsIcon />, label: 'Reports' },
            { id: 'ai-assistant', icon: <AIIcon />, label: 'AI Assistant' },
        ]
    } as const;


    return (
         <Fragment>
            {/* Overlay for mobile */}
            <div
                className={`fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsOpen(false)}
            ></div>
            <aside className={`fixed inset-y-0 left-0 w-64 flex-shrink-0 bg-gray-900 p-4 flex flex-col justify-between z-30 transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div>
                    <div className="flex items-center justify-between mb-8 px-2">
                         <button 
                            onClick={() => handleNavItemClick('dashboard')} 
                            className="flex items-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white rounded-lg p-1 -ml-1"
                            aria-label="Go to dashboard"
                         >
                            <LogoIcon />
                            <h1 className="text-xl font-bold ml-2 text-white">Nexora</h1>
                        </button>
                         <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsOpen(false)} aria-label="Close sidebar">
                            <CloseIcon />
                        </button>
                    </div>
                    <nav className="px-2">
                         <div className="space-y-2">
                            {navItems.main.map((item) => (
                                <NavItem
                                    key={item.id}
                                    icon={item.icon}
                                    label={item.label}
                                    isActive={activeView === item.id}
                                    onClick={() => handleNavItemClick(item.id as View)}
                                />
                            ))}
                        </div>

                        <div className="mt-6">
                            <button onClick={() => toggleSection('clients')} className="flex items-center justify-between w-full mb-2 px-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300">
                                <span>Clients</span>
                                <span className={`transform transition-transform duration-200 ${openSections.clients ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
                            </button>
                            {openSections.clients && (
                                <div className="space-y-2">
                                    {navItems.clients.map((item) => (
                                        <NavItem
                                            key={item.id}
                                            icon={item.icon}
                                            label={item.label}
                                            isActive={activeView === item.id}
                                            onClick={() => handleNavItemClick(item.id as View)}
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                        
                        <div className="mt-6">
                             <button onClick={() => toggleSection('tools')} className="flex items-center justify-between w-full mb-2 px-1 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:text-gray-300">
                                 <span>Tools</span>
                                 <span className={`transform transition-transform duration-200 ${openSections.tools ? 'rotate-180' : ''}`}><ChevronDownIcon /></span>
                             </button>
                             {openSections.tools && (
                                 <div className="space-y-2">
                                    {navItems.tools.map((item) => (
                                        <NavItem
                                            key={item.id}
                                            icon={item.icon}
                                            label={item.label}
                                            isActive={activeView === item.id}
                                            onClick={() => handleNavItemClick(item.id as View)}
                                        />
                                    ))}
                                </div>
                             )}
                        </div>
                    </nav>
                </div>
                <div className="px-2">
                     <button
                        onClick={onLogout}
                        className="flex items-center w-full px-3 py-2.5 text-sm font-medium transition-colors duration-200 ease-in-out rounded-lg text-gray-400 hover:bg-gray-800 hover:text-white"
                    >
                        <LogoutIcon />
                        <span className="ml-4">Logout</span>
                    </button>
                </div>
            </aside>
        </Fragment>
    );
};

export default Sidebar;