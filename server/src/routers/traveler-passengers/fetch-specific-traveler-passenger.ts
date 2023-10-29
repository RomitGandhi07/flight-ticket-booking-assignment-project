import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/travelers/:travelerId/passengers/:passengerId", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId, passengerId } = req.params;

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

    // Fetch that specific passenger of traveler, if not found then throw an error otherwise send an response
    const passenger = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.PASSENGERS} WHERE id = ? AND traveler_id = ?`,
        values: [passengerId, travelerId]
    });

    if(!passenger) {
        return res.status(404).json({
            error: "Traveler passenger not found."
        });
    }

    return res.json({
        data: passenger
    })

});

export { router as fetchSpecificTravelerPassengerRouter }

