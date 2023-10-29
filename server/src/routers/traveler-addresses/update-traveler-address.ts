import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.put("/travelers/:travelerId/addresses/:addressId", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId, addressId } = req.params;
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

    // Fetch that specific address of traveler, if not found then throw an error otherwise send an response
    const address = await databaseManager.singleRecordQueryTable({
        query: `SELECT * from ${Tables.TRAVELER_ADDRESSES} WHERE id=? AND traveler_id=?`,
        values: [addressId, travelerId]
    });

    if(!address) {
        return res.status(404).json({
            error: "Traveler address not found."
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


    //  Add record into the tabble
    await databaseManager.updateRecordFromTable({
        tableName: Tables.TRAVELER_ADDRESSES,
        record: addressData,
        whereCondition: {
            condition: "id = ?",
            values: [addressId]
        }
    })

    return res.json({
        message: "Traveler address updated successfully."
    })

});

export { router as updateTravelerAddressRouter }

