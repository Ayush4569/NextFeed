import { resend } from "@/lib/resend";
import VerificationEmail from "@/components/email-template";
import { ApiResponse } from "@/types/ApiResponse";

export default async function sendVerifcationCode (email:string,username:string,verifyCode:string):Promise<ApiResponse>{
    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Next-feed | Verification code',
            react: VerificationEmail({username,otp:verifyCode})
          });
          return {success:true,message:"verification email sent"}
    } catch (error) {
        console.log('Error sending verification email',error);
        return {success:false,message:"Error sending verification email"}
    }
}