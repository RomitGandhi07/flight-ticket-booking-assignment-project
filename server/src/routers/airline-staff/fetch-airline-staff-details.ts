import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/staff/:staffId", async (req: Request, res: Response, next: NextFunction) => {
    const { staffId } = req.params;

    //  Check whether traveler_id is valid or not, if not then throw an error
    const staff = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.AIRLINE_STAFF} WHERE id=?`,
        values: [staffId]
    })

    if(!staff) {
        return res.status(404).json({
            error: "Staff not found."
        });
    }

    return res.json({
        data: staff
    })

});

export { router as fetchSpecificAirlineStaffDetailsRouter }

