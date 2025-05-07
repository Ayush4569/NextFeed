import { connectToDB } from "@/lib/db";
import UserModel from "@/models/user";
import { User, getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/option";


export async function POST(req: Request) {
    await connectToDB()
    const session = await getServerSession(authOptions);
    console.log('session',session);
    
    const user:User = session?.user as unknown as User
    if (!session || !session.user) {
        return Response.json(
            { success: false, message: 'Not authenticated' },
            { status: 401 }
        );
    }
    const userId = user?._id
    const isAccepting = await req.json();
    try {
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage: isAccepting
        },{new:true})
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: 'Unable to find user to update message acceptance status',
                },
                { status: 404 }
            );
        }
        return Response.json(
            {
                success: true,
                message: 'Message acceptance status updated successfully',
                updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating message acceptance status:', error);
        return Response.json(
            { success: false, message: 'Error updating message acceptance status' },
            { status: 500 }
        );
    }
}
export async function GET(req: Request) {
    await connectToDB();
  
    const session = await getServerSession(authOptions);
    const user = session?.user;
  
    if (!session || !user) {
      return Response.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      );
    }
  
    try {
      const foundUser = await UserModel.findById(user._id);
  
      if (!foundUser) {
        return Response.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }
  
      return Response.json(
        {
          success: true,
          isAcceptingMessages: foundUser.isAcceptingMessage,
        },
        { status: 200 }
      );
    } catch (error) {
      console.error('Error retrieving message acceptance status:', error);
      return Response.json(
        { success: false, message: 'Error retrieving message acceptance status' },
        { status: 500 }
      );
    }
  }