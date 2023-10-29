import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/travelers/:travelerId/addresses", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId } = req.params;
    const { city_id } = req.body;

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

    //  Check whether city_id is valid or not, if not then throw an error
    const city = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.CITIES} WHERE id=?`,
        values: [city_id]
    });

    if(!city) {
        return res.status(404).json({
            error: "City not found."
        });
    }


    // Pick the address data from the request body and set travelerId
    const addressData = pickFromObject(req.body, ["addressline1", "addressline2", "zip", "city_id"]);
    addressData.traveler_id = travelerId;


    //  Add record into the tabble
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.TRAVELER_ADDRESSES,
        data: addressData
    })

    return res.json({
        message: "Traveler address added successfully."
    })

});

export { router as addTravelerAddressRouter }

