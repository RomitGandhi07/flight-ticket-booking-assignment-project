import express, { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { hashPassword } from "../../utils/password";
const router = express.Router();

export const registerTravelerController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, phone_number, password } = req.body;

    //  Check whether email and phone_number already exists or not
    const existingUser = await databaseManager.queryTable({
        query: "SELECT * FROM travelers WHERE email=? OR phone_number=?",
        values: [email, phone_number]
    });

    const hashedPassword = await hashPassword(password);

    // If user is already exist then throw an error
    if(existingUser) {
        return res.status(409).json({
            error: "User already exists."
        })
    }

    return res.json({
        hashedPassword
    });


};
