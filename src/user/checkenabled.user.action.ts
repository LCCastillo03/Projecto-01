import { UserModel } from "../models/user.model";

async function checkEnabledUserAction(userId: string): Promise<boolean> {
    const user = await UserModel.findById(userId);
    if (user && !user.disabled) {
        return true;
    }
    return false;
}

export default checkEnabledUserAction;
