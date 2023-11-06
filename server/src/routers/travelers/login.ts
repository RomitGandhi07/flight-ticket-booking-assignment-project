import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { comparePassword } from "../../utils/password";
import express from "express";
import { Tables } from "../../enums/tables.enum";
const router = express.Router();

router.post('/travelers/login', async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //  Check whether email exists or not, if not then throw 404 not found error
    const existingUser = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.TRAVELERS} WHERE email=?`,
        values: [email]
    });

    if(!existingUser) {
        return res.status(404).send({
            error: "User not found."
        });
    }

    // Check whether the provided password and the user's password are matching or not, if not then throw an error
    const isPasswordMatching = await comparePassword(password, existingUser.password);
    if(!isPasswordMatching) {
        return res.status(400).send({
            error: "Please provide valid credentials."
        });
    }

    // Set the cookies

    return res.json({
        message: "User logged in successfully."
    })

});

export { router as travelerLoginRouter }
