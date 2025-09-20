import React, { useState, useEffect } from 'react';
import type { Lead, LeadNote } from '../types';
import { EditIcon, CloseIcon, TrashIcon } from './icons';

interface LeadDetailModalProps {
    lead: Lead | null;
    onClose: () => void;
    onSave: (updatedLead: Lead) => void;
    onDelete: (leadId: string) => void;
}

const emptyLead: Omit<Lead, 'id'> = {
    name: '',
    company: '',
    email: '',
    status: 'New',
    value: 0,
    last_contact: new Date().toISOString().split('T')[0],
    source: 'Website',
    notes: []
};

const LeadDetailModal: React.FC<LeadDetailModalProps> = ({ lead, onClose, onSave, onDelete }) => {
    const isNew = lead === null;
    const [isEditing, setIsEditing] = useState(isNew);
    const [editableLead, setEditableLead] = useState<Omit<Lead, 'id'> & { id?: string }>(isNew ? emptyLead : { ...lead });
    const [newNote, setNewNote] = useState('');

    useEffect(() => {
        setEditableLead(isNew ? emptyLead : { ...lead });
        setIsEditing(isNew);
    }, [lead, isNew]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditableLead(prev => ({ ...prev, [name]: name === 'value' ? Number(value) : value }));
    };

    const handleAddNote = () => {
        if (newNote.trim() === '') return;
        const note: LeadNote = {
            id: `note_${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            note: newNote,
        };
        setEditableLead(prev => ({ ...prev, notes: [note, ...prev.notes] }));
        setNewNote('');
    };
    
    const handleSave = () => {
        const finalLead: Lead = {
            id: editableLead.id || `lead_${Date.now()}`,
            ...editableLead,
        };
        onSave(finalLead);
    };
    
    const handleDelete = () => {
        if (editableLead.id && window.confirm(`Are you sure you want to delete lead: ${editableLead.name}?`)) {
            onDelete(editableLead.id);
        }
    };

    const handleCancel = () => {
        if(isNew) {
            onClose();
        } else {
            setEditableLead({ ...lead });
            setIsEditing(false);
        }
    };

    const renderField = (label: string, name: keyof Lead, type: 'text' | 'number' | 'date' | 'select' = 'text') => {
        const value = editableLead[name as keyof typeof editableLead];

        if (isEditing) {
            if (name === 'status') {
                return (
                     <div className="sm:col-span-1">
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
                        <select
                            name="status"
                            value={editableLead.status}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm bg-white outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                        >
                            <option>New</option>
                            <option>Contacted</option>
                            <option>Qualified</option>
                            <option>Lost</option>
                        </select>
                    </div>
                );
            }
            if (typeof value !== 'string' && typeof value !== 'number') {
                return null;
            }
            return (
                <div className="sm:col-span-1">
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
                    <input
                        type={type}
                        name={name}
                        value={value}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm bg-white outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                    />
                </div>
            );
        }

        if (typeof value !== 'string' && typeof value !== 'number') {
            return null;
        }
        return (
            <div className="sm:col-span-1">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</p>
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{name === 'value' ? `$${(value as number).toLocaleString()}` : value}</p>
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-2xl max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
                <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-600">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{isNew ? "Add New Lead" : editableLead.name}</h2>
                    <div>
                        {!isNew && !isEditing && (
                            <button onClick={() => setIsEditing(true)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                                <EditIcon />
                            </button>
                        )}
                         {!isNew && (
                            <button onClick={handleDelete} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 hover:text-red-500">
                                <TrashIcon />
                            </button>
                        )}
                        <button onClick={onClose} className="ml-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300">
                            <CloseIcon />
                        </button>
                    </div>
                </div>

                <div className="p-6 overflow-y-auto">
                    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 mb-6">
                        {renderField('Name', 'name')}
                        {renderField('Company', 'company')}
                        {renderField('Email', 'email')}
                        {renderField('Value', 'value', 'number')}
                        {renderField('Status', 'status', 'select')}
                        {renderField('Source', 'source')}
                        {renderField('Last Contact', 'last_contact', 'date')}
                    </div>

                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-4">Interaction History</h3>
                        {isEditing && (
                            <div className="mb-4">
                                <textarea
                                    rows={3}
                                    className="w-full p-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 sm:text-sm bg-white outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
                                    placeholder="Add a new note..."
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                ></textarea>
                                <button onClick={handleAddNote} className="mt-2 px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] text-sm font-medium">Add Note</button>
                            </div>
                        )}
                        <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                           {editableLead.notes.length > 0 ? editableLead.notes.map(note => (
                                <div key={note.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{new Date(note.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-800 dark:text-gray-200">{note.note}</p>
                                </div>
                            )) : <p className="text-sm text-gray-500 dark:text-gray-400">No notes yet.</p>}
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-600">
                        <button onClick={handleCancel} className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-600 mr-2">Cancel</button>
                        <button onClick={handleSave} className="px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1]">{isNew ? 'Add Lead' : 'Save Changes'}</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadDetailModal;