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

    const bookingStatus = status === 'Paid' ? 'Confirmed' : 'Cancelled';

    // Update payment status
    await databaseManager.updateRecordFromTable({
        tableName: Tables.PAYMENTS,
        record: {
            status
        },
        whereCondition: {
            condition: "id = ?",
            values: [paymentId]
        }
    });

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
    });

    // Fetch bookingId
    const booking: any = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.BOOKINGS} WHERE payment_id = ?`,
        values: [paymentId]
    });

    // Fetch all booking passengers
    const bookingPassengers: any = await databaseManager.queryTable({
        query: `SELECT * FROM ${Tables.BOOKING_PASSENGERS} WHERE booking_id = ?`,
        values: [booking.id]
    });

    // Mark seats as Booked if paid otherwise avaialable
    for(const bookingPassenger of bookingPassengers) {
        await databaseManager.updateRecordFromTable({
            tableName: Tables.FLIGHT_SEATS,
            record: {
                status: bookingStatus === 'Confirmed' ? 'Booked': 'Available',
            },
            whereCondition: {
                condition: "id = ?",
                values: [bookingPassenger.flight_seat_id]
            }
        });
    }
    return res.json({
        message: `Booking ${bookingStatus !== 'Cancelled' ? bookingStatus : 'Failed'}.`
    });
});

export { router as updateBookingStatusRouter }

