
import React, { useContext, useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = () => {
    const {
        message,
        selectedUser,
        setSelectedUser,
        sendMessage,
        getMessage, recentUsers,setShowRightSidebar, setRecentUsers,
    } = useContext(ChatContext);

    const { authUser, onlineUser } = useContext(AuthContext);

    const [input, setInput] = useState('');
    const scrollEnd = useRef();

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (input.trim() === "") return;
        await sendMessage({ text: input.trim() });
        setInput("");
    };

    const handleSendImage = async (e) => {
        const file = e.target.files[0];
        if (!file || !file.type.startsWith("image/")) {
            toast.error("Select a valid image file");
            return;
        }

        const reader = new FileReader();
        reader.onloadend = async () => {
            await sendMessage({ image: reader.result });
            e.target.value = "";
        };
        reader.readAsDataURL(file);
    };

    useEffect(() => {
        if (selectedUser) {
            getMessage(selectedUser._id);
        }
    }, [selectedUser]);

    useEffect(() => {
        if (scrollEnd.current) {
            scrollEnd.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [message]);

    return selectedUser ? (
        <div className='h-full overflow-scroll relative backdrop-blur-lg'>

            {/* Header */}
            <div className='flex items-center gap-3 py-3 mx-4 border-b border-stone-500'>
                <img onClick={() => setSelectedUser(null)} src={assets.arrow_icon} alt="arrow" className='max-w-5 md:hidden cursor-pointer' />
                <img src={selectedUser.profilePic || assets.avatar_icon} alt="profile" className='w-10 h-10 rounded-full' />
                <p className='flex-1 text-lg text-white flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUser.includes(selectedUser._id) && <span className='w-2 h-2 rounded-full bg-green-500'></span>}
                </p>


                <img onClick={() => setShowRightSidebar(true)} src={assets.help_icon}
                    alt="arrow" className='max-w-5 md:hidden cursor-pointer' />

            </div>

            {/* Chat Messages */}
            <div className='flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6'>
                {message.map((msg, index) => {
                    const isOwnMessage = msg.senderId?.toString() === authUser?._id?.toString();



                    return (
                        <div
                            key={index}
                            className={`flex items-end gap-2 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}

                        >
                            {msg.image ? (

                                <div onClick={() => window.open(msg.image)}> <img

                                    src={msg.image}
                                    alt='message'
                                    className='max-w-[230px] cursor-pointer border border-gray-700 rounded-lg overflow-hidden mb-8'
                                /></div>

                            ) : (
                                <p className={`p-2 max-w-[200px] md:text-sm font-light rounded-lg mb-8 break-all bg-violet-500/30 text-white ${isOwnMessage ? 'rounded-br-none' : 'rounded-bl-none'}`}>
                                    {msg.text}
                                </p>
                            )}

                            <div className='text-center text-xs'>
                                <img
                                    src={isOwnMessage
                                        ? authUser?.profilePic || assets.avatar_icon
                                        : selectedUser?.profilePic || assets.avatar_icon}
                                    className='w-10 h-10 rounded-full'
                                    alt="avatar"
                                />
                                <p className='text-white'>{formatMessageTime(msg.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}

                <div ref={scrollEnd}></div>
            </div>

            {/* Bottom Input Area */}
            <div className='absolute bottom-0 right-0 left-0 flex items-center gap-3 p-3'>
                <div className='flex-1 flex items-center bg-gray-100/12 px-3 rounded-full'>
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        value={input}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(e)}
                        onClick={() => {
                            setRecentUsers((prev) => {
                                const updated = prev.filter((id) => id !== selectedUser._id);
                                return [selectedUser._id, ...updated]; // move to front
                            });
                        }}
                        type="text"
                        placeholder='message'
                        className='flex-1 text-sm p-3 border-none rounded-lg text-white placeholder-gray-400 outline-none bg-transparent'
                    />
                    <input
                        onChange={handleSendImage}
                        type="file"
                        id="image"
                        accept='image/png, image/jpeg'
                        hidden
                    />
                    <label htmlFor='image'>
                        <img src={assets.gallery_icon} alt="gallery icon" className='w-5 mr-2 cursor-pointer' />
                    </label>
                </div>

                <img
                    onClick={handleSendMessage}
                    src={assets.send_button}
                    alt="send icon"
                    className='w-7 cursor-pointer'
                />
            </div>

        </div>
    ) : (
        <div className='flex flex-col items-center justify-center gap-2 text-gray-500 bg-white/10 max-md:hidden'>
            <img src={assets.logo_icon} alt="logo" className='max-w-16' />
            <p className='text-lg font-medium text-white'> Chat Anytime, AnyWhere !!!</p>
        </div>
    );
};

export default ChatContainer;
