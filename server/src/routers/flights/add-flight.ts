import { Request, Response, NextFunction } from "express";
import { databaseManager } from "../../lib/database-manager";
import { pickFromObject } from "../../utils";
import { Tables } from "../../enums/tables.enum";
import express from "express";
const router = express.Router();

router.post("/flights", async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    //  Check whether that flight code is already exist or not, if already exist then throw an error
    const flight = await databaseManager.singleRecordQueryTable({
        query: `SELECT * FROM ${Tables.FLIGHTS_METADATA} WHERE code=?`,
        values: [code]
    })

    if(flight) {
        return res.status(409).json({
            error: "Flight already exists."
        });
    }


    // Pick the flight data from the request body and set createdBy and updatedBy
    const flightData = pickFromObject(req.body, ["code", "description", "from_city", "to_city", "departure_time", "arrival_time", "recurrence_rule"]);

    // If from city and to city is same then throw an error
    if(flightData.from_city === flightData.to_city) {
        return res.status(400).json({
            error: "From city and to city cannot be same."
        });
    }

    // Validate that to_city and from_city are valid or not
    const cities: any = await databaseManager.queryTable({
        query: `SELECT * from ${Tables.CITIES} WHERE id IN (? , ?)`,
        values: [flightData.from_city, flightData.to_city]
    });
    if(cities.length === 0) {
        return res.status(404).json({
            error: "To city not found."
        })
    }

    if(cities.length === 1) {
        if(cities[0].id !== flightData.to_city) {
            return res.status(404).json({
                error: "To city not found."
            })  
        }

        if(cities[0].id !== flightData.from_city) {
            return res.status(404).json({
                error: "From city not found."
            })  
        }
    }

    // Set fligh is_active, created_by and updated_by
    flightData.is_active = true;
    flightData.created_by = "c211c859-5487-11ee-994c-58112284b424";
    flightData.updated_by = "c211c859-5487-11ee-994c-58112284b424";

    //  Add record into the tabble
    await databaseManager.insertRecordIntoTable({
        tableName: Tables.FLIGHTS_METADATA,
        data: flightData
    })

    return res.json({
        message: "Flight added successfully."
    })

});

export { router as addFlightRouter }

