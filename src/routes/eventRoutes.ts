import express from "express";
import eventController from "../controllers/eventController.js";

const eventRouter = express.Router();

eventRouter.get("/:eventId", eventController.getEvent);
eventRouter.get("/:eventId/attendees", eventController.getEventAttendees);
eventRouter.post("/", eventController.createEvent);
eventRouter.post("/:eventId/attendees", eventController.registerEventAttendee);

export default eventRouter;
