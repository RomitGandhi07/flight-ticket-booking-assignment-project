import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { Tables } from "../../enums/tables.enum";
import express from "express";
import crypto from "crypto";
const router = express.Router();


router.post("/bookings", async (req: Request, res: Response, next: NextFunction) => {
    const travelerId = "fad6de03-547d-11ee-994c-58112284b424";
    const { flight_schedule_id, seats } = req.body;

    const date = new Date().toISOString().split('T')[0];

    //  Check whether flight is scheduled or not, if not then therow an error
    const flight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_SCHEDULES} WHERE id=?`,
        values: [flight_schedule_id]
    });

    if(flight) {
        return res.status(409).json({
            error: "Flight already exists."
        });
    }

    // Fetch all passengers of that traveler and prepare set of passenger Ids
    const passengers: any = await databaseManager.queryTable({
        query: `SELECT * FROM ${Tables.PASSENGERS} where traveler_id=?`,
        values: [travelerId]
    });

    const passengersSet = new Set();
    passengers.forEach((passenger: any) => {
        passengersSet.add(passenger.id);
    });

    // Fetch all seats of that flight and create map of seat number with status
    const flightSeats: any = await databaseManager.queryTable({
        query: `SELECT * FROM ${Tables.FLIGHT_SEATS} WHERE flight_schedule_id = AND date = ?`,
        values: [flight_schedule_id, date]
    });

    const flightSeatsMap = new Map();
    flightSeats.forEach((seat: any) => {
        flightSeatsMap.set(seat.seat_number, seat);
    });


    // Loop through all seats provided and check whether all seat numbers and passengers are valid or not
    let totalAmount = 0;
    const passengerSeats: Array<any> = [];;

    seats.forEach((seat: any) => {
        const flightSeatInfo = flightSeatsMap.get(seat.seat_number);
        if(!flightSeatInfo) {
            return res.status(404).json({
                error: `Seat ${seat.seat_number} is not valid.`
            })
        }

        if(flightSeatInfo.status !== 'Available') {
            return res.status(409).json({
                error: `Seat ${seat.seat_number} is not avaiable.`
            })
        }

        if(!passengersSet.has(seat.passenger_id)) {
            return res.status(404).json({
                error: `Please make sure all the passengers are valid.`
            })
        }

        totalAmount+= flightSeatInfo.price;
        passengerSeats.push({
            passenger_id: seat.passenger_id,
            flight_seat_id: flightSeatInfo.id
        });
    });

    // Add pending entry in the payments
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.PAYMENTS,
        data: {
            traveler_id: travelerId,
            amount: totalAmount,
            txn_id: crypto.randomBytes(20).toString('hex'),
            status: 'Pending',
        }
    });

    // Add entry of booking in the boookings table
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.BOOKINGS,
        data: {
            traveler_id: travelerId,
            flight_schedule_id: flight_schedule_id,
            payment_id: "", // TODO: Need to fetch payment id
            status: 'Pending'
        }
    });

    // Add entry in the booking passengers
    await databaseManager.insertMultipleRecordIntoTable({
        tableName: Tables.BOOKING_PASSENGERS,
        data: passengerSeats.map(record => {
            return {
                ...record,
                booking_id: "" // TODO: Need to fetch booking_id
            }
        })
    })

    return res.json({
        message: "Tickets booked at pending state."
    })

});

export { router as bookingRouter }

