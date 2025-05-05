import { NextFunction, Request, Response } from "express";
import { HeaderUserType } from "../types/user.types";
import checkEnabledUserAction from "../user/checkenabled.user.action";
import { decode } from "jsonwebtoken";

function decodeJwtValues(request: Request) {
    const authHeader = request.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return null;
    }

    const token = authHeader.split(" ")[1]; 
    const jwtValues = decode(token); 

    return jwtValues as HeaderUserType;
}

// Helper function that doesn't directly return the Response object
async function checkUserPermission(request: Request, response: Response, next: NextFunction, permission: string): Promise<boolean> {
    const user = decodeJwtValues(request);
    if (!user) {
        response.status(401).json({
            message: "Not authorized. Failed"
        });
        return false;
    }
    
    if (await checkEnabledUserAction(user._id)) {
        const targetUserId = request.params.userId;
        if (targetUserId && (user._id == targetUserId || user.permissions[permission])) {
            return true;
        } else if (!targetUserId && user.permissions[permission]) {
            return true;
        }
    }
    
    response.status(401).json({ message: "Not authorized." });
    return false;
}

// Updated middleware functions that return void
export async function UserModAuthMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (await checkUserPermission(request, response, next, "UPDATE-USERS")) {
        next();
    }
}

export async function UserDisableAuthMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (await checkUserPermission(request, response, next, "DELETE-USERS")) {
        next();
    }
}

export async function BookCreateAuthMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (await checkUserPermission(request, response, next, "CREATE-BOOKS")) {
        next();
    }
}

export async function BookModAuthMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (request.body.reserved == undefined) {
        if (await checkUserPermission(request, response, next, "UPDATE-BOOKS")) {
            next();
        }
        return;
    }
    
    const user = decodeJwtValues(request);
    if (user) {
        request.body._id = user._id;
        next();
    } else {
        response.status(401).json({ message: "Not authorized." });
    }
}

export async function BookDisableAuthMiddleware(request: Request, response: Response, next: NextFunction): Promise<void> {
    if (await checkUserPermission(request, response, next, "DELETE-BOOKS")) {
        next();
    }
}