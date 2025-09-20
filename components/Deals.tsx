import React, { useState } from 'react';
import { Deal, DealStatus } from '../types';
import { PlusIcon, TrashIcon } from './icons';

interface DealModalProps {
    onSave: (deal: Deal) => void;
    onClose: () => void;
}

const DealModal: React.FC<DealModalProps> = ({ onSave, onClose }) => {
    const [formData, setFormData] = useState({
        title: '', contactName: '', company: '', value: 0, status: DealStatus.New, closeDate: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData({ ...formData, [name]: type === 'number' ? Number(value) : value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({ ...formData, id: `deal_${Date.now()}` });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 p-4 border-b dark:border-gray-600">Add New Deal</h2>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <input name="title" value={formData.title} onChange={handleChange} placeholder="Deal Title" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        <input name="contactName" value={formData.contactName} onChange={handleChange} placeholder="Contact Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" />
                        <input name="value" type="number" value={formData.value} onChange={handleChange} placeholder="Value" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                        <input name="closeDate" type="date" value={formData.closeDate} onChange={handleChange} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600" required />
                    </div>
                    <div className="flex justify-end p-4 border-t dark:border-gray-600">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 rounded mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#4F46E5] text-white rounded">Save Deal</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const DealCard: React.FC<{ 
    deal: Deal, 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void,
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void,
    onDelete: (dealId: string) => void,
    isDragging: boolean
}> = ({ deal, onDragStart, onDragEnd, onDelete, isDragging }) => {
    return (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, deal.id)}
            onDragEnd={onDragEnd}
            className={`bg-white dark:bg-gray-700 p-4 mb-4 rounded-xl cursor-grab active:cursor-grabbing border border-gray-200 dark:border-gray-600 shadow-sm transition-all duration-200 hover:shadow-md group ${isDragging ? 'opacity-40 border-dashed border-indigo-500 scale-95' : ''}`}
        >
            <div className="flex justify-between items-start">
                <h4 className="font-semibold text-gray-800 dark:text-gray-100 pr-2">{deal.title}</h4>
                <button onClick={() => onDelete(deal.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrashIcon/>
                </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-300">{deal.company}</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-gray-50 mt-2">${deal.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 dark:text-gray-400 mt-1">Close Date: {new Date(deal.closeDate).toLocaleDateString()}</p>
        </div>
    );
};

const DealColumn: React.FC<{ 
    title: string; 
    status: DealStatus; 
    deals: Deal[]; 
    onDragStart: (e: React.DragEvent<HTMLDivElement>, dealId: string) => void;
    onDragEnd: (e: React.DragEvent<HTMLDivElement>) => void;
    onDrop: (e: React.DragEvent<HTMLDivElement>, status: DealStatus) => void;
    onDeleteDeal: (dealId: string) => void;
    onDragOver: (e: React.DragEvent<HTMLDivElement>, status: DealStatus) => void;
    isDraggingOver: boolean;
    draggedDealId: string | null;
}> = ({ title, status, deals, onDragStart, onDragEnd, onDrop, onDeleteDeal, onDragOver, isDraggingOver, draggedDealId }) => {
    return (
        <div 
            className={`bg-white rounded-xl shadow-sm p-4 flex-1 min-w-[280px] border border-gray-200 transition-colors duration-200 dark:bg-gray-800 dark:border-gray-700 ${isDraggingOver ? 'bg-indigo-50 dark:bg-indigo-900/40' : 'bg-white dark:bg-gray-800'}`}
            onDragOver={(e) => onDragOver(e, status)}
            onDrop={(e) => onDrop(e, status)}
        >
            <h3 className="text-base font-semibold mb-4 text-gray-900 dark:text-gray-100 border-b border-gray-200 dark:border-gray-700 pb-2">
                {title} <span className="text-sm font-normal text-gray-500">{deals.length}</span>
            </h3>
            <div className="h-full">
                {deals.map(deal => (
                    <DealCard 
                        key={deal.id} 
                        deal={deal} 
                        onDragStart={onDragStart}
                        onDragEnd={onDragEnd}
                        onDelete={onDeleteDeal}
                        isDragging={draggedDealId === deal.id}
                    />
                ))}
            </div>
        </div>
    );
};

interface DealsProps {
    deals: Deal[];
    setDeals: React.Dispatch<React.SetStateAction<Deal[]>>;
}

const Deals: React.FC<DealsProps> = ({ deals, setDeals }) => {
    const [statusFilter, setStatusFilter] = useState<DealStatus | 'all'>('all');
    const [sortBy, setSortBy] = useState<'closeDate' | 'value'>('closeDate');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [draggedDealId, setDraggedDealId] = useState<string | null>(null);
    const [isDraggingOver, setIsDraggingOver] = useState<DealStatus | null>(null);

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, dealId: string) => {
        e.dataTransfer.setData("dealId", dealId);
        setDraggedDealId(dealId);
    };

    const handleDragEnd = () => {
        setDraggedDealId(null);
        setIsDraggingOver(null);
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>, newStatus: DealStatus) => {
        e.preventDefault();
        const dealId = e.dataTransfer.getData("dealId");
        setDeals(prevDeals =>
            prevDeals.map(deal =>
                deal.id === dealId ? { ...deal, status: newStatus } : deal
            )
        );
        setIsDraggingOver(null);
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>, status: DealStatus) => {
        e.preventDefault();
        setIsDraggingOver(status);
    };

    const handleAddDeal = (deal: Deal) => {
        setDeals(prev => [deal, ...prev]);
        setIsModalOpen(false);
    }
    
    const handleDeleteDeal = (dealId: string) => {
        setDeals(prev => prev.filter(d => d.id !== dealId));
    }

    const columns: { title: string, status: DealStatus }[] = [
        { title: 'New', status: DealStatus.New },
        { title: 'Proposal Sent', status: DealStatus.Proposal },
        { title: 'Negotiation', status: DealStatus.Negotiation },
        { title: 'Closed - Won', status: DealStatus.ClosedWon },
        { title: 'Closed - Lost', status: DealStatus.ClosedLost },
    ];

    const displayedColumns = statusFilter === 'all'
        ? columns
        : columns.filter(col => col.status === statusFilter);

    const sortedDeals = [...deals].sort((a, b) => {
        if (sortBy === 'value') {
            return b.value - a.value; // Descending for value
        }
        return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
    });

    return (
        <div className="h-full flex flex-col">
            <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 sr-only md:not-sr-only">Deals Pipeline</h1>
                <div className="flex flex-wrap gap-4 mb-4">
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as DealStatus | 'all')}
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                        aria-label="Filter by status"
                    >
                        <option value="all">All Statuses</option>
                        {Object.values(DealStatus).map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as 'closeDate' | 'value')}
                        className="p-2 border border-gray-300 rounded-lg bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none"
                        aria-label="Sort by"
                    >
                        <option value="closeDate">Sort by Close Date</option>
                        <option value="value">Sort by Value</option>
                    </select>
                    <button onClick={() => setIsModalOpen(true)} className="flex items-center ml-auto px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] font-medium text-sm">
                        <PlusIcon/>
                        <span className="ml-2">Add Deal</span>
                    </button>
                </div>
            </div>
            <div className="flex-grow flex gap-6 overflow-x-auto pb-4" onDragLeave={() => setIsDraggingOver(null)}>
                {displayedColumns.map(col => (
                    <DealColumn
                        key={col.status}
                        title={col.title}
                        status={col.status}
                        deals={sortedDeals.filter(d => d.status === col.status)}
                        onDragStart={handleDragStart}
                        onDragEnd={handleDragEnd}
                        onDrop={handleDrop}
                        onDeleteDeal={handleDeleteDeal}
                        onDragOver={handleDragOver}
                        isDraggingOver={isDraggingOver === col.status}
                        draggedDealId={draggedDealId}
                    />
                ))}
            </div>
            {isModalOpen && <DealModal onSave={handleAddDeal} onClose={() => setIsModalOpen(false)} />}
        </div>
    );
};

export default Deals;