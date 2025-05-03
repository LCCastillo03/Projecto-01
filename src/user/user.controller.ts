import createUserAction from "./create.user.action";
import readUserAction from "./read.user.action";
import updateUserAction from "./update.user.action";
import disableUserAction from "./disable.user.action";
import jwt from 'jsonwebtoken';
import * as argon2 from "argon2";
import { UserType } from "./user.model";
import { CreateUserType, UpdateUserType } from "./user.types";
import { ReservationType } from "../reservation/reservation.model";
import readReservationsAction from "../reservation/read.reservations.action";

/**
 * Creates a new user in the system
 * @param userData User data for creation
 * @returns The created user
 */
async function createUser(userData: CreateUserType): Promise<UserType> {
    try {
        // Password hashing is handled inside createUserAction
        const createdUser = await createUserAction(userData);
        return createdUser;
    } catch (error: any) {
        throw new Error(`Error creating user: ${error.message}`);
    }
}

/**
 * Authenticates a user and returns JWT token, user data and reservations
 * @param email User's email
 * @param password User's password
 * @returns Object with JWT token, user data and reservation history
 */
async function loginUser(email: string, password: string): Promise<{token: string, user: UserType, reservationHistory: ReservationType[]}> {
    try {
        const user = await readUserAction({email: email});

        if (!user) {
            throw new Error('Invalid credentials');
        }

        const passwordValid = await argon2.verify(user.password, password);
        if (!passwordValid) {
            throw new Error('Invalid credentials');
        }

        const token = jwt.sign(
            { _id: user._id, permissions: user.permissions },
            process.env.JWT_SECRET as string,
            { expiresIn: '1h' }
        );
        
        const reservationHistory = await readReservationsAction({userId: user._id});

        return {
            token: token,
            user: user,
            reservationHistory: reservationHistory,
        };
    } catch (error: any) {
        throw new Error(`Login error: ${error.message}`);
    }
}

/**
 * Updates an existing user's data
 * @param targetUserId ID of the user to update
 * @param updateData Data to update
 * @returns Updated user
 */
async function updateUser(targetUserId: string, updateData: UpdateUserType): Promise<UserType> {
    try {
        if (updateData.password) {
            updateData.password = await argon2.hash(updateData.password);
        }
        
        const updatedUser = await updateUserAction(targetUserId, updateData);
        if (!updatedUser) {
            throw new Error('User not found');
        }
        
        return updatedUser;
    } catch (error: any) {
        throw new Error(`Error updating user: ${error.message}`);
    }
}

/**
 * Disables a user in the system
 * @param targetUserId ID of the user to disable
 * @returns void
 */
async function disableUser(targetUserId: string): Promise<void> {
    try {
        await disableUserAction(targetUserId);
    } catch (error: any) {
        throw new Error(`Error disabling user: ${error.message}`);
    }
}

export { createUser, loginUser, updateUser, disableUser };