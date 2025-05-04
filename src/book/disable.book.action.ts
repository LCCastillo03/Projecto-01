import { BookModel } from "../models/book.model";

async function DisableBookAction(targetBookId: string) {
    await BookModel.findByIdAndUpdate(targetBookId, {disabled: true});
}

export default DisableBookAction;
