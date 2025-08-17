import React, { useContext } from 'react'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'
import Sidebar from '../components/Sidebar'
import { ChatContext } from '../context/ChatContext'

const Homepage = () => {
    const { selectedUser, showRightSidebar } = useContext(ChatContext)

    // Determine if right sidebar should be shown
    const shouldShowRightSidebar = selectedUser && showRightSidebar

    // Determine grid columns based on conditions
    const gridColsClass = shouldShowRightSidebar
        ? 'md:grid-cols-[1fr_1.5fr_1fr] xl:grid-cols-[1fr_2fr_1fr]'
        : 'md:grid-cols-[1fr_2fr]' // Changed from md:grid-cols-2 to be more explicit

    return (
        <div className='border w-full h-screen sm:px-[15%] sm:py-[5%]'>
            <div
                className={`backdrop-blur-xl md:not-first-of-type:border-2 border-gray-600 rounded-2xl 
          overflow-hidden h-full grid grid-cols-1 relative ${gridColsClass}`}
            >
                {/* Sidebar always shown */}
                <Sidebar />

                {/* ChatContainer always shown */}
                <ChatContainer />

                {/* RightSidebar conditionally rendered */}
                {shouldShowRightSidebar && (
                    <div className="hidden md:block">
                        <RightSidebar />
                    </div>
                )}
            </div>
        </div>
    )
}

export default Homepage