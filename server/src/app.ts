import express from "express";
import { addTravelerAddressRouter } from "./routers/traveler-addresses/add-traveler-address";
import { listTravelerAddressesRouter } from "./routers/traveler-addresses/list-traveler-addresses";
import { fetchSpecificTravelerAddressRouter } from "./routers/traveler-addresses/fetch-specific-traveler-address";
import { updateTravelerAddressRouter } from "./routers/traveler-addresses/update-traveler-address";
import { removeTravelerAddressRouter } from "./routers/traveler-addresses/remove-traveler-address";
import { addTravelerPassengerRouter } from "./routers/traveler-passengers/add-traveler-passenger";
import { listTravelerPassengersRouter } from "./routers/traveler-passengers/list-traveler-passengers";
import { fetchSpecificTravelerPassengerRouter } from "./routers/traveler-passengers/fetch-specific-traveler-passenger";
import { updateTravelerPassengerRouter } from "./routers/traveler-passengers/update-traveler-passenger";
import { removeTravelerPassengerRouter } from "./routers/traveler-passengers/remove-traveler-passenger";
import { travelerRegisterRouter } from "./routers/travelers/register";
import { addFlightRouter } from "./routers/flights/add-flight";
import { scheduleFlightRouter } from "./routers/flights/schedule-flight";
import { updateScheduledFlightDetailsRouter } from "./routers/flights/update-schedule-flight-details";
import { updateFlightDetailsRouter } from "./routers/flights/update-flight-details";
import { addScheduledFlightSeatsRouter } from "./routers/flights/add-scheduled-fligt-seats";
import { listScheduledFlightSeatsRouter } from "./routers/flights/list-scheduled-fligt-seats";
import { updateScheduledFlightSeatsRouter } from "./routers/flights/update-scheduled-fligt-seats";

const app = express();

app.use(express.json());

// Travelers Router
app.use(travelerRegisterRouter);

// Traveler Addresses
app.use(addTravelerAddressRouter);
app.use(listTravelerAddressesRouter);
app.use(fetchSpecificTravelerAddressRouter);
app.use(updateTravelerAddressRouter);
app.use(removeTravelerAddressRouter);

// Traveler Passengers
app.use(addTravelerPassengerRouter);
app.use(listTravelerPassengersRouter);
app.use(fetchSpecificTravelerPassengerRouter);
app.use(updateTravelerPassengerRouter);
app.use(removeTravelerPassengerRouter);

// Flights
app.use(addFlightRouter);
app.use(scheduleFlightRouter);
app.use(updateScheduledFlightDetailsRouter);
app.use(updateFlightDetailsRouter);
app.use(addScheduledFlightSeatsRouter);
app.use(listScheduledFlightSeatsRouter);
app.use(updateScheduledFlightSeatsRouter);

export default app;