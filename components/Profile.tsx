import React, { useState, useRef } from 'react';

const mockUser = {
    name: 'Matthew Parker',
    jobTitle: 'Senior Account Executive',
    email: 'matthew.parker@nexora.com',
    phone: '1-800-555-1234',
    bio: "Seasoned sales executive with over 10 years of experience in the SaaS industry. Passionate about building strong client relationships and driving revenue growth. In my free time, I enjoy hiking and exploring new technologies.",
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=100'
};

const Profile: React.FC = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState(mockUser);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
    };
    
    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
                // In a real app, you would also prepare to upload the file
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        if (avatarPreview) {
            setProfileData(prev => ({...prev, avatar: avatarPreview}));
        }
        setIsEditing(false);
        // Here you would typically make an API call to save the data
        alert('Profile saved!');
    };

    const handleCancel = () => {
        setProfileData(mockUser);
        setAvatarPreview(null);
        setIsEditing(false);
    };

    const InfoField = ({ label, value, name, isEditing }: { label: string, value: string, name: keyof typeof mockUser, isEditing: boolean }) => (
        <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{label}</label>
            {isEditing ? (
                <input
                    type="text"
                    name={name}
                    value={value}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                />
            ) : (
                <p className="mt-1 text-sm text-gray-900 dark:text-gray-100">{value}</p>
            )}
        </div>
    );
    
    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
                <div className="p-6 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
                    {!isEditing && (
                        <button
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] rounded-lg hover:bg-[#6366F1]"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
                <div className="border-t border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex flex-col sm:flex-row items-center sm:items-start sm:space-x-6">
                        <div className="relative mb-4 sm:mb-0">
                            <img
                                className="h-24 w-24 rounded-full object-cover"
                                src={avatarPreview || profileData.avatar}
                                alt="User avatar"
                            />
                            {isEditing && (
                                <>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow border hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600"
                                        aria-label="Change profile picture"
                                    >
                                        <svg className="w-4 h-4 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                    </button>
                                </>
                            )}
                        </div>
                        <div className="text-center sm:text-left">
                             {isEditing ? (
                                <input
                                    type="text"
                                    name="name"
                                    value={profileData.name}
                                    onChange={handleInputChange}
                                    className="text-2xl font-bold text-gray-900 text-center sm:text-left rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{profileData.name}</h2>
                            )}
                             {isEditing ? (
                                 <input
                                    type="text"
                                    name="jobTitle"
                                    value={profileData.jobTitle}
                                    onChange={handleInputChange}
                                    className="mt-1 text-md text-gray-500 text-center sm:text-left rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 bg-white dark:bg-gray-700 dark:text-gray-400 dark:border-gray-600"
                                />
                             ) : (
                                <p className="text-md text-gray-500 dark:text-gray-400">{profileData.jobTitle}</p>
                             )}
                        </div>
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">About</h3>
                        {isEditing ? (
                            <textarea
                                name="bio"
                                rows={4}
                                value={profileData.bio}
                                onChange={handleInputChange}
                                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm bg-white dark:bg-gray-700 dark:text-gray-100 dark:border-gray-600"
                            />
                        ) : (
                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 whitespace-pre-wrap">
                                {profileData.bio}
                            </p>
                        )}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Contact Information</h3>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InfoField label="Email Address" value={profileData.email} name="email" isEditing={isEditing} />
                            <InfoField label="Phone Number" value={profileData.phone} name="phone" isEditing={isEditing} />
                        </div>
                    </div>

                    {isEditing && (
                        <div className="mt-8 flex justify-end gap-4">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-500 dark:hover:bg-gray-600"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="px-4 py-2 text-sm font-medium text-white bg-[#4F46E5] rounded-lg hover:bg-[#6366F1]"
                            >
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;