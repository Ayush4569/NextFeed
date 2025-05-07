import sendVerifcationCode from "@/helpers/emailVerification";
import { connectToDB } from "@/lib/db";
import UserModel from "@/models/user";
import bcrypt from "bcrypt"
export async function POST(req: Request) {
    await connectToDB();
    try {
        const { username, email, password } = await req.json();
        const existingVerifiedUserByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });
        if (existingVerifiedUserByUsername) {
            return Response.json(
                {
                    success: false,
                    message: 'Username is already taken',
                },
                { status: 400 }
            );
        }
        const existingUserByEmail = await UserModel.findOne({ email });
        let verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        if (existingUserByEmail) {
            if (existingUserByEmail.isVerified) {
                return Response.json({
                    success: false,
                    message: 'Already an existing user'
                }, { status: 400 })
            }
            else {
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 360000)
                await existingUserByEmail.save()
            }
        }
        else {
            const hashedPassword = await bcrypt.hash(password, 10);
            const verifyCodeExpiry = new Date(Date.now() + 360000)
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry,
                messages: [],
                isVerified: false,
                isAcceptingMessage: true
            })
            await newUser.save()
        }

        const emailResponse = await sendVerifcationCode(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'User registered successfully. Please verify your account.',
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json({
            success: false,
            message: "Error registering user"
        }, {
            status: 500
        })
    }


}