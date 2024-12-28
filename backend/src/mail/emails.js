import { ApiError } from "../utils/apiError.js";
import { sgMail, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE,WELCOME_EMAIL_TEMPLATE } from "./mailtrap_template.js"

export const sendVerificationMail = async (email, verificationToken) => {
  
    try {
        const response = await sgMail.send({
            from: sender,
            to: email,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
        
        })

    // Proper logging for SendGrid response
    console.log(`Verification code email successfully sent to ${email}: ${response[0].statusCode}`);
        
    } catch (error) {
        console.error(`Error sending Verification : ${error}`);
        throw new ApiError(400, error.message || "Error in sending email for verification")
    }
}

export const sendWelcomeMail = async (email, name) => {

    try {
        const response = await sgMail.send({
            from: sender,
            to: email,
            subject:"Welcome Mail",
            html: WELCOME_EMAIL_TEMPLATE.replace("{{name}}",name)
        })

        console.log(`Welcome email sent Successfully Sent to ${email}: ${response[0].statusCode}`);


    } catch (error) {
        console.error(`welcome mail error: ${error}`)
        throw new ApiError(400, error.message || "Error in sending Welcome Email");
    }


}

export const sendPasswordResetMail = async (email, resetURL) => {
    
    try {
        const response = await sgMail.send({
            from: sender,
            to: email,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset mail"
        })
        console.log(`Password Reset Mail Successfully Sent to ${email}: ${response[0].statusCode}`);

    } catch (error) {
        console.error("There is some error is sending password reset mail : ", error);
        throw new ApiError(400, error.message || "Error in sending password reset email");
    }


}

export const sendPasswordResetSuccessMail = async (email) => {
    
    try {
        const response = await sgMail.send({
            from: sender,
            to: email,
            subject: "Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password Mail"
        })
        console.log(`Password Reset Success email sent to ${email}: ${response[0].statusCode}`);

    } catch (error) {
        console.error("There is some error is sending Successfull password reset Mail: ", error);
        throw new ApiError(400, error.message || "Error in sending password reset success email");
    }
}