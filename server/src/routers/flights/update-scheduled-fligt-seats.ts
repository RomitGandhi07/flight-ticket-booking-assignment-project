import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.put("/flights/:flightId/schedule/:scheduleId/seats", async (req: Request, res: Response, next: NextFunction) => {
    const { seats = [], date } = req.body;
    const { flightId, scheduleId } = req.params;

    //  Check whether that flight exists or not, if not then throw an error
    const scheduledFlight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_SCHEDULES} WHERE id=? AND flight_id = ?`,
        values: [scheduleId, flightId]
    })

    if(!scheduledFlight) {
        return res.status(404).json({
            error: "Flight not found."
        });
    }

    //  Fetch all currently existed seat numbers of that scheduled flight and prepare set of currently existed seat numbers
    const scheduleFlightSeats: any = await databaseManager.queryTable({
        query: `SELECT * FROM ${Tables.FLIGHT_SEATS} WHERE flight_schedule_id = ? AND date = ?`,
        values: [scheduleId, date]
    })

    const seatNumbersSet: Set<string> = new Set(scheduleFlightSeats.map((record: any) => record.seat_number));

    //  Loop through all seats number and add entry in the alreadyExistedSeatNumbers if that seat number is already existed
    const notExistedSeatNumbers: Set<string> = new Set();
    seats.forEach((record: any) => {
        if(!seatNumbersSet.has(record.seat_number)) {
            notExistedSeatNumbers.add(record.seat_number);
        }
    });

    if(notExistedSeatNumbers.size) {
        return res.status(409).json({
            error: `${[...notExistedSeatNumbers]} seats aren't exists.`
        })
    }
    

    // Loop through all seats and update the seat, if seat is not updated then add it in notUpdatedSeatNumbers
    const notUpdatedSeatNumbers: Set<string> = new Set();
    for(const seat of seats) {
        try {
            // Add record of scheduled flight
            await databaseManager.updateRecordFromTable({
                tableName: Tables.FLIGHT_SEATS,
                record: seat,
                whereCondition: {
                    condition: `flight_schedule_id = ? AND date = ? AND seat_number = ?`,
                    values: [scheduleId, date, seat.seat_number]
                }
            })
        }
        catch(err) {
            notUpdatedSeatNumbers.add(seat.seat_number);
        }
    }

    if(notUpdatedSeatNumbers.size) {
        return res.status(409).json({
            error: `${[...notUpdatedSeatNumbers]} seats couldn't be updated.`
        })
    }

    return res.json({
        message: "Flight seats updated successfully."
    })

});

export { router as updateScheduledFlightSeatsRouter }

