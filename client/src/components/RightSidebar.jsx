import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/assets';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';

const RightSidebar = () => {

    const { selectedUser, message } = useContext(ChatContext);
    const { logout, onlineUser } = useContext(AuthContext)
    const [msgImage, setMsgImage] = useState([]);

    console.log("selectedUserCurrent", selectedUser)



    //get all image from messages and set to state

    useEffect(() => {

        setMsgImage(message.filter(msg => msg.image).map(msg => msg.image))
    }, [message])





    return selectedUser && (
        <div className={` bg-[#8185B2]/10 text-white w-full relative overflow-y-scroll
        ${selectedUser ? 'max-md:hidden' : ""}`}>

            <div className='pt-16 flex flex-col items-center gap-3  text-xs font-light mx-auto '>

                <img src={selectedUser?.profilePic || assets.avatar_icon} alt="Avatar" className='w-20 aspect-[1/1] rounded-full' />

                <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
                    {selectedUser.fullName}
                    {onlineUser.includes(selectedUser._id) && (
                        <span className='w-2 h-2 rounded-full bg-green-500 inline-block'></span>
                    )}
                </h1>

                <p className='px-10 mt-10 mx-auto'>{selectedUser.bio}</p>

            </div>

            <hr className='border-[#ffffff50] my-4' />

            <div className='px-5 text-xs'>
                <p className='font-semibold'>Media</p>

                <div className='mt-2 max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80'>
                    {msgImage.map((url, index) => (

                        <div key={index} onClick={() => window.open(url)} className='cursor-pointer rounded'>

                            <img src={url} alt='image' className='h-full rounded-md' />


                        </div>


                    ))}
                </div>

            </div>

            <button onClick={() => logout()} className='group relative mt-30 overflow-hidden bottom-5 left-1/2 transform -translate-x-1/2
            bg-gradient-to-r  to-violet-600 text-white border-none text-xl font-light py-2 px-20 cursor-pointer rounded-full'>
                <span className='absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full group-hover:translate-x-14 transition-transform duration-400 '>🚪</span>
                Logout
            </button>

        </div>
    )
}

export default RightSidebar