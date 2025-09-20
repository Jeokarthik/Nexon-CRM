import React, { useState, useEffect, useRef } from 'react';
import { Lead, Contact, Deal, Task } from '../types';
import { SearchIcon } from './icons';

type SearchResultItem = Lead | Contact | Deal | Task;

type SearchResult = {
    item: SearchResultItem;
    name: string;
    context: string;
    type: 'Lead' | 'Contact' | 'Deal' | 'Task';
};

interface GlobalSearchProps {
    allData: {
        leads: Lead[];
        contacts: Contact[];
        deals: Deal[];
        tasks: Task[];
    },
    onResultClick: (item: SearchResultItem, type: SearchResult['type']) => void;
}


const useOnClickOutside = (ref: React.RefObject<HTMLDivElement>, handler: (event: MouseEvent | TouchEvent) => void) => {
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

const GlobalSearch: React.FC<GlobalSearchProps> = ({ allData, onResultClick }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isFocused, setIsFocused] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(searchRef, () => setIsFocused(false));

    useEffect(() => {
        if (searchTerm.trim() === '') {
            setResults([]);
            return;
        }

        const lowercasedTerm = searchTerm.toLowerCase();

        const leadResults: SearchResult[] = allData.leads
            .filter(l => l.name.toLowerCase().includes(lowercasedTerm) || l.company.toLowerCase().includes(lowercasedTerm))
            .map(l => ({ item: l, name: l.name, context: l.company, type: 'Lead' }));
        
        const contactResults: SearchResult[] = allData.contacts
            .filter(c => c.name.toLowerCase().includes(lowercasedTerm) || c.company.toLowerCase().includes(lowercasedTerm))
            .map(c => ({ item: c, name: c.name, context: c.company, type: 'Contact' }));

        const dealResults: SearchResult[] = allData.deals
            .filter(d => d.title.toLowerCase().includes(lowercasedTerm) || d.company.toLowerCase().includes(lowercasedTerm))
            .map(d => ({ item: d, name: d.title, context: d.company, type: 'Deal' }));

        const taskResults: SearchResult[] = allData.tasks
            .filter(t => t.title.toLowerCase().includes(lowercasedTerm) || t.relatedTo.toLowerCase().includes(lowercasedTerm))
            .map(t => ({ item: t, name: t.title, context: t.relatedTo, type: 'Task' }));

        setResults([...leadResults, ...contactResults, ...dealResults, ...taskResults].slice(0, 10));

    }, [searchTerm, allData]);

    const handleResultClick = (result: SearchResult) => {
        onResultClick(result.item, result.type);
        setSearchTerm('');
        setIsFocused(false);
    }

    const getBadgeColor = (type: SearchResult['type']) => {
        switch (type) {
            case 'Lead': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
            case 'Contact': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
            case 'Deal': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
            case 'Task': return 'bg-amber-100 text-amber-800 dark:bg-amber-900/50 dark:text-amber-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
        }
    };
    
    const showResults = isFocused && (results.length > 0 || (searchTerm && results.length === 0));

    return (
        <div className="relative w-40 md:w-64" ref={searchRef}>
            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                     <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    className="w-full p-2 pl-10 text-sm border-none bg-gray-200 dark:bg-gray-700 rounded-full text-gray-900 dark:text-gray-200 focus:ring-2 focus:ring-indigo-400 focus:bg-white dark:focus:bg-gray-600 outline-none transition-all duration-200"
                    aria-label="Global search"
                />
            </div>

            {showResults && (
                <div className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                    {results.length > 0 ? (
                        <ul className="max-h-80 overflow-y-auto divide-y divide-gray-200 dark:divide-gray-700">
                            {results.map(result => (
                                <li key={`${result.type}-${result.item.id}`}>
                                    <button onClick={() => handleResultClick(result)} className="block w-full text-left p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-gray-100">{result.name}</p>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{result.context}</p>
                                            </div>
                                            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getBadgeColor(result.type)}`}>
                                                {result.type}
                                            </span>
                                        </div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                         <div className="p-4">
                             <p className="text-center text-gray-500 dark:text-gray-400">No results found for "{searchTerm}"</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default GlobalSearch;