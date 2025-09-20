import React, { useState } from 'react';
import { generateEmail } from '../services/geminiService';

const AIAssistant: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [emailType, setEmailType] = useState<'follow-up' | 'outreach' | 'reminder'>('follow-up');
    const [generatedEmail, setGeneratedEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!prompt.trim()) return;
        setIsLoading(true);
        setGeneratedEmail('');
        try {
            const result = await generateEmail(prompt, emailType);
            setGeneratedEmail(result);
        } catch (error) {
            setGeneratedEmail("Failed to generate email. Please check your API key and network connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-gray-100 sr-only md:not-sr-only">AI Assistant</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Email Generator</h2>
                    
                    <div className="mb-4">
                        <label htmlFor="emailType" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Type</label>
                        <select
                            id="emailType"
                            value={emailType}
                            onChange={(e) => setEmailType(e.target.value as 'follow-up' | 'outreach' | 'reminder')}
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 sm:text-sm rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                        >
                            <option value="follow-up">Follow-up</option>
                            <option value="outreach">Cold Outreach</option>
                            <option value="reminder">Reminder</option>
                        </select>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Describe what the email should be about
                        </label>
                        <textarea
                            id="prompt"
                            rows={4}
                            className="mt-1 block w-full sm:text-sm border-gray-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 outline-none dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600"
                            placeholder="e.g., Follow up with John from Acme Corp about the proposal we sent last week."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                        />
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleGenerate}
                            disabled={isLoading || !prompt.trim()}
                            className="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4F46E5] hover:bg-[#6366F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5] disabled:bg-indigo-400 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </>
                            ) : 'Generate Email'}
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                     <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Generated Email</h2>
                     <div className="prose prose-sm max-w-none bg-gray-50 dark:bg-gray-900 dark:text-gray-300 rounded-md p-4 h-96 overflow-y-auto whitespace-pre-wrap font-sans">
                        {generatedEmail || <span className="text-gray-400 dark:text-gray-500">Your generated email will appear here...</span>}
                     </div>
                </div>
            </div>
        </div>
    );
};

export default AIAssistant;