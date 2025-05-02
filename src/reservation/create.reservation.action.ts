import { ReservationModel, ReservationType } from "./reservation.model";
import { CreateReservationType } from "./reservation.types";

async function CreateReservationAction(reservationData: CreateReservationType): Promise<ReservationType> {
  const results = await ReservationModel.create(reservationData);

  return results;
}

export default CreateReservationAction;
