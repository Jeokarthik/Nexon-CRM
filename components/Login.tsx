import React from 'react';
import { LogoIcon } from './icons';

interface LoginProps {
    onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <div className="w-full max-w-md p-8 bg-white rounded-xl border border-gray-200">
                <div className="flex flex-col items-center">
                    <div className="flex items-center mb-4">
                        <div className="bg-[#4F46E5] text-white font-bold rounded-lg p-3 flex items-center justify-center">
                            <LogoIcon />
                        </div>
                        <h1 className="text-2xl font-bold ml-3 text-gray-900">Nexora CRM</h1>
                    </div>
                    <h2 className="text-xl text-center text-gray-700">Welcome back</h2>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="email-address" className="sr-only">Email address</label>
                            <input 
                                id="email-address" 
                                name="email" 
                                type="email" 
                                autoComplete="email" 
                                required 
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 sm:text-sm" 
                                placeholder="Email address"
                                defaultValue="demo@example.com"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input 
                                id="password" 
                                name="password" 
                                type="password" 
                                autoComplete="current-password" 
                                required 
                                className="appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500 sm:text-sm" 
                                placeholder="Password"
                                defaultValue="password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-end">
                        <div className="text-sm">
                            <a href="#" onClick={(e) => { e.preventDefault(); alert('Forgot password clicked!'); }} className="font-medium text-[#4F46E5] hover:text-[#6366F1]">
                                Forgot password?
                            </a>
                        </div>
                    </div>

                    <div>
                        <button type="submit" className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-[#4F46E5] hover:bg-[#6366F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4F46E5]">
                            Sign in
                        </button>
                    </div>
                </form>
                 <p className="mt-6 text-center text-sm text-gray-600">
                    Don't have an account?{' '}
                    <a href="#" onClick={(e) => { e.preventDefault(); alert('Sign up clicked!'); }} className="font-medium text-[#4F46E5] hover:text-[#6366F1]">
                        Sign up
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Login;