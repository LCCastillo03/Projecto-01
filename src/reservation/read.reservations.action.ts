import { ReservationModel, ReservationType } from "../models/reservation.model";

async function ReadReservationsAction(query: object): Promise<ReservationType[]> {
    const results = await ReservationModel.find(query);

    return results;
}

export default ReadReservationsAction;
