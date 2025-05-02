import { BookModel, BookType } from "./book.model";
import { UpdateBookType } from "./book.types";

async function UpdateBookAction(targetBookId: string, updateData: UpdateBookType): Promise<BookType> {
    const updatedBook = await BookModel.findByIdAndUpdate(targetBookId, updateData, {
        new: true
    }) as BookType;

    if (!updatedBook) {
        throw new Error("BookId does not exits.")
    }
    
    return updatedBook;
}

export default UpdateBookAction;
