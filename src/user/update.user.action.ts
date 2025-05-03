import { UserModel, UserType } from "./user.model";
import { UpdateUserType } from "./user.types";

async function updateUserAction(targetUserId: string, updateData: UpdateUserType): Promise<UserType> {
    const updatedUser = await UserModel.findByIdAndUpdate(targetUserId, updateData, {
        new: true
    }) as UserType;

    if (!updatedUser) {
        throw new Error("User Id does not match existing user.")
    }
    
    return updatedUser;
}

export default updateUserAction;
