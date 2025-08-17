
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';

const Profilepage = () => {
    const { authUser, updateProfile } = useContext(AuthContext);

    const [selectedImg, setSelectedImg] = useState(null);
    const [name, setName] = useState(authUser?.fullName || "");
    const [bio, setBio] = useState(authUser?.bio || "");
    const [preview, setPreview] = useState(null);
    const navigate = useNavigate()

    useEffect(() => {
        setName(authUser?.fullName || "");
        setBio(authUser?.bio || "");
    }, [authUser]);

    useEffect(() => {
        if (selectedImg) {
            const objectUrl = URL.createObjectURL(selectedImg);
            setPreview(objectUrl);

            return () => URL.revokeObjectURL(objectUrl);
        } else {
            setPreview(null);
        }
    }, [selectedImg]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            let profilePic;

            if (selectedImg) {
                const reader = new FileReader();
                reader.readAsDataURL(selectedImg);

                reader.onload = async () => {
                    profilePic = reader.result;
                    await updateProfile({ profilePic, fullName: name, bio });
                    navigate('/');
                };
            } else {
                await updateProfile({ fullName: name, bio });
                navigate('/');
            }
        } catch (error) {
            console.error("Profile update failed:", error);
        }
    };

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <img src={assets.arrow_icon} alt="arrow" className='cursor-pointer' onClick={()=>navigate('/')} />
            <div className='w-5/6 max-w-4xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex justify-between items-center max-sm:flex-col-reverse rounded-l-lg'>

                <form onSubmit={handleSubmit} className='flex flex-col p-10 gap-5 flex-1'>
                    <h3 className='text-lg'>Profile Details</h3>

                    <label htmlFor="avatar" className='flex items-center gap-3 cursor-pointer'>
                        <input
                            onChange={(e) => setSelectedImg(e.target.files[0])}
                            type="file"
                            id='avatar'
                            accept='.jpeg, .png, .jpg'
                        />
                        <img
                            src={preview || authUser?.profilePic || assets.avatar_icon}
                            alt="profile"
                            className='w-12 h-12 rounded-full'
                        />
                        Upload profile image
                    </label>

                    <input
                        onChange={(e) => setName(e.target.value)}
                        value={name}
                        type="text"
                        placeholder='Your Name'
                        required
                        className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-50'
                    />

                    <textarea
                        onChange={(e) => setBio(e.target.value)}
                        value={bio}
                        rows={4}
                        className='p-2 border border-gray-500 focus:outline-none rounded-md focus:ring-2 focus:ring-indigo-500'
                        placeholder='Provide short bio'
                        required
                    />

                    <button type='submit' className='bg-gradient-to-r to-violet-600 text-white p-2 text-lg rounded-full cursor-pointer'>Save</button>
                </form>

                <img
                    src={preview || authUser?.profilePic || assets.logo_icon}
                    alt="profile preview"
                    className='max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10'
                />
            </div>
        </div>
    );
};

export default Profilepage;
