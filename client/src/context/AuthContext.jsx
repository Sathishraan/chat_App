import axios from "axios";
import { createContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { io } from "socket.io-client";

const backendUrl = import.meta.env.VITE_BACKEND_URL;



axios.defaults.baseURL = backendUrl;



export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(localStorage.getItem("token"));
    const [onlineUser, setOnlineUser] = useState([]);
    const [authUser, setAuthUser] = useState(null);
    const [socket, setSocket] = useState(null);


    const checkAuth = async () => {
        try {
            const { data } = await axios.get("/api/auth/check");


            if (data.success) {

                setAuthUser(data.user);
                connectSocket(data.userData);

            }
        } catch (error) {
            console.error("Check auth error", error);
            setAuthUser(null);
            setToken(null);
            localStorage.removeItem("token");
        }
    };



    //login auth 

    const login = async (state, credentials) => {

        try {
   


            const { data } = await axios.post(`/api/auth/${state}`, credentials)


            if (data.success) {
                setToken(data.token); // ✅ Save for later use
            
                axios.defaults.headers.common["Authorization"] = `Bearer ${data.token}`; // ✅ Use this directly
            
                setAuthUser(data.userData);

                if (data.userData) {
                    connectSocket(data.userData); 
                    console.log("connect socket")// ✅ only run if userData exists
                } else {
                    console.warn("Missing userData in response");
                }

                localStorage.setItem("token", data.token);
                toast.success(data.message);
            }
            
        } catch (error) {

            toast.error(error.message)

        }
    }

    //logout auth

    const logout = () => {

        localStorage.removeItem("token");
        setToken(null);
        setAuthUser(null);
        setOnlineUser([]);
        axios.defaults.headers.common["Authorization"] = null
        toast.success("Logout Successfully");
        socket.disconnect();

    }

    //update profile

    const updateProfile = async (body) => {

        try {
            const { data } = await axios.put('/api/auth/update-profile', body)

            if (data.success) {

                setAuthUser(data.updatedUser);

                localStorage.setItem('chat-user', JSON.stringify(data.updatedUser));
                toast.success("update Profile successfully")

            }

        } catch (error) {
            toast.error(error.message)

        }
    }

    //connect socket function to handle the socket user

    const connectSocket = (userData) => {

      

        if (!userData || socket) {
        
            return;
        }

        const newSocket = io(backendUrl, {
            query: {
                userId: userData._id,
            }
        })

        newSocket.on("getOnlineUser", (userIds) => {

            setOnlineUser(userIds);


        })

        setSocket(newSocket);

    }

    useEffect(() => {
        if (authUser && !socket) {
            connectSocket(authUser);
        }
    }, [authUser]);
    



    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            checkAuth();  // Only call after token is set
        }
    }, [token]);

    const value = {
        axios,
        token,
        onlineUser,
        authUser, setAuthUser,
        checkAuth,
        socket,
        login,
        logout,
        updateProfile,

    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )


}