import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { comparePassword, hashPassword } from "../../utils/password";

export const loginTravelerController = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    //  Check whether email exists or not, if not then throw 404 not found error
    const existingUser = await databaseManager.singleRecordQueryTable({
        query: "SELECT * FROM travelers WHERE email=?",
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

};
