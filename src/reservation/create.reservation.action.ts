import { ReservationModel, ReservationType } from "../models/reservation.model";
import { CreateReservationType } from "../types/reservation.types";

async function CreateReservationAction(reservationData: CreateReservationType): Promise<ReservationType> {
  const results = await ReservationModel.create(reservationData);

  return results;
}

export default CreateReservationAction;
