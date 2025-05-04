import { UserModel, UserType } from "../models/user.model";
import { CreateUserType } from "../types/user.types";
import * as argon2 from "argon2";

async function createUserAction(userData: CreateUserType): Promise<UserType> {
  userData.password = await argon2.hash(userData.password);
  const results = await UserModel.create(userData);

  return results;
}

export default createUserAction;
