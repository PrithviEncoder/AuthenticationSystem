import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/apiResponse.js'
import { sendVerificationMail, sendWelcomeMail, sendPasswordResetMail, sendPasswordResetSuccessMail } from "../mail/emails.js"
import crypto from 'crypto'

const checkAuth = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");
        console.log("is user", user)
        if (!user) {
            throw new ApiError(400, "ERROR in finding user");
        }

        return res.status(200).json(new ApiResponse(200, user, "AUTHENTICATION of User is Successfull"))
    } catch (error) {
        throw new ApiError(400, error.message || "Error in User AUTHENTICATION");
    }
})

const register = asyncHandler(async (req, res) => {


    const { name, email, password } = req.body;

    const anyFieldMissing = [name, email, password].some(field => field.trim() === "")
    if (anyFieldMissing) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        email
    })

    if (existedUser) {
        throw new ApiError(401, "This mail is already regsitered please login otherwise or try with new email")
    }

    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();//6digits in string


    const user = await User.create({
        name,
        email,
        password,
        verificationToken: verificationToken,
        verificationExpiry: Date.now() + (15 * 60 * 1000),//15min
    })

    //check user created or not and remove password so we can send this as response
    const createdUser = await User.findById(user._id).select("-password");
    if (!createdUser) {
        throw new ApiError(500, "There is some error while registering the user please try again")
    }

    //generate tokem
    const token = await user.generateToken();

    //send email immediatly after registering and code will be valid till 15 min as we define it .
    await sendVerificationMail(createdUser.email, verificationToken);

    const options = {
        httpOnly: true,
        secure: `${process.env.NODE_ENV}` === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000//7 days
    }



    return res.status(200)
        .cookie("token", token, options)
        .json(new ApiResponse(200, createdUser, "User Registered Successfully"))
}
)

const verifyEmail = asyncHandler(async (req, res) => {
    const { code } = req.body;
    try {

        const user = await User.findOne({
            verificationToken: code,
            verificationExpiry: { $gt: Date.now() }
        })

        if (!user) {
            throw new ApiError(404, "Can't find your verification token either code is wrong or code has expired")
        }

        user.isVerified = true;
        user.verificationToken = undefined;
        user.verificationExpiry = undefined;
        await user.save();

        await sendWelcomeMail(user.email, user.name);

        const userResponse = await User.findById(user._id).select("-password");
        //    const userResponse= user.select("-password");
        //cant do it since user is object
        return res.status(200).json(new ApiResponse(200, userResponse, "Email is Verified Successfully"));

    } catch (error) {
        throw new ApiError(400, error.message || "There is error in verifying email");
    }
})

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    try {
        if (!(email && password)) {
            throw new ApiError(409, "All credentials required");
        }

        const registeredUser = await User.findOne({ email });
        if (!registeredUser) {
            throw new ApiError(400, "User is not registered please register first");
        }

        const isPasswordCorrect = await registeredUser.isPasswordCorrect(password);

        if (!isPasswordCorrect) {
            throw new ApiError(400, "Password is not correct");
        }

        const token = await registeredUser.generateToken();

        registeredUser.lastLogin = new Date();
        await registeredUser.save();

        const user = await User.findById(registeredUser._id).select("-password")
        if (!user) {
            throw new ApiError(500, "There is some error in finding user")
        }

        const options = {
            httpOnly: true,
            secure: `${process.env.NODE_ENV}` === "production",
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000//7 days
        }

        return res
            .status(200)
            .cookie("token", token, options)
            .json(new ApiResponse(200, user, "User is logged In Successfully"))


    } catch (error) {
        throw new ApiError(400, error.message || "There is some error in login")
    }
})

const logout = asyncHandler(async (req, res) => {

    try {

        const options = {
            httpOnly: true,
            secure: `${process.env.NODE_ENV}` === "production",
            sameSite: 'strict'
        }

        //options are not neccesary while removing cookie
        return res
            .status(200)
            .clearCookie("token", options)
            .json(new ApiResponse(200, {}, "User logout Successfully"));

    } catch (error) {
        throw new ApiError(400, error.message || "Error in logout user")
    }
})

const forgotPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    try {
        if (!email) {
            return res.status(400).json({ message: "Email not provided", success: false })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Any user with this email is not registered" });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const resetTokenExpiry = Date.now() + 1 * 60 * 60 * 1000;//1 hour

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiry = resetTokenExpiry;
        await user.save();

        if (!(process.env.CLIENT_URL)) {
            throw ApiError(500, "ERROR in loading client url via dotenv file")
        }
        await sendPasswordResetMail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);


        return res.status(200).json(new ApiResponse(200, user, "Forgot password is Successful"));

    } catch (error) {
        throw new ApiError(400, error.message || "There is some error in forgot password")
    }
})

const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { password, confirmPassword } = req.body;

    try {
        if (password === "" || confirmPassword === "") {
            throw new ApiError(400, "Empty field are not allowd !");
        }
        if (password !== confirmPassword) {
            throw new ApiError(400, "Password and confirm Password are different");
        }
        if (!token) {
            throw new ApiError(500, "Error in getting params token")
        }

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiry: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found for reset password" });
        }

        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiry = undefined;
        await user.save();

        await sendPasswordResetSuccessMail(user.email);


        return res.status(200).json(new ApiResponse(200, user, "Reset Password is send Successfully"))

    } catch (error) {
        throw new ApiError(400, error.message || "Error in reset password")
    }

})

export { checkAuth, register, verifyEmail, login, logout, forgotPassword, resetPassword }