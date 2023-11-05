import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/search", async (req: Request, res: Response, next: NextFunction) => {
    const { from_city, to_city, no_of_users, date } = req.body;

    //  Check whether that flight exists or not, if not then throw an error
    const flights: any = await databaseManager.queryTable({
        query: `SELECT * FROM (
            SELECT F.*, COUNT(seat_number) as no_of_seats_available FROM
            (SELECT C.*, D.name as from_city_name, E.name as to_city_name FROM
                (SELECT A.*, B.date, B.id as flight_schedule_id FROM
                    (SELECT * FROM ${Tables.FLIGHTS_METADATA} WHERE from_city = ? AND to_city = ?) as A
                        INNER JOIN ${Tables.FLIGHTS_SCHEDULES} as B on A.id = B.flight_id WHERE B.date = ?) as C
                        INNER JOIN ${Tables.CITIES} as D ON C.from_city = D.id
                        INNER JOIN ${Tables.CITIES} as E on C.to_city = E.id) as F
                        INNER JOIN ${Tables.FLIGHT_SEATS} as G ON F.flight_schedule_id = G.flight_schedule_id
                        WHERE G.status = 'Available' GROUP BY F.id) as H WHERE H.no_of_seats_available >= ?`,
        values: [from_city, to_city, date, no_of_users]
    });

    return res.json({
        data: flights.map((flight: any) => {
            return {
                id: flight.id,
                from_city: flight.from_city_name,
                to_city: flight.to_city_name,
                code: flight.code,
                description: flight.description,
                departure_time: flight.departure_time,
                arrival_time: flight.arrival_time,
                date: flight.date,
                no_of_seats_available: flight.no_of_seats_available
            }
        })
    })
});

export { router as searchFlightsRouter }

