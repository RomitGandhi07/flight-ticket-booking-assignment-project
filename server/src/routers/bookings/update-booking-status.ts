import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();


router.put("/bookings/payments/:paymentId", async (req: Request, res: Response, next: NextFunction) => {
    const { paymentId } = req.params;
    const { status } = req.body;


    //  Check payment exists or not, if not then throw an error
    const payment = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.PAYMENTS} WHERE id= ? AND status = 'Pending'`,
        values: [paymentId]
    });

    if(!payment) {
        return res.status(404).json({
            error: "Payment record not found."
        });
    }

    const bookingStatus = status === 'Paid' ? 'Confirmed' : 'Failed';

    // Update the booking status
    await databaseManager.updateRecordFromTable({
        tableName: Tables.BOOKINGS,
        record: {
            status: bookingStatus
        },
        whereCondition: {
            condition: "payment_id = ?",
            values: [paymentId]
        }
    })


    return res.json({
        message: `Booking ${bookingStatus}.`
    })

});

export { router as updateBookingStatusRouter }

