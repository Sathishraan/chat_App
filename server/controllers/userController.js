import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from 'bcrypt'



export const signup = async (req, res) => {

    const { fullName, email, password, bio } = req.body;

    try {

        if (!fullName || !email || !password || !bio) {

            return res.json({
                success: false,
                message: "Missing details"
            })

        }

        const user = await User.findOne({ email })

        if (user) {
            return res.json({
                success: false,
                message: "user already exists"
            })

        }

        const salt = await bcrypt.genSalt(10)

        const hashPassword = await bcrypt.hash(password, salt)

        const userData = await User.create({ fullName, email, password: hashPassword, bio })

        const token = generateToken(userData._id)

        res.json({
            success: true,
            userData,
            token,
            message: "signup Successfully"

        })

    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })



    }

};

export const login = async (req, res) => {

    try {

        const { email, password } = req.body

        const userData = await User.findOne({ email });

        if (!userData) {
            return res.json({
                success: false,
                message: "user is not exits please signup"
            })

        }

        const isPassword = await bcrypt.compare(password, userData.password);

        if (!isPassword) {

            return res.json({
                success: false,
                message: "Invalid Password"
            })

        }


        const token = generateToken(userData._id)

        res.json({
            success: true,
            userData,
            token,
            message: "login Successfully"

        })


    } catch (error) {

        console.log(error.message);

        res.json({
            success: false,
            message: error.message
        })

    }
}

//controller to check if user is authenticated

export const checkAuth = async (req, res) => {

    res.json({ success: true, user: req.user });
}


//Upload profile


export const uploadProfilePic = async (req, res) => {
    try {
        const { profilePic, fullName, bio } = req.body;
        const userId = req.user._id;
        console.log("user id",userId)

        let updatedUser;

        // If a new profilePic is sent, upload it
        if (profilePic) {
            const upload = await cloudinary.uploader.upload(profilePic);
            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    profilePic: upload.secure_url,
                    fullName,
                    bio
                },
                { new: true }
            );
        } else {
            // Only update name and bio
            updatedUser = await User.findByIdAndUpdate(
                userId,
                {
                    fullName,
                    bio
                },
                { new: true }
            );
        }

        res.json({
            success: true,
            updatedUser
        });

    } catch (error) {
        console.error("Upload error:", error.message);
        res.json({
            success: false,
            message: error.message
        });
    }
};
