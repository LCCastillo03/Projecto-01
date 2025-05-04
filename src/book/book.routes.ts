import { Router, Request, Response } from "express";
import { createBook, updateBook, disableBook, readBooks, reserveBook, returnBook, readOneBook } from "./book.controller";
import { BookQueryType, CreateBookType, UpdateBookType, ReserveBookType } from "./book.types";

const bookRoutes = Router();

async function CreateBook(request: Request<any, any, CreateBookType>, response: Response) {
    try {
        const book = await createBook(request.body);
        
        response.status(200).json({
            message: "Success.",
            book: book,
        });

    } catch (error) {
        response.status(500).json({
            message: "Failure.",
            information: (error as any).toString()
        })
    }
}

async function SearchBooks(request: Request<any, any, any, BookQueryType>, response: Response) {
    try {
        let results;
        if (request.query._id) {
            results = await readOneBook(request.query._id);
        } else {
            results = await readBooks(request.query);
        }
        
        response.status(230).json({ 
            message: "Query results.",
            results: results,
        });
    } catch (error) {
        response.status(401).json({ 
            message: "Invalid query.",
        });
    }
}

async function UpdateBook(request: Request<{bookId: string}, UpdateBookType | ReserveBookType>, response: Response) {
    // update info is in request.body, target book id is in params
    // to make reservation, body should be: { reserved: true }
    // to wrap up reservation/return book, body should be: { reserved: false }
    
    try {
        let results;
        if (request.body.reserved == undefined) {
            results = await updateBook(request.params.bookId, request.body);
        } else {
            if (Object.keys(request.body).length > 2) {
                // request cannot attempt to both update a reservation and update book info
                throw new Error("Invalid update request.")
            }
            if (request.body.reserved) {
                results = await reserveBook(request.params.bookId, request.body._id);
            } else {
                results = await returnBook(request.params.bookId, request.body._id);
            }
        }

        response.status(200).json({
            message: "Success.",
            results: results,
        });
    } catch (error) {
        response.status(500).json({
            message: "Failure to update book.",
            information: (error as any).toString(),
        })
    }
}

async function DisableBook(request: Request<{bookId: string}>, response: Response) {
    // target book id is in params
    try {
        await disableBook(request.params.bookId);

        response.status(200).json({
            message: "Success.",
        });
    } catch (error) {
        response.status(500).json({
            message: "Failure to delete/disable book.",
            information: (error as any).toString(),
        })
    }
}

bookRoutes.get("/search", SearchBooks);                                     
bookRoutes.post("/create", CreateBook);               
bookRoutes.put("/:bookId/update", UpdateBook);           
bookRoutes.delete("/:bookId/delete", DisableBook);   

export default bookRoutes;
