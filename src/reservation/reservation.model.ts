import {model, Schema} from 'mongoose';

type ReservationType ={
    bookingId: string;
    userId: string;
    reservationDate: Date;
    returnDate: Date;
}

const ReservationSchema = new Schema<ReservationType>({
    bookingId: {type: String, required: true},
    userId: {type: String, required: true},
    reservationDate: {type: Date, default: new Date()},
    returnDate: {type: Date, default: null}
});

const ReservationModel = model<ReservationType>("Reservation", ReservationSchema);
export { ReservationModel, ReservationSchema, ReservationType };
