import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/travelers/:travelerId/passengers", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId } = req.params;
    const { aadhar_number, passport_number } = req.body;

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

    //  If aadhar number or passport number is provided then check whether it is already added for that traveler or not
    if(aadhar_number) {
        const existingRecord = await databaseManager.singleRecordQueryTable({
            query: `SELECT count(*) as count FROM ${Tables.PASSENGERS} WHERE traveler_id = ? AND aadhar_number = ?`,
            values: [travelerId, aadhar_number]
        });
    
        if(existingRecord && existingRecord.count) {
            return res.status(409).json({
                error: "User already exists with this aadhar number."
            });
        }
    }

    if(passport_number) {
        const existingRecord = await databaseManager.singleRecordQueryTable({
            query: `SELECT count(*) as count FROM ${Tables.PASSENGERS} WHERE traveler_id = ? AND passport_number = ?`,
            values: [travelerId, passport_number]
        });
    
        if(existingRecord && existingRecord.count) {
            return res.status(409).json({
                error: "User already exists with this passport number."
            });
        }
    }


    // Pick the address data from the request body and set travelerId
    const passengersData = pickFromObject(req.body, ["name", "gender", "aadhar_number", "passport_number", "dob"]);
    passengersData.traveler_id = travelerId;


    //  Add record into the tabble
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.PASSENGERS,
        data: passengersData
    })

    return res.json({
        message: "Traveler passenger added successfully."
    })

});

export { router as addTravelerPassengerRouter }

