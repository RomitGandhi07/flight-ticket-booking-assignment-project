import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.get("/travelers/:travelerId/bookings", async (req: Request, res: Response, next: NextFunction) => {
    const { travelerId } = req.params;

    //  Check whether traveler_id is valid or not, if not then throw an error
    const traveler = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.TRAVELERS} WHERE id=?`,
        values: [travelerId]
    })

    if(!traveler) {
        return res.status(404).json({
            error: "Traveler not found."
        });
    }

    // Fetch bookings
    const bookings = await databaseManager.queryTable({
        query: `SELECT A.id as id, A.status as status, C.amount as amount, E.name as to_city, F.name as from_city, B.date as date FROM
            (SELECT * FROM ${Tables.BOOKINGS} WHERE traveler_id = ?) as A
            INNER JOIN ${Tables.FLIGHTS_SCHEDULES} as B ON A.flight_schedule_id = B.id
            INNER JOIN ${Tables.PAYMENTS} as C ON A.payment_id = C.id
            INNER JOIN ${Tables.FLIGHTS_METADATA} as D ON B.flight_id = D.id
            INNER JOIN ${Tables.CITIES} as E ON D.to_city = E.id
            INNER JOIN ${Tables.CITIES} as F on D.from_city = F.id `,
        values: [travelerId]
    })

    return res.json(bookings);
});

export { router as listTravelerBookingsRouter }

