import {model, Schema} from 'mongoose';

type BookType = {
    _id: string,
    name: string,
    autor: string,
    pubDate: Date,
    genre: string,
    publishber: string,
    reserved: boolean,
    disabled: boolean,
};

const BookSchema = new Schema<BookType>({
    name: {type: String, required: true},
    autor: {type: String, required: true},
    pubDate: {type: Date, required: true},
    genre: {type: String, required: true},
    publishber: {type: String, required: true},
    reserved: {type: Boolean, default: false},
    disabled: {type: Boolean, default: false},
},{
    timestamps: true,
    versionKey: false,
});


const BookModel = model<BookType>('Book', BookSchema);
export {BookModel, BookType, BookSchema};

