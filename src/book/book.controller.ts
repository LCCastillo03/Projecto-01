import CreateBookAction from "./create.book.action";
import ReadOneBookAction from "./read.one.books.action";
import ReadBooksAction from "./read.books.action";
import UpdateBookAction from "./update.book.action";
import DisableBookAction from "./disable.book.action";
import { BookType } from "../models/book.model";
import { CreateBookType, UpdateBookType, BookQueryType } from "./book.types";
import SetReturnDateAction from "../reservation/set.return.date.action";
import { ReservationType } from "../reservation/reservation.model";
import CreateReservationAction from "../reservation/create.reservation.action";
import ReadReservationsAction from "../reservation/read.reservations.action";

/**
 * Retrieves books based on provided search criteria
 * @param query Search criteria
 * @returns List of books or a specific book
 */
async function readBooks(query: BookQueryType): Promise<BookType[] | BookType> {
    try {
        // Ensure only non-disabled books are returned
        const finalQuery = {
            ...query,
            disabled: false
        };

        // Convert publication date to ISO format if it exists
        if (finalQuery.pubDate) {
            finalQuery.pubDate = new Date(finalQuery.pubDate).toISOString();
        }

        return await ReadBooksAction(finalQuery);
    } catch (error) {
        console.error('Error reading books:', error);
        throw new Error(`Error retrieving books: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Retrieves a specific book along with its reservation history
 * @param bookId ID of the book to query
 * @returns Object with the book and its reservation history
 */
async function readOneBook(bookId: string): Promise<{book: BookType | null, reservationHistory: ReservationType[]}> {
    try {
        if (!bookId) {
            throw new Error('Book ID is required');
        }

        const book = await ReadOneBookAction(bookId);
        
        // If the book is disabled, return null
        if (book?.disabled) {
            return {
                book: null,
                reservationHistory: [],
            };
        }

        const reservationHistory = await ReadReservationsAction({ bookId });

        return {
            book,
            reservationHistory,
        };
    } catch (error) {
        console.error(`Error reading book ${bookId}:`, error);
        throw new Error(`Error retrieving book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Creates a new book
 * @param bookData Data of the book to create
 * @returns The created book
 */
async function createBook(bookData: CreateBookType): Promise<BookType> {
    try {
        if (!bookData) {
            throw new Error('Book data is required');
        }
        
        return await CreateBookAction(bookData);
    } catch (error) {
        console.error('Error creating book:', error);
        throw new Error(`Error creating book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Updates an existing book
 * @param targetBookId ID of the book to update
 * @param updateData Data to update
 * @returns The updated book
 */
async function updateBook(targetBookId: string, updateData: UpdateBookType): Promise<BookType> {
    try {
        if (!targetBookId) {
            throw new Error('Book ID is required');
        }
        
        // Verify the book exists before updating it
        const existingBook = await ReadOneBookAction(targetBookId);
        if (!existingBook) {
            throw new Error(`Book with ID ${targetBookId} does not exist`);
        }
        
        return await UpdateBookAction(targetBookId, updateData);
    } catch (error) {
        console.error(`Error updating book ${targetBookId}:`, error);
        throw new Error(`Error updating book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Reserves a book for a user
 * @param targetBookId ID of the book to reserve
 * @param userId ID of the user making the reservation
 * @returns Object with the updated book and the new reservation
 */
async function reserveBook(targetBookId: string, userId: string): Promise<{updatedBook: BookType, newReservation: ReservationType}> {
    try {
        if (!targetBookId || !userId) {
            throw new Error('Book ID and User ID are required');
        }
        
        const book = await ReadOneBookAction(targetBookId);
        
        if (!book) {
            throw new Error(`Book with ID ${targetBookId} does not exist`);
        }
        
        if (book.disabled) {
            throw new Error('Cannot reserve a disabled book');
        }
        
        if (book.reserved) {
            throw new Error('Book is already reserved');
        }
        
        const [updatedBook, newReservation] = await Promise.all([
            UpdateBookAction(targetBookId, { reserved: true }),
            CreateReservationAction({
                bookId: targetBookId,
                userId: userId,
            })
        ]);

        return {
            updatedBook,
            newReservation,
        };
    } catch (error) {
        console.error(`Error reserving book ${targetBookId}:`, error);
        throw new Error(`Error reserving book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Records the return of a book
 * @param targetBookId ID of the book to return
 * @param userId ID of the user returning the book
 * @returns Object with the updated book and the updated reservation
 */
async function returnBook(targetBookId: string, userId: string): Promise<{updatedBook: BookType, updatedReservation: ReservationType}> {
    try {
        if (!targetBookId || !userId) {
            throw new Error('Book ID and User ID are required');
        }
        
        const book = await ReadOneBookAction(targetBookId);
        
        if (!book) {
            throw new Error(`Book with ID ${targetBookId} does not exist`);
        }
        
        if (!book.reserved) {
            throw new Error('Book is not reserved, so it cannot be returned');
        }
        
        // Update reservation and book status in parallel
        const [updatedReservation, updatedBook] = await Promise.all([
            SetReturnDateAction(targetBookId, userId, new Date()),
            UpdateBookAction(targetBookId, { reserved: false })
        ]);

        return {
            updatedBook,
            updatedReservation,
        };
    } catch (error) {
        console.error(`Error returning book ${targetBookId}:`, error);
        throw new Error(`Error returning book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Disables a book
 * @param targetBookId ID of the book to disable
 * @returns Void
 */
async function disableBook(targetBookId: string): Promise<void> {
    try {
        if (!targetBookId) {
            throw new Error('Book ID is required');
        }
        
        // Verify the book exists before disabling it
        const existingBook = await ReadOneBookAction(targetBookId);
        if (!existingBook) {
            throw new Error(`Book with ID ${targetBookId} does not exist`);
        }
        
        await DisableBookAction(targetBookId);
    } catch (error) {
        console.error(`Error disabling book ${targetBookId}:`, error);
        throw new Error(`Error disabling book: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// EXPORT CONTROLLER FUNCTIONS
export { readBooks, createBook, updateBook, reserveBook, disableBook, returnBook, readOneBook };