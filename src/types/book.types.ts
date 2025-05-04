import { BookType } from "../models/book.model";

export type CreateBookType = Omit<BookType, "_id">;
export type UpdateBookType = Omit<Partial<BookType>, "_id">;
export type ReserveBookType = Pick<BookType, "reserved" | "_id">;
export type BookQueryType = Partial<Omit<BookType, "pubDate"> & {pubDate: string}>;
