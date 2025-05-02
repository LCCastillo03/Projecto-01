import { ReservationModel, ReservationType } from "./reservation.model";

async function ReadReservationsAction(query: object): Promise<ReservationType[]> {
    const results = await ReservationModel.find(query);

    return results;
}

export default ReadReservationsAction;
