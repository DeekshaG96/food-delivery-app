import express from "express";
import {
    bookReservation,
    listReservations,
    userReservations,
    updateStatus
} from "../controllers/reservationController.js";

const reservationRouter = express.Router();

reservationRouter.post("/book", bookReservation);
reservationRouter.get("/list", listReservations);
reservationRouter.post("/user", userReservations);
reservationRouter.get("/user", userReservations);
reservationRouter.post("/status", updateStatus);

export default reservationRouter;
