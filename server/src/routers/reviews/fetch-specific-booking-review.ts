import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/bookings/:bookingId/review", async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;

    //  Check whether booking is valid or not, if not then throw an error
    const bookingReview = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.BOOKINGS} WHERE id=?`,
        values: [bookingId]
    })

    if(!bookingReview) {
        return res.status(404).json({
            error: "Traveler not found."
        });
    }

    return res.json({
        ratings: bookingReview.ratings,
        comments: bookingReview.comments
    })

});

export { router as fetchSpecificBookingReviewRouter }

