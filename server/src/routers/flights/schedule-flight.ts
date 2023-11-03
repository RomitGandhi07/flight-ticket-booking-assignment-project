import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/flights/:flightId/schedule", async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.body;
    const { flightId } = req.params;

    //  Check whether that flight exists or not, if not then throw an error
    const flight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_METADATA} WHERE id=?`,
        values: [flightId]
    })

    if(!flight) {
        return res.status(404).json({
            error: "Flight not found."
        });
    }

    // Check whether flight is already scheduled for that date or not, if already scheduled then throw an error
    const flightSchedule = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_SCHEDULES} WHERE flight_id=? AND date=?`,
        values: [flightId, date]
    });

    if(flightSchedule) {
        return res.status(409).json({
            error: "Flight already scheduled for that date."
        });
    }

    // Check whether flight can be scheduled on this date or not
    // TODO: Need to check it with rrule plugin
    // return res.status(409).json({
    //     error: "Flight cannot be scheduled on this date."
    // })


    // Add record of scheduled flight
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.FLIGHTS_SCHEDULES,
        data: {
            flight_id: flightId,
            date: date
        }
    })

    return res.json({
        message: "Flight sccheduled successfully."
    })

});

export { router as scheduleFlightRouter }

