export interface LeadNote {
    id: string;
    date: string;
    note: string;
}

export interface Lead {
    id:string;
    name: string;
    company: string;
    email: string;
    status: 'New' | 'Contacted' | 'Qualified' | 'Lost';
    value: number;
    last_contact: string;
    source: 'Website' | 'Referral' | 'Cold Call' | 'Event';
    notes: LeadNote[];
}

export interface Contact {
    id: string;
    name: string;
    company: string;
    phone: string;
    email: string;
    tags: string[];
}

export enum DealStatus {
    New = 'New',
    Proposal = 'Proposal Sent',
    Negotiation = 'Negotiation',
    ClosedWon = 'Closed - Won',
    ClosedLost = 'Closed - Lost',
}
export interface Deal {
    id: string;
    title: string;
    contactName: string;
    company: string;
    value: number;
    status: DealStatus;
    closeDate: string;
}

export enum TaskPriority {
    High = 'High',
    Medium = 'Medium',
    Low = 'Low',
}

export interface Task {
    id: string;
    title: string;
    dueDate: string; // 'YYYY-MM-DD'
    dueTime?: string; // Optional 'HH:MM' (24-hour format)
    completed: boolean;
    relatedTo: string; // e.g., "Lead: John Smith" or "Deal: Acme Corp Website"
    priority: TaskPriority;
    reminder?: 'none' | '5m' | '15m' | '1h' | '1d';
}

export interface AppNotification {
    id: string;
    message: string;
    type: 'lead' | 'deal' | 'task' | 'general';
    relatedId?: string;
    read: boolean;
    timestamp: string; // ISO String
}
