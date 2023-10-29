import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.put("/travelers/:travelerId/passengers/:passengerId", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId, passengerId } = req.params;
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

    // Fetch that specific passenger of traveler, if not found then throw an
    const passenger = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.PASSENGERS} WHERE id = ? AND traveler_id = ?`,
        values: [passengerId, travelerId]
    });

    if(!passenger) {
        return res.status(404).json({
            error: "Traveler passenger not found."
        });
    }

    //  If aadhar number or passport number is provided then check whether it is already added for that traveler or not
    if(aadhar_number) {
        const existingRecord = await databaseManager.singleRecordQueryTable({
            query: `SELECT * FROM ${Tables.PASSENGERS} WHERE traveler_id = ? AND aadhar_number = ?`,
            values: [travelerId, aadhar_number]
        });
    
        if(existingRecord && existingRecord.id !== passenger.id) {
            return res.status(409).json({
                error: "User already exists with this aadhar number."
            });
        }
    }

    if(passport_number) {
        const existingRecord = await databaseManager.singleRecordQueryTable({
            query: `SELECT * FROM ${Tables.PASSENGERS} WHERE traveler_id = ? AND passport_number = ?`,
            values: [travelerId, passport_number]
        });
    
        if(existingRecord && existingRecord.id !== passenger.id) {
            return res.status(409).json({
                error: "User already exists with this passport number."
            });
        }
    }


    // Pick the address data from the request body and set travelerId
    const passengersData = pickFromObject(req.body, ["name", "gender", "aadhar_number", "passport_number", "dob"]);


    //  update record into the tabble
    await databaseManager.updateRecordFromTable({
        tableName: Tables.PASSENGERS,
        record: passengersData,
        whereCondition: {
            condition: "id = ?",
            values: [passengerId]
        }
    })

    return res.json({
        message: "Traveler passenger updated successfully."
    });
});

export { router as updateTravelerPassengerRouter }

