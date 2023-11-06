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
import { searchFlightsRouter } from "./routers/bookings/flights-search";
import { bookingRouter } from "./routers/bookings/bookings";
import { updateBookingStatusRouter } from "./routers/bookings/update-booking-status";
import { listTravelerBookingsRouter } from "./routers/bookings/list-traveler-bookings";
import { addBookingReviewRouter } from "./routers/reviews/add-booking-review";
import { fetchSpecificBookingReviewRouter } from "./routers/reviews/fetch-specific-booking-review";
import { fetchSpecificBookingDetailsRouter } from "./routers/bookings/fetch-specific-booking-details";
import { travelerLoginRouter } from "./routers/travelers/login";
import { fetchSpecificTravelerDetailsRouter } from "./routers/travelers/fetch-traveler-details";
import { airlineStaffLoginRouter } from "./routers/airline-staff/login";
import { airlineStaffRegisterRouter } from "./routers/airline-staff/register";
import { fetchSpecificAirlineStaffDetailsRouter } from "./routers/airline-staff/fetch-airline-staff-details";

const app = express();

app.use(express.json());

// Airline staff router
app.use(airlineStaffLoginRouter);
app.use(airlineStaffRegisterRouter);
app.use(fetchSpecificAirlineStaffDetailsRouter);

// Flights
app.use(addFlightRouter);
app.use(scheduleFlightRouter);
app.use(updateScheduledFlightDetailsRouter);
app.use(updateFlightDetailsRouter);
app.use(addScheduledFlightSeatsRouter);
app.use(listScheduledFlightSeatsRouter);
app.use(updateScheduledFlightSeatsRouter);

// Travelers Router
app.use(travelerRegisterRouter);
app.use(travelerLoginRouter);
app.use(fetchSpecificTravelerDetailsRouter);

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

// Flights search
app.use(searchFlightsRouter);

// Bookings
app.use(bookingRouter);
app.use(updateBookingStatusRouter);
app.use(listTravelerBookingsRouter);
app.use(fetchSpecificBookingDetailsRouter);

// Booking review
app.use(addBookingReviewRouter);
app.use(fetchSpecificBookingReviewRouter);

export default app;