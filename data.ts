import { Lead, Contact, Deal, Task, DealStatus, TaskPriority } from './types';

export const leads: Lead[] = [
    { 
        id: 'lead_001', name: 'John Smith', company: 'Acme Corp', email: 'john@acme.com', status: 'Contacted', value: 5000, last_contact: '2025-09-15', source: 'Website',
        notes: [
            { id: 'note_1', date: '2025-09-15', note: 'Initial contact made. Sent introductory email.' },
            { id: 'note_2', date: '2025-09-17', note: 'Followed up via phone call. Scheduled a demo for next week.' }
        ]
    },
    { 
        id: 'lead_002', name: 'Jane Doe', company: 'Innovate LLC', email: 'jane.d@innovate.com', status: 'New', value: 12000, last_contact: '2025-09-20', source: 'Referral',
        notes: [
             { id: 'note_3', date: '2025-09-20', note: 'Received referral from existing client. High priority.' }
        ]
    },
    { 
        id: 'lead_003', name: 'Peter Jones', company: 'Solutions Inc.', email: 'peter.j@solutions.com', status: 'Qualified', value: 7500, last_contact: '2025-09-18', source: 'Cold Call',
        notes: [
             { id: 'note_4', date: '2025-09-18', note: 'Completed demo call. Peter is very interested in our premium package.' }
        ]
    },
    { 
        id: 'lead_004', name: 'Mary Garcia', company: 'Tech Forward', email: 'm.garcia@techfwd.com', status: 'Lost', value: 3000, last_contact: '2025-09-05', source: 'Event',
        notes: [
            { id: 'note_5', date: '2025-09-05', note: 'Met at the tech conference. Followed up, but they chose a competitor.' }
        ]
    },
    { 
        id: 'lead_005', name: 'David Miller', company: 'Global Solutions', email: 'david@globalsol.com', status: 'New', value: 25000, last_contact: '2025-09-21', source: 'Website',
        notes: []
    },
    { 
        id: 'lead_006', name: 'Linda Wilson', company: 'Creative Co.', email: 'linda.w@creative.co', status: 'Contacted', value: 8000, last_contact: '2025-09-19', source: 'Referral',
        notes: [
            { id: 'note_6', date: '2025-09-19', note: 'Sent initial outreach email.' }
        ]
    },
];

export const contacts: Contact[] = [
    { id: 'contact_001', name: 'John Smith', company: 'Acme Corp', phone: '555-1234', email: 'john@acme.com', tags: ['Client', 'Tech'] },
    { id: 'contact_002', name: 'Jane Doe', company: 'Innovate LLC', phone: '555-5678', email: 'jane.d@innovate.com', tags: ['Lead', 'SaaS'] },
    { id: 'contact_003', name: 'Peter Jones', company: 'Solutions Inc.', phone: '555-8765', email: 'peter.j@solutions.com', tags: ['Client', 'Consulting'] },
    { id: 'contact_004', name: 'Sarah Chen', company: 'Data Systems', phone: '555-4321', email: 'sarah.c@datasys.com', tags: ['Partner'] },
];

export const deals: Deal[] = [
    { id: 'deal_001', title: 'Acme Corp Website Redesign', contactName: 'John Smith', company: 'Acme Corp', value: 5000, status: DealStatus.Proposal, closeDate: '2025-10-15' },
    { id: 'deal_002', title: 'Innovate LLC SaaS Subscription', contactName: 'Jane Doe', company: 'Innovate LLC', value: 12000, status: DealStatus.Negotiation, closeDate: '2025-11-01' },
    { id: 'deal_003', title: 'Solutions Inc. Consulting Retainer', contactName: 'Peter Jones', company: 'Solutions Inc.', value: 7500, status: DealStatus.ClosedWon, closeDate: '2025-09-20' },
    { id: 'deal_004', title: 'Tech Forward Marketing Campaign', contactName: 'Mary Garcia', company: 'Tech Forward', value: 3000, status: DealStatus.ClosedLost, closeDate: '2025-09-10' },
    { id: 'deal_005', 'title': 'Global Solutions Cloud Migration', contactName: 'David Miller', company: 'Global Solutions', value: 25000, status: DealStatus.New, closeDate: '2025-12-01' },
    { id: 'deal_006', title: 'New Project Alpha', contactName: 'Alex Ray', company: 'StartupX', value: 15000, status: DealStatus.New, closeDate: '2025-11-20' },
    { id: 'deal_007', title: 'Design Overhaul', contactName: 'Casey Lee', company: 'Creative Co.', value: 9500, status: DealStatus.Proposal, closeDate: '2025-10-30' },
];

export const tasks: Task[] = [
    { id: 'task_001', title: 'Follow up with John Smith', dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], dueTime: '10:00', completed: false, relatedTo: 'Deal: Acme Corp Website Redesign', priority: TaskPriority.High, reminder: '1h' },
    { id: 'task_002', title: 'Prepare proposal for Innovate LLC', dueDate: new Date().toISOString().split('T')[0], dueTime: '14:30', completed: false, relatedTo: 'Deal: Innovate LLC SaaS Subscription', priority: TaskPriority.High, reminder: '15m' },
    { id: 'task_003', title: 'Send invoice to Solutions Inc.', dueDate: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString().split('T')[0], completed: true, relatedTo: 'Deal: Solutions Inc. Consulting Retainer', priority: TaskPriority.Low, reminder: 'none' },
    { id: 'task_004', title: 'Schedule demo with David Miller', dueDate: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString().split('T')[0], completed: false, relatedTo: 'Lead: David Miller', priority: TaskPriority.Medium, reminder: '1d' },
    { id: 'task_005', title: 'Research new leads', dueDate: new Date(new Date().setDate(new Date().getDate() + 5)).toISOString().split('T')[0], completed: false, relatedTo: 'General', priority: TaskPriority.Low, reminder: 'none' },
];

export const salesPerformanceData = [
    { name: 'Jan', Sales: 4000, LastYear: 2400 },
    { name: 'Feb', Sales: 3000, LastYear: 1398 },
    { name: 'Mar', Sales: 5000, LastYear: 6800 },
    { name: 'Apr', Sales: 4780, LastYear: 3908 },
    { name: 'May', Sales: 5890, LastYear: 4800 },
    { name: 'Jun', Sales: 4390, LastYear: 3800 },
    { name: 'Jul', Sales: 5490, LastYear: 4300 },
    { name: 'Aug', Sales: 4490, LastYear: 3300 },
    { name: 'Sep', Sales: 6490, LastYear: 4300 },
    { name: 'Oct', Sales: 5490, LastYear: 4300 },
    { name: 'Nov', Sales: 5990, LastYear: 4500 },
    { name: 'Dec', Sales: 7490, LastYear: 5300 },
];