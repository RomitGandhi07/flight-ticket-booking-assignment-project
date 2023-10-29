import express from "express";
import { travelersRouter } from "./routers/travelers";
import { addTravelerAddressRouter } from "./routers/traveler-addresses/add-traveler-address";
import { listTravelerAddressesRouter } from "./routers/traveler-addresses/list-traveler-addresses";
import { fetchSpecificTravelerAddressRouter } from "./routers/traveler-addresses/fetch-specific-traveler-address";
import { updateTravelerAddressRouter } from "./routers/traveler-addresses/update-traveler-address";
import { removeTravelerAddressRouter } from "./routers/traveler-addresses/remove-traveler-address";

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

export default app;