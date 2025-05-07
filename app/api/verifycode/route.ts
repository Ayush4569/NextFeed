import { connectToDB } from "@/lib/db";
import UserModel from "@/models/user";
export async function POST(req:Request){
  await connectToDB()
  try {
    const {username,code} = await req.json();
    const user = await UserModel.findOne({username});
    if(!user){
        return Response.json({
            success: false,
            message: "No such user"
        }, {
            status: 400
        })
    }
    if(user.isVerified){
        return Response.json({
            success: false,
            message: "user already verified"
        }, {
            status: 400
        })
    }
    const isCodeCorrect = user.verifyCode === code;
    const isCodeValid = new Date(user.verifyCodeExpiry) > new Date();
    if(isCodeCorrect && isCodeValid){
        user.isVerified = true;
        await user.save()
        return Response.json({
            success: true,
            message: "User verified successfully"
        }, {
            status: 200
        }) 
    } else if(!isCodeCorrect){
        return Response.json({
            success: false,
            message: "Incorrect verification code"
        }, {
            status: 400
        })
    }
    else{
        return Response.json({
            success: false,
            message: "verification code expired, kindly signup again to get new code"
        }, {
            status: 400
        })
    }
  } catch (error) {
    console.log('Error verifying code', error);
    return Response.json({
        success: false,
        message: "Error verifying code"
    }, {
        status: 500
    })
  }
}