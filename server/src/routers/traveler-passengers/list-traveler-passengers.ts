import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/travelers/:travelerId/passengers", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId } = req.params;

    //  Check whether traveler_id is valid or not, if not then throw an error
    const traveler = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.TRAVELERS} WHERE id=?`,
        values: [travelerId]
    })

    if(!traveler) {
        return res.status(404).json({
            error: "Traveler not found."
        });
    }

    // Fetch passengers of that traveler
    const passengers = await databaseManager.queryTable({
        query: `SELECT * from ${Tables.PASSENGERS} WHERE traveler_id = ?`,
        values: [travelerId]
    });


    return res.json({
        data: passengers
    })

});

export { router as listTravelerPassengersRouter }

