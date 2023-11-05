import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/travelers/:travelerId/bookings/:bookingId", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId, bookingId } = req.params;
    const { ratings, comments } = req.body;

    //  Check whether booking is valid or not, if not then throw an error
    const booking = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.BOOKINGS} WHERE id=? AND traveler_id = ? AND status = 'Confirmed'`,
        values: [bookingId, travelerId]
    })

    if(!booking) {
        return res.status(404).json({
            error: "Booking not found."
        });
    }

    // Check if already review provided or not
    const reviewExist = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.REVIEWS} WHERE booking_id = ?`,
        values: [bookingId]
    })

    if(reviewExist) {
        return res.status(409).json({
            error: "Booking already reviewed."
        })
    }

    // Insert review
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.REVIEWS,
        data: {
            booking_id: bookingId,
            ratings,
            comments
        }
    })

    return res.json({
        message: "Review added successfully."
    })

});

export { router as addBookingReviewRouter }

