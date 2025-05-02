import { BookModel, BookType } from "./book.model";

async function ReadOneBookAction(bookId: string): Promise<BookType> {
    const results = await BookModel.findById(bookId) as BookType;

    return results;
}

export default ReadOneBookAction;