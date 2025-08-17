import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AuthContext } from "./AuthContext";



export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {

    const [message, setMessage] = useState(["hello"]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [unSeenMessages, setUnSeenMessages] = useState({});
    const [recentUsers, setRecentUsers] = useState([]); 
    const [showRightSidebar, setShowRightSidebar] = useState(false);



    const { socket, axios } = useContext(AuthContext)


    const getAllUser = async () => {

        try {

            const { data } = await axios.get('/api/messages/users');

            if (data.success) {
                setUsers(data.users);
                setUnSeenMessages(data.unSeenMessage);

            }

        } catch (error) {
            toast.error(error.message);

        }
    }

    //get message for selelected user

    const getMessage = async (userId) => {
        try {
            const { data } = await axios.get(`/api/messages/${userId}`,);
    
            if (data.success) {
                const safeMessages = Array.isArray(data.messages) ? data.messages : [];
                setMessage(safeMessages);
            }
        } catch (error) {
            toast.error(error.message);
            setMessage([]); // fallback to empty array on error
        }
    };
    

    //function to send the message to selected user

    const sendMessage = async (messageData) => {
        try {
            const { data } = await axios.post(`/api/messages/send/${selectedUser._id}`, messageData);
        
        
            if (data.success) {
                setMessage((prevMessage) => [...prevMessage, data.newMessage]);

            } else {
                toast.error(data.message);
            }

        } catch (error) {
            toast.error(error.message);
        }
    }


    //function to subscribe the message for selected user

    const subscribeToMessage = async () => {
        try {
            if (!socket) return;

            socket.on("newMessage", (newMessage) => {
                if (selectedUser && newMessage.senderId === selectedUser._id) {
                    newMessage.seen = true;
                    setMessage((prevMessage) => [...prevMessage, newMessage]);

                    axios.put(`/api/message/mark/${newMessage._id}`);
                } else {
                    setUnSeenMessages((prev) => ({
                        ...prev,
                        [newMessage.senderId]: prev[newMessage.senderId]
                            ? prev[newMessage.senderId] + 1
                            : 1,
                    }));
                }
            });

        } catch (error) {
            toast.error(error.message);
        }
    }


    //unsubscribe

    const unsubscribeToMessage = () => {
        if (socket) {
            socket.off("newMessage");

        }
    }

    useEffect(() => {

        subscribeToMessage();
        return () => unsubscribeToMessage();

    }, [socket, selectedUser])

    useEffect(() => {
        if (selectedUser) {
           
            getMessage(selectedUser._id);
        }
    }, [selectedUser]);
    


    const value = {

        message, setMessage,
        users, setUsers,
        selectedUser, setSelectedUser,
        getAllUser, sendMessage,
        unSeenMessages, setUnSeenMessages, getMessage,
        recentUsers, setRecentUsers,
        showRightSidebar, setShowRightSidebar,


    }

    return (
        <ChatContext.Provider value={value}>
            {children}
        </ChatContext.Provider>
    )
}