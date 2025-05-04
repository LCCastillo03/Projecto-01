import { UserModel } from "../models/user.model";

async function disableUserAction(targetUserId: string) {
    await UserModel.findByIdAndUpdate(targetUserId, {disabled: true});
}

export default disableUserAction;
