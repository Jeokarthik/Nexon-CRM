import React, { useState } from 'react';

const Settings: React.FC = () => {
    
    const SectionCard: React.FC<{ title: string; description: string; children: React.ReactNode }> = ({ title, description, children }) => (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
                <p className="mt-1 text-sm text-gray-500">{description}</p>
            </div>
            <div className="p-6">
                {children}
            </div>
        </div>
    );

    const ToggleSwitch: React.FC<{ label: string; enabled: boolean; onToggle: () => void }> = ({ label, enabled, onToggle }) => {
        const [isEnabled, setIsEnabled] = useState(enabled);
        
        const handleToggle = () => {
            setIsEnabled(!isEnabled);
            onToggle();
        };

        return (
             <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{label}</span>
                <button
                    onClick={handleToggle}
                    className={`${
                        isEnabled ? 'bg-[#4F46E5]' : 'bg-gray-200'
                    } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6366F1]`}
                >
                    <span
                        className={`${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                    />
                </button>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
             <SectionCard
                title="Notifications"
                description="Manage how you receive notifications from Nexora."
            >
                <div className="space-y-4">
                   <ToggleSwitch label="Email Notifications" enabled={true} onToggle={() => {}} />
                   <ToggleSwitch label="Push Notifications" enabled={true} onToggle={() => {}} />
                   <ToggleSwitch label="Weekly Summary Email" enabled={false} onToggle={() => {}} />
                </div>
            </SectionCard>

            <SectionCard
                title="Integrations"
                description="Connect Nexora with your favorite apps."
            >
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800">Google Calendar</p>
                            <p className="text-sm text-gray-500">Sync your tasks and events.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                            Connect
                        </button>
                    </div>
                     <div className="flex justify-between items-center">
                        <div>
                            <p className="font-medium text-gray-800">Slack</p>
                            <p className="text-sm text-gray-500">Get notifications in your workspace.</p>
                        </div>
                        <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900" disabled>
                            Connected
                        </button>
                    </div>
                </div>
            </SectionCard>
            
            <SectionCard
                title="Billing & Plan"
                description="Manage your subscription and payment details."
            >
                <div className="flex justify-between items-center">
                    <div>
                        <p className="font-medium text-gray-800">Pro Plan</p>
                        <p className="text-sm text-gray-500">$25/month - Renews on Oct 25, 2025</p>
                    </div>
                     <button className="px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] rounded-lg hover:bg-[#6366F1]">
                        Manage Billing
                    </button>
                </div>
            </SectionCard>
        </div>
    );
};

export default Settings;