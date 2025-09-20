import React, { useState, useRef, useEffect } from 'react';
import type { Contact } from '../types';
import { PlusIcon, TrashIcon, EditIcon } from './icons';

interface ContactModalProps {
    contact: Contact | null;
    onSave: (contact: Contact) => void;
    onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ contact, onSave, onClose }) => {
    const [formData, setFormData] = useState<Omit<Contact, 'id'|'tags'> & {tags: string}>({
        name: '', company: '', phone: '', email: '', tags: ''
    });

    useEffect(() => {
        if (contact) {
            setFormData({...contact, tags: contact.tags.join(', ')});
        } else {
            setFormData({ name: '', company: '', phone: '', email: '', tags: '' });
        }
    }, [contact]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const finalContact: Contact = {
            id: contact?.id || `contact_${Date.now()}`,
            ...formData,
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };
        onSave(finalContact);
    };

    return (
         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50 p-4" onClick={onClose}>
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 w-full max-w-md" onClick={e => e.stopPropagation()}>
                <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 p-4 border-b dark:border-gray-600">{contact ? 'Edit Contact' : 'Add Contact'}</h2>
                <form onSubmit={handleSubmit}>
                    <div className="p-6 space-y-4">
                        <input name="name" value={formData.name} onChange={handleChange} placeholder="Name" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
                        <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" required />
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                        <input name="tags" value={formData.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100" />
                    </div>
                    <div className="flex justify-end p-4 border-t dark:border-gray-600">
                        <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 dark:text-gray-200 rounded mr-2">Cancel</button>
                        <button type="submit" className="px-4 py-2 bg-[#4F46E5] text-white rounded">Save</button>
                    </div>
                </form>
            </div>
        </div>
    );
};


interface ContactsProps {
    contacts: Contact[];
    setContacts: React.Dispatch<React.SetStateAction<Contact[]>>;
}

const Contacts: React.FC<ContactsProps> = ({ contacts, setContacts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingContact, setEditingContact] = useState<Contact | null>(null);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const menuRef = useRef<HTMLDivElement>(null);

     useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setOpenMenuId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSaveContact = (contact: Contact) => {
        if (contacts.some(c => c.id === contact.id)) {
            setContacts(contacts.map(c => c.id === contact.id ? contact : c));
        } else {
            setContacts([contact, ...contacts]);
        }
        setIsModalOpen(false);
        setEditingContact(null);
    };

    const handleDeleteContact = (contactId: string) => {
        setContacts(contacts.filter(c => c.id !== contactId));
        setOpenMenuId(null);
    };

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    
    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 sr-only md:not-sr-only">Contacts</h1>
            <div className="flex justify-between items-center mb-6">
                <input
                    type="text"
                    placeholder="Search by name, company, email, or tag..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full max-w-md p-2 border border-gray-300 rounded-lg bg-white text-gray-900 focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:placeholder-gray-400"
                    aria-label="Search contacts"
                />
                 <button 
                    onClick={() => { setEditingContact(null); setIsModalOpen(true); }}
                    className="flex items-center justify-center px-4 py-2 bg-[#4F46E5] text-white rounded-lg hover:bg-[#6366F1] font-medium text-sm"
                >
                    <PlusIcon />
                    <span className="ml-2">Add Contact</span>
                </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredContacts.map(contact => (
                    <div key={contact.id} className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 flex flex-col transition-shadow duration-200 ease-in-out shadow-sm hover:shadow-md">
                        <div className="p-6 flex-grow">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-4">
                                     <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                        <span className="text-xl font-bold text-gray-500 dark:text-gray-400">{getInitials(contact.name)}</span>
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{contact.name}</h2>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">{contact.company}</p>
                                    </div>
                                </div>
                                <div className="relative">
                                    <button onClick={() => setOpenMenuId(openMenuId === contact.id ? null : contact.id)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 -mt-1 -mr-1 p-1">&#8942;</button>
                                     {openMenuId === contact.id && (
                                        <div ref={menuRef} className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-900 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-10">
                                            <button onClick={() => { setEditingContact(contact); setIsModalOpen(true); setOpenMenuId(null); }} className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"><EditIcon/> <span className="ml-2">Edit</span></button>
                                            <button onClick={() => handleDeleteContact(contact.id)} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700"><TrashIcon/> <span className="ml-2">Delete</span></button>
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="mt-4 space-y-2 text-sm text-gray-600 dark:text-gray-300">
                                <p>{contact.email}</p>
                                <p>{contact.phone}</p>
                            </div>
                            <div className="mt-4 flex flex-wrap gap-2">
                                {contact.tags.map(tag => (
                                    <span key={tag} className="px-2 py-1 text-xs font-medium text-purple-800 bg-purple-100 rounded-full dark:bg-purple-900/50 dark:text-purple-300">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                         <div className="px-6 py-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 rounded-b-xl flex space-x-2">
                            <button onClick={() => alert(`Calling ${contact.name}...`)} className="flex-1 text-center px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Call</button>
                            <button onClick={() => alert(`Mailing ${contact.name}...`)} className="flex-1 text-center px-3 py-1.5 text-sm font-medium rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600">Mail</button>
                        </div>
                    </div>
                ))}
            </div>
             {isModalOpen && (
                <ContactModal 
                    contact={editingContact}
                    onSave={handleSaveContact}
                    onClose={() => setIsModalOpen(false)}
                />
            )}
        </div>
    );
};

export default Contacts;