
import React, { useContext, useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets'
import { AuthContext } from '../context/AuthContext'
import { ChatContext } from '../context/ChatContext'

const Sidebar = () => {
    const {
        getAllUser,
        users,
        unSeenMessages,
        setUnSeenMessages,
        recentUsers,
        setRecentUsers,
        selectedUser,
        setSelectedUser,
    } = useContext(ChatContext)

    const { logout, onlineUser } = useContext(AuthContext)
    const [input, setInput] = useState("")
    const [showMenu, setShowMenu] = useState(false);


    const navigate = useNavigate()

    useEffect(() => {
        getAllUser()
    }, [onlineUser])

    const updateRecentUsers = (userId) => {
        setRecentUsers((prev) => {
            const filtered = prev.filter((id) => id !== userId)
            return [userId, ...filtered]
        })
    }

    const handleSelectUser = (user) => {
        setSelectedUser(user)
        updateRecentUsers(user._id)
        setUnSeenMessages((prev) => ({ ...prev, [user._id]: 0 }))
    }

    const filteredAndSortedUsers = useMemo(() => {
        const filtered = input
            ? users.filter((user) =>
                user.fullName.toLowerCase().includes(input.toLowerCase())
            )
            : users

        return [...filtered].sort((a, b) => {
            const indexA = recentUsers.indexOf(a._id)
            const indexB = recentUsers.indexOf(b._id)

            return (indexA === -1 ? Infinity : indexA) - (indexB === -1 ? Infinity : indexB)
        })
    }, [users, input, recentUsers])

    return (
        <div
            className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${selectedUser ? "max-md:hidden" : ""
                }`}
        >
            <div className="pb-5">
                <div className="flex justify-between items-center">
                    <img src={assets.logo} alt="logo" className="max-w-40" />
                    <div className="relative py-2">
                        <img
                            src={assets.menu_icon}
                            alt="menu"
                            className="max-h-5 cursor-pointer"
                            onClick={() => setShowMenu(!showMenu)}
                        />
                        {showMenu && (
                            <div className="absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-600 text-gray-100">
                                <p
                                    onClick={() => {
                                        setShowMenu(false);
                                        navigate('/profile');
                                    }}
                                    className="cursor-pointer text-sm"
                                >
                                    Edit Profile
                                </p>
                                <hr className="my-2 border-t border-gray-500" />
                                <p
                                    onClick={() => {
                                        setShowMenu(false);
                                        logout();
                                    }}
                                    className="cursor-pointer text-sm"
                                >
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>

                </div>

                <div className="bg-[#282142] rounded-full flex items-center gap-3 py-3 px-4 mt-5">
                    <img src={assets.search_icon} alt="search" className="w-3" />
                    <input
                        onChange={(e) => setInput(e.target.value)}
                        type="text"
                        className="bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1"
                        placeholder="Search user.....@"
                    />
                </div>
            </div>

            <div className="flex flex-col">
                {filteredAndSortedUsers.map((user, index) => (
                    <div
                        key={index}
                        onClick={() => handleSelectUser(user)}
                        className={`relative flex items-center gap-2 p-2 pl-4 rounded cursor-pointer max-sm:text-sm ${selectedUser?._id === user._id ? "bg-[#282142]/70" : ""
                            }`}
                    >
                        <img
                            src={user?.profilePic || assets.avatar_icon}
                            alt="profilePic"
                            className="w-[35px] aspect-[1/1] rounded-full"
                        />
                        <div className="flex flex-col leading-6">
                            <p>{user.fullName}</p>
                            <span className={`text-xs ${onlineUser.includes(user._id) ? 'text-green-400' : 'text-neutral-400'}`}>
                                {onlineUser.includes(user._id) ? 'online' : 'offline'}
                            </span>
                        </div>

                        {unSeenMessages[user._id] > 0 && (
                            <p className="absolute top-4 right-4 h-5 w-5 text-xs flex justify-center items-center rounded-full bg-violet-500/50">
                                {unSeenMessages[user._id]}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Sidebar
