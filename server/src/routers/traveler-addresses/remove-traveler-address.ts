import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.delete("/travelers/:travelerId/addresses/:addressId", async (req: Request, res: Response, next: NextFunction) => {
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
        query: `SELECT * from ${Tables.TRAVELER_ADDRESSES} WHERE id=? AND traveler_id=?`,
        values: [addressId, travelerId]
    });

    if(!address) {
        return res.status(404).json({
            error: "Traveler address not found."
        });
    }

    //  Delete the record
    await databaseManager.deleteRecordFromTable({
        tableName: Tables.TRAVELER_ADDRESSES,
        whereCondition: {
            condition: "id = ?",
            values: [addressId]
        }
    });

    return res.json({
        message: "Traveler address removed successfully."
    });

});

export { router as removeTravelerAddressRouter }

