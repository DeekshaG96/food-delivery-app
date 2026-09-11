import { dbStore } from "../config/store.js";

// Book a table reservation
export const bookReservation = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            guests,
            date,
            timeSlot,
            seatingArea,
            specialOccasion,
            specialRequests
        } = req.body;

        if (!name || !email || !phone || !date || !timeSlot) {
            return res.json({
                success: false,
                message: "Please provide all required fields (Name, Email, Phone, Date, Time Slot)"
            });
        }

        const reservation = await dbStore.createReservation({
            name,
            email,
            phone,
            guests: Number(guests) || 2,
            date,
            timeSlot,
            seatingArea: seatingArea || "Indoor Cozy",
            specialOccasion: specialOccasion || "Casual Dining",
            specialRequests: specialRequests || "",
            status: "Confirmed"
        });

        res.json({
            success: true,
            message: `Reservation confirmed for ${name}! Booking Code: ${reservation.bookingCode}`,
            data: reservation
        });
    } catch (error) {
        console.error("Book reservation error:", error);
        res.json({ success: false, message: "Error booking table reservation" });
    }
};

// List all reservations for restaurant admin
export const listReservations = async (req, res) => {
    try {
        const reservations = await dbStore.getAllReservations();
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error("List reservations error:", error);
        res.json({ success: false, message: "Error fetching reservations" });
    }
};

// Get reservations for specific user / email
export const userReservations = async (req, res) => {
    try {
        const email = req.body.email || req.query.email;
        if (!email) {
            return res.json({ success: false, message: "Email required to find reservations" });
        }
        const reservations = await dbStore.getUserReservations(email);
        res.json({ success: true, data: reservations });
    } catch (error) {
        console.error("User reservations error:", error);
        res.json({ success: false, message: "Error fetching user reservations" });
    }
};

// Update reservation status (Confirmed, Seated, Completed, Cancelled)
export const updateStatus = async (req, res) => {
    try {
        const { resId, reservationId, id, status } = req.body;
        const targetId = resId || reservationId || id;
        if (!targetId || !status) {
            return res.json({ success: false, message: "Reservation ID and status required" });
        }
        const updated = await dbStore.updateReservationStatus(targetId, status);
        if (!updated) {
            return res.json({ success: false, message: "Reservation not found" });
        }
        res.json({
            success: true,
            message: `Reservation status updated to ${status}`,
            data: updated
        });
    } catch (error) {
        console.error("Update reservation status error:", error);
        res.json({ success: false, message: "Error updating reservation status" });
    }
};
