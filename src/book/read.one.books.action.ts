import { BookModel, BookType } from "../models/book.model";

async function ReadOneBookAction(bookId: string): Promise<BookType> {
    const results = await BookModel.findById(bookId) as BookType;

    return results;
}

export default ReadOneBookAction;