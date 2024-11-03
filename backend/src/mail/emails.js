import { ApiError } from "../utils/apiError.js";
import { client, sender } from "./mailtrap.config.js";
import { VERIFICATION_EMAIL_TEMPLATE, PASSWORD_RESET_REQUEST_TEMPLATE, PASSWORD_RESET_SUCCESS_TEMPLATE } from "./mailtrap_template.js"

export const sendVerificationMail = async (email, verificatonToken) => {
    const recipients = [
        {
            email
        }
    ];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Verify Your Email",
            html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificatonToken),
            category: "Email Verification"
        })

        console.log(`Verification code Email Successfully Sent : ${response}`)
    } catch (error) {
        console.error(`Error sending Verification : ${error}`);
        throw new ApiError(400, error.message || "Error in sending email for verification")
    }


}

export const sendWelcomeMail = async (email, name) => {

    const recipients = [
        {
            email
        }
    ];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            template_uuid: "4f39b474-791d-4f5f-8abd-e57fae7d361c",
            template_variables: {
                "company_info_name": "Prithvi Auth",
                "name": name,
                "company_info_address": "rishi nagar,indore",
                "company_info_city": "indore",
                "company_info_zip_code": "457009",
                "company_info_country": "india"
            }
        })

        console.log(`Welcome email sent Successfully:${response}`);


    } catch (error) {
        console.error(`welcome mail error: ${error}`)

    }


}

export const sendPasswordResetMail = async (email, resetURL) => {
    const recipients = [{ email }];

    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Reset Your Password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
            category: "Password reset mail"
        })
        console.log(`Password Reset Mail Successfully: ${response}`);

    } catch (error) {
        console.error("There is some error is sending password reset mail : ", error);
    }


}

export const sendPasswordResetSuccessMail = async (email) => {
    const recipients = [{ email }];
    try {
        const response = await client.send({
            from: sender,
            to: recipients,
            subject: "Password Reset Successfull",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE,
            category: "Reset Password Mail"
        })
        console.log(`Reset Password Successfull: ${response}`);

    } catch (error) {
        console.error("There is some error is sending Successfull password reset Mail: ", error);
    }
}