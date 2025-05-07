import UserModel from "@/models/user"
import { usernameSchema } from "@/schemas/signupSchema"
import { connectToDB } from "@/lib/db"
export async function GET(req: Request) {
    await connectToDB()
    try {
      const {searchParams} = new URL(req.url);
      const result = usernameSchema.safeParse(searchParams.get('username'));
      if (!result.success) {
        const usernameErrors = result.error.format()._errors|| [];
        return Response.json(
          {
            success: false,
            message:
              usernameErrors?.length > 0
                ? usernameErrors.join(', ')
                : 'Invalid query parameters',
          },
          { status: 400 }
        );
      }
      const isExistingUsername = await UserModel.findOne({
        username:result.data,
        isVerified:true
      })
      if(isExistingUsername){
        return Response.json(
            {
              success: false,
              message:"Username already taken"
            },
            { status: 400 }
          );
      }
      return Response.json(
        {
          success: true,
          message:'username is available'
        },
        { status: 200 }
      );
    } catch (error) {
        console.log('Error checking username uniqueness', error);
        return Response.json({
            success: false,
            message: "Error checking username uniqueness"
        }, {
            status: 500
        })
    }
}