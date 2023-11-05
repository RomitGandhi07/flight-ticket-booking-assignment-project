import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/bookings/:bookingId", async (req: Request, res: Response, next: NextFunction) => {
    const { bookingId } = req.params;

    //  Check whether booking is valid or not, if not then throw an error
    const booking = await databaseManager.singleRecordQueryTable({
        query: `SELECT A.id as id, A.status as status, C.amount as amount, E.name as to_city, F.name as from_city, B.date as date FROM
        (SELECT * FROM ${Tables.BOOKINGS} WHERE id = ?) as A
        INNER JOIN ${Tables.FLIGHTS_SCHEDULES} as B ON A.flight_schedule_id = B.id
        INNER JOIN ${Tables.PAYMENTS} as C ON A.payment_id = C.id
        INNER JOIN ${Tables.FLIGHTS_METADATA} as D ON B.flight_id = D.id
        INNER JOIN ${Tables.CITIES} as E ON D.to_city = E.id
        INNER JOIN ${Tables.CITIES} as F on D.from_city = F.id `,
        values: [bookingId]
    })

    if(!booking) {
        return res.status(404).json({
            error: "Booking not found."
        });
    }

    const passengers = await databaseManager.queryTable({
        query: `SELECT B.* FROM (SELECT * FROM ${Tables.BOOKING_PASSENGERS} WHERE booking_id = ?) as A INNER JOIN passengers as B ON A.passenger_id = B.id`,
        values: [bookingId]
    })

    return res.json({
        bookingDetails: booking,
        passengers
    });

});

export { router as fetchSpecificBookingDetailsRouter }

