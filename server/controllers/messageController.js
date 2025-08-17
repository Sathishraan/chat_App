import cloudinary from "../lib/cloudinary.js";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { io, userSocketMap } from "../server.js";


export const getusersForSidebar = async (req, res) => {

    try {

        const userId = req.user._id;

        const filteredusers = await User.find({ _id: { $ne: userId } }).select("-password");

        //count Unseen message

        const unSeenMessage = {}

        const promises = filteredusers.map(async (user) => {

            const messages = await Message.find({ senderId: user._id, receiverId: userId, seen: false })

            if (messages.length > 0) {

                unSeenMessage[user._id] = messages.length;

            }
        })
        await Promise.all(promises);

        res.json({ success: true, users: filteredusers, unSeenMessage })




    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }
}


//get all message for selected user


export const getMessage = async (req, res) => {

    try {

        const { id: selectedUserId } = req.params;

        const myId = req.user._id;


        const messages = await Message.find({

            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }

            ]

        })

        await Message.updateMany({ senderId: selectedUserId, receiverId: myId }, { seen: true })

        res.json({
            success: true, messages
        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }
}

//api for mark message as seen

export const markMessageAsSeen = async (req, res) => {

    try {

        const { id } = req.params;

        await Message.findByIdAndUpdate(id, { seen: true })

        res.json({
            success: true,
        })



    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }
}

//send message to selected user

export const sendMessage = async (req, res) => {

    try {

        const { text, image } = req.body;

        const receiverId = req.params.id;
        const senderId = req.user._id;

        console.log("rec id", receiverId)
        console.log("send id", senderId)

        let imageUrl;

        if (image) {

            const uploadResult = await cloudinary.uploader.upload(image);
            imageUrl = uploadResult.secure_url;

        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            text,
            image: imageUrl
        })

        //Emit th new message to the receiver 

        const receiverSocketId = userSocketMap[receiverId];

        if (receiverSocketId) {

            io.to(receiverSocketId).emit("newMessage", newMessage)

        }

        res.json({
            success: true,
            newMessage
        })


    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }

}