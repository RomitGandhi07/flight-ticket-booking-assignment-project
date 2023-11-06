import { Router, Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { hashPassword } from "../../utils/password";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
const router = Router();


router.post('/travelers/register', async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone_number, password } = req.body;

    //  Check whether email and phone_number already exists or not
    const existingUser = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.TRAVELERS} WHERE email=? OR phone_number=?`,
        values: [email, phone_number]
    });

    // If user is already exist then throw an error
    if(existingUser) {
        return res.status(409).json({
            error: "User already exists."
        })
    }

    const userData = pickFromObject(req.body, ["email", "name", "password", "phone_number", "gender", "dob"]);

    userData.password = await hashPassword(password);

    //  Add record into the table
    const result = await databaseManager.insertRecordIntoTable({
        tableName: Tables.TRAVELERS,
        data: userData
    });

    return res.json({
        message: "User added successfully."
    });
});

export { router as travelerRegisterRouter }
