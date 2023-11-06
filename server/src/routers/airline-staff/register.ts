import { Router, Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { hashPassword } from "../../utils/password";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
const router = Router();


router.post('/staff/register', async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone_number, password } = req.body;

    //  Check whether email and phone_number already exists or not
    const existingUser = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.AIRLINE_STAFF} WHERE email=? OR phone_number=?`,
        values: [email, phone_number]
    });


    // If user is already exist then throw an error
    if(existingUser) {
        return res.status(409).json({
            error: "User already exists."
        })
    }

    const userData = pickFromObject(req.body, ["email", "name", "password", "phone_number", "gender", "dob", "employee_id", "designation", "manager_id"]);

    // Check employee exist with given id or not
    const existingEmployee = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.AIRLINE_STAFF} WHERE employee_id = ?`,
        values: [userData.employee_id]
    })
    if(existingEmployee) {
        return res.status(409).json({
            error: "Employee already exists with provided employee id"
        });
    }

    userData.password = await hashPassword(password);

    //  Add record into the table
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.AIRLINE_STAFF,
        data: userData
    });

    return res.json({
        message: "User added successfully."
    });
});

export { router as airlineStaffRegisterRouter }
