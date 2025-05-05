import { ReservationType } from "../models/reservation.model";

export type CreateReservationType = Omit<ReservationType, "_id" | "returnDate" | "reservationDate">;