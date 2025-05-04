import { BookModel, BookType } from "../models/book.model";

async function ReadBooksAction(query: object): Promise<BookType[]> {
    const results = await BookModel.find(query);

    return results;
}

export default ReadBooksAction;
