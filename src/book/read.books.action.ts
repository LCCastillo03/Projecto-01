import { BookModel, BookType } from "./book.model";

async function ReadBooksAction(query: object): Promise<BookType[]> {
    const results = await BookModel.find(query);

    return results;
}

export default ReadBooksAction;
