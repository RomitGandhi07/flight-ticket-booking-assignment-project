import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.put("/flights/:flightId", async (req: Request, res: Response, next: NextFunction) => {
    const { flightId } = req.params;

    //  Check whether scheduled flight present or not, if not then throw an error
    const flight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_METADATA} WHERE id = ?`,
        values: [flightId]
    })

    if(!flight) {
        return res.status(404).json({
            error: "Flight not found."
        });
    }

    // Extract flight data and upate the details
    const flightData = pickFromObject(req.body, ["description", "departure_time", "arrival_time", "recurrence_rule"]);
    flightData.updated_by = "c211c859-5487-11ee-994c-58112284b424";

    await databaseManager.updateRecordFromTable({
        tableName: Tables.FLIGHTS_METADATA,
        record: flightData,
        whereCondition: {
            condition: "id = ?",
            values: [flightId]
        }
    })

    return res.json({
        message: "Flight details updated successfully."
    })

});

export { router as updateFlightDetailsRouter }

