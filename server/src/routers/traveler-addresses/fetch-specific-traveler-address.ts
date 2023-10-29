import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/travelers/:travelerId/addresses/:addressId", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId, addressId } = req.params;

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

    // Fetch that specific address of traveler, if not found then throw an error otherwise send an response
    const address = await databaseManager.singleRecordQueryTable({
        query: `SELECT A.*, B.name as city, B.state_id, C.name as state, C.country_id, D.name as country FROM (SELECT * FROM ${Tables.TRAVELER_ADDRESSES} WHERE id = ? AND traveler_id = ?  ) as A INNER JOIN ${Tables.CITIES} as B ON A.city_id = B.id INNER JOIN ${Tables.STATES} as C ON B.state_id = C.id INNER JOIN ${Tables.COUNTRIES} as D ON C.country_id = D.id`,
        values: [addressId, travelerId]
    });

    if(!address) {
        return res.status(404).json({
            error: "Traveler address not found."
        });
    }

    return res.json({
        data: address
    })

});

export { router as fetchSpecificTravelerAddressRouter }

