import express from "express";
import attendeeController from "../controllers/attendeeController.js";

const attendeeRouter = express.Router();

attendeeRouter.get("/:attendeeId/check-in", attendeeController.checkIn);
attendeeRouter.get("/:attendeeId/badge", attendeeController.getBadge);

export default attendeeRouter;
