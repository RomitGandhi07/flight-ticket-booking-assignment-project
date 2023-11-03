import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/flights/:flightId/schedule/:scheduleId/seats", async (req: Request, res: Response, next: NextFunction) => {
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

    // If provided datte is greater than scheduled date then throw an error
    if(new Date(date) > scheduledFlight.date) {
        return res.status(409).json({
            error: "Date cannot be greater than the scheduled flight date."
        });
    }

    //  Fetch all currently existed seat numbers of that scheduled flight and prepare set of currently existed seat numbers
    const scheduleFlightSeats: any = await databaseManager.queryTable({
        query: `SELECT * FROM ${Tables.FLIGHT_SEATS} WHERE flight_schedule_id = ? AND date = ?`,
        values: [scheduleId, date]
    })

    const seatNumbersSet: Set<string> = new Set(scheduleFlightSeats.map((record: any) => record.seat_number));

    //  Loop through all seats number and add entry in the alreadyExistedSeatNumbers if that seat number is already existed
    const alreadyExistedSeatNumbers: Set<string> = new Set();
    seats.forEach((record: any) => {
        if(seatNumbersSet.has(record.seat_number)) {
            alreadyExistedSeatNumbers.add(record.seat_number);
        }

        record.flight_schedule_id = scheduleId;
        record.date = date;

    });

    if(alreadyExistedSeatNumbers.size) {
        return res.status(409).json({
            error: `${[...alreadyExistedSeatNumbers]} seats are already exists.`
        })
    }
    

    // Add record of scheduled flight
    await databaseManager.insertMultipleRecordIntoTable({
        tableName: Tables.FLIGHT_SEATS,
        data: seats
    })

    return res.json({
        message: "Flight seats added successfully."
    })

});

export { router as addScheduledFlightSeatsRouter }

