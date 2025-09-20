import React, { useState } from 'react';
import type { Lead } from '../types';
import { PlusIcon } from './icons';


interface LeadsProps {
    leads: Lead[];
    onSelectLead: (lead: Lead | 'new') => void;
}

const StatusIndicator: React.FC<{ status: Lead['status'] }> = ({ status }) => {
    const colorMap = {
        'New': 'bg-blue-500',
        'Contacted': 'bg-amber-500',
        'Qualified': 'bg-green-500',
        'Lost': 'bg-red-500',
    };
    return (
        <div className="flex items-center">
            <div className={`w-2.5 h-2.5 rounded-full ${colorMap[status] || 'bg-gray-400'}`} />
            <span className="ml-2">{status}</span>
        </div>
    );
};


const Leads: React.FC<LeadsProps> = ({ leads, onSelectLead }) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 sr-only md:not-sr-only dark:text-gray-100">Leads</h1>
            <div className="flex justify-between items-center mb-4">
                <input
                    type="text"
                    placeholder="Search by name, company, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-indigo-500/50"
                    aria-label="Search leads"
                />
                <button 
                    onClick={() => onSelectLead('new')}
                    className="flex items-center justify-center px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] font-medium text-sm"
                >
                    <PlusIcon />
                    <span className="ml-2">Add Lead</span>
                </button>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full w-full text-sm text-left text-gray-600 dark:text-gray-300">
                        <thead className="text-xs text-gray-500 dark:text-gray-400 uppercase bg-gray-50 dark:bg-gray-700/50">
                            <tr>
                                <th scope="col" className="px-6 py-3 font-semibold">Name</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Company</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Email</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Value</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Status</th>
                                <th scope="col" className="px-6 py-3 font-semibold">Last Contact</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLeads.map((lead, index) => (
                                <tr key={lead.id} className={`hover:bg-gray-50 dark:hover:bg-gray-700/50 ${index < filteredLeads.length -1 ? 'border-b border-gray-200 dark:border-gray-700' : ''}`}>
                                    <td className="px-6 py-4 text-gray-900 dark:text-gray-100">
                                         <button 
                                            onClick={() => onSelectLead(lead)} 
                                            className="font-medium text-[#4F46E5] hover:underline whitespace-nowrap"
                                         >
                                            {lead.name}
                                         </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{lead.company}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{lead.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">${lead.value.toLocaleString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <StatusIndicator status={lead.status} />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">{lead.last_contact}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Leads;