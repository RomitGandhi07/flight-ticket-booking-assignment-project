import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/flights/:flightId/schedule/:scheduleId/seats", async (req: Request, res: Response, next: NextFunction) => {
    const { flightId, scheduleId } = req.params;
    const { date } = req.query;

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
        query: `SELECT * FROM ${Tables.FLIGHT_SEATS} WHERE flight_schedule_id = ? AND date  = ?`,
        values: [scheduleId, date]
    })

    const response: Record<string, Array<any>> = {};

    scheduleFlightSeats.forEach((seat: any) => {
        if(response.hasOwnProperty(seat.class)) {
            response[seat.class].push(seat);
        }
        else {
            response[seat.class] = [seat];
        }
    });

    res.json(response);
});

export { router as listScheduledFlightSeatsRouter }

