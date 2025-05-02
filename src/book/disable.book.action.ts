import { BookModel } from "./book.model";

async function DisableBookAction(targetBookId: string) {
    await BookModel.findByIdAndUpdate(targetBookId, {disabled: true});
}

export default DisableBookAction;
