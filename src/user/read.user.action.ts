import { UserModel, UserType } from "../models/user.model";

async function readUserAction(query: object): Promise<UserType> {
    const results = await UserModel.findOne(query) as UserType;

    return results;
}

export default readUserAction;
