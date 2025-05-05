import { ReservationModel, ReservationType } from "../models/reservation.model";

/**
 * Updates the return date for an active reservation of a specific book and user.
 * @param bookId - ID of the book being returned
 * @param userId - ID of the user returning the book
 * @param returnDate - Date of return
 * @returns The updated reservation document
 * @throws Error if no active reservation is found
 */
async function SetReturnDateAction(
  bookId: string,
  userId: string,
  returnDate: Date
): Promise<ReservationType> {
  const reservation = await ReservationModel.findOneAndUpdate(
    {
      bookingId: bookId,
      userId,
      returnDate: null, 
    },
    {
      $set: { returnDate },
    },
    {
      new: true,
      runValidators: true, 
    }
  );

  if (!reservation) {
    throw new Error("No active reservation found for this book and user.");
  }

  return reservation as ReservationType;
}

export default SetReturnDateAction;
