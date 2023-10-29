import express from "express";
import { travelersRouter } from "./routers/travelers";
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

const app = express();

app.use(express.json());

// Travelers Router
app.use("/travelers", travelersRouter);

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

export default app;