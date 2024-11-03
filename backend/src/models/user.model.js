import mongoose, { Schema } from "mongoose";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

const userSchema = new Schema({
   
    email: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    lastLogin: {
        type: Date,
        default:Date.now
    },
    isVerified: {
        type: Boolean,
        default:false
    },
    verificationToken: String,
    verificationExpiry:Date,
    resetPasswordToken:String,
    resetPasswordExpiry:Date,

}, { timestamps: true })

//warning dont use arroy function if using this
userSchema.pre("save", async function(next){
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next()
})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password)
    //compare returns true or false
}

userSchema.methods.generateToken = async function () {
    return jwt.sign({
         _id:this._id//key can be any value . userId:this._id
     },
         process.env.TOKEN_SECRET,
        { expiresIn: `${process.env.TOKEN_EXPIRY}`})
 }

export const User = mongoose.model('User', userSchema);

