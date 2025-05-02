import { ReservationType } from "./reservation.model";

export type CreateReservationType = Omit<ReservationType, "_id" | "returnDate" | "reservationDate">;