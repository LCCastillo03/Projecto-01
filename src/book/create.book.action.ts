import { BookModel, BookType } from "./book.model";
import { CreateBookType } from "./book.types";

async function CreateBookAction(bookData: CreateBookType): Promise<BookType> {
  const results = await BookModel.create(bookData);

  return results;
}

export default CreateBookAction;
