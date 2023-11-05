import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/search", async (req: Request, res: Response, next: NextFunction) => {
    const { from_city, to_city, no_of_users, date } = req.body;

    //  Check whether that flight exists or not, if not then throw an error
    const flights = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_METADATA} as JOIN ${Tables.FLIGHTS_SCHEDULES} ON `,
        values: []
    })
});

export { router as searchFlightsRouter }

