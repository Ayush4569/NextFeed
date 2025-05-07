import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";
import { connectToDB } from "@/lib/db";
import UserModel from "@/models/user";
import mongoose from "mongoose";

export async function GET(req: Request) {
    await connectToDB()
    const session = await getServerSession(authOptions);
    const user = session?.user
    if (!session || !user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    const userId = new mongoose.Types.ObjectId(user._id);
    try {
        const foundUser = await UserModel.findOne({ _id: user._id });
        if (!foundUser) {
            return Response.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
        }
        const userMessages = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages",
            },
            {
                $sort: {
                    "messages.createdAt": -1
                }
            },
            {
                $group: {
                    _id: "$_id",
                    messages: { $push: "$messages" }
                }
            }
        ])
        console.log('user-msgs',userMessages);
        
        if(!userMessages || userMessages.length == 0){
            return Response.json(
                { message: 'User not found', success: false },
                { status: 404 }
              );
        }
        return Response.json(
            { success: true, message: userMessages[0].messages },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error getting user messages:', error);
        return Response.json(
            { success: false, message: 'Error getting user messages' },
            { status: 500 }
        );
    }

}