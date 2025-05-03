import { NextFunction, Request, Response } from "express";
import { HeaderUserType } from "../user/user.types";
import checkEnabledUserAction from "../user/checkenabled.user.action";
import { decode } from "jsonwebtoken";

function decodeJwtValues(request: Request) {
    if (request.headers.authorization === undefined) {
        return null;
    }

    const jwtValues = decode(request.headers.authorization);
    return jwtValues as HeaderUserType;
}

async function isSameUserOrHasPermission(request: Request, response: Response, next: NextFunction, permission: string) {
    const user = decodeJwtValues(request);
    if (!user) {
        return response.status(401).json({
            message: "Not authorized."
        })
    }
    const targetUserId = request.params.userId;
    
    if (await checkEnabledUserAction(user._id)) {
        if (user._id == targetUserId || user.permissions[permission]) {
            return next(); 
        }
    }
    
    return response.status(401).json({ message: "Not authorized." });
}

async function hasPermission(request: Request, response: Response, next: NextFunction, permission: string) {
    const user = decodeJwtValues(request);
    if (!user) {
        return response.status(401).json({
            message: "Not authorized."
        })
    }

    if (await checkEnabledUserAction(user._id)) {
        if (user.permissions[permission]) {
            return next(); 
        }
    }
    
    return response.status(401).json({ message: "Not authorized." });
}

export async function UserModAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    return await isSameUserOrHasPermission(request, response, next, "UPDATE-USERS");
}

export async function UserDisableAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    return await isSameUserOrHasPermission(request, response, next, "DELETE-USERS");
}

export async function BookCreateAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    return await hasPermission(request, response, next, "CREATE-BOOKS");
}

export async function BookModAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    if (request.body.reserved == undefined) {
        return await hasPermission(request, response, next, "UPDATE-BOOKS");
    }
    const user = decodeJwtValues(request);
    if (user) {
        request.body._id = user._id;
        return next();
    }
    
    return response.status(401).json({ message: "Not authorized." });
}

export async function BookDisableAuthMiddleware(request: Request, response: Response, next: NextFunction) {
    return await hasPermission(request, response, next, "DELETE-BOOKS");
}