import { BookModel, BookType } from "../models/book.model";
import { CreateBookType } from "../types/book.types";

async function CreateBookAction(bookData: CreateBookType): Promise<BookType> {
  const results = await BookModel.create(bookData);

  return results;
}

export default CreateBookAction;
