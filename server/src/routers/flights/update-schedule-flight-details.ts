import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.put("/flights/:flightId/schedule/:scheduleId", async (req: Request, res: Response, next: NextFunction) => {
    const { flightId, scheduleId } = req.params;

    //  Check whether scheduled flight present or not, if not then throw an error
    const flight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_SCHEDULES} WHERE id = ? AND flight_id = ?`,
        values: [scheduleId, flightId]
    })

    if(!flight) {
        return res.status(404).json({
            error: "Scheduled flight not found."
        });
    }

    // Get the schedule flight data from the request body and update the record in the database
    const scheduleFlightData = pickFromObject(req.body, ["from_city_terminal", "to_city_terminal", "from_city_gate", "to_city_gate"]);

    await databaseManager.updateRecordFromTable({
        tableName: Tables.FLIGHTS_SCHEDULES,
        record: scheduleFlightData,
        whereCondition: {
            condition: "id = ?",
            values: [scheduleId]
        }
    })

    return res.json({
        message: "Flight details for that schedule updated successfully."
    })

});

export { router as updateScheduledFlightDetailsRouter }

