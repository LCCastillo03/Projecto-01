import { Router, Request, Response } from "express";
import { createUser, loginUser, updateUser, disableUser } from "./user.controller";
import { CreateUserType, UpdateUserType, LoginUserType } from "./user.types";
import { UserModAuthMiddleware, UserDisableAuthMiddleware } from "../middleware/auth";

const userRoutes = Router();

async function CreateUser(request: Request<CreateUserType>, response: Response) {
    try {
        const user = await createUser(request.body);
        
        response.status(200).json({
            message: "Success.",
            user: user,
        });

    } catch (error) {
        response.status(500).json({
            message: "Failure.",
            information: (error as any).toString()
        })
    }
}

async function LoginUser(request: Request<LoginUserType>, response: Response) {
    // login info is in request.body
    console.log("Login attempt:", request.body);

    const { email, password } = request.body;
    
    try {
        const results = await loginUser(email, password);
        response.status(230).json({ 
            message: "Login successful.",
            ...results,
        });
    } catch (error) {
        response.status(401).json({ 
            message: "User or password incorrect.",
        });
    }
}

async function UpdateUser(request: Request<{userId: string}, UpdateUserType>, response: Response) {
    // update info is in request.body, target user id is in params
    try {
        const updatedUser = await updateUser(request.params.userId, request.body);

        response.status(200).json({
            message: "Success.",
            updatedUser: updatedUser,
        });
    } catch (error) {
        response.status(500).json({
            message: "Failure to update user.",
            information: (error as any).toString(),
        })
    }
}

async function DisableUser(request: Request<{userId: string}>, response: Response) {
    // target user id is in params
    try {
        await disableUser(request.params.userId);

        response.status(200).json({
            message: "Success.",
        });
    } catch (error) {
        response.status(500).json({
            message: "Failure to delete/disable user.",
            information: (error as any).toString(),
        })
    }
}

userRoutes.get("/login", LoginUser);                                            // READ
userRoutes.post("/create", CreateUser);                                         // CREATE
userRoutes.put("/:userId/update", UserModAuthMiddleware, UpdateUser);           // UPDATE
userRoutes.delete("/:userId/delete", UserDisableAuthMiddleware, DisableUser);   // DELETE

export default userRoutes;
