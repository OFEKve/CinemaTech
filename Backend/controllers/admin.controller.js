import { User } from "../models/user.model.js";
import { CancellationRequest } from "../models/cancellationRequest.model.js";

export const getAllCancellationRequests = async (req, res) => {
  const { status } = req.query;

  try {
    const query = status ? { status } : {};
    const requests = await CancellationRequest.find(query)
      .populate("user", "username email phone")
      .populate("ticket", "movieName selectedSeats hallNumber selectedTimeSlot")
      .exec();

    res.status(200).json({ success: true, requests });
  } catch (error) {
    console.error("Error fetching cancellation requests:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch cancellation requests.",
    });
  }
};

// פונקציה להצגת כל המשתמשים
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password"); // לא לכלול את הסיסמא
    res.status(200).json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch users." });
  }
};

// פונקציה למחיקת משתמש
export const deleteUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }
    res
      .status(200)
      .json({ success: true, message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error.message);
    res.status(500).json({ success: false, message: "Failed to delete user." });
  }
};
// controllers/admin.controller.js

// עדכון הרשאות משתמש
export const updateUserRole = async (req, res) => {
  const { userId } = req.params;
  const { isAdmin } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    ).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error updating user role:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update user role." });
  }
};

// מחיקת כרטיס של משתמש
export const deleteUserTicket = async (req, res) => {
  const { userId, ticketId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found." });
    }

    user.tickets = user.tickets.filter(
      (ticket) => ticket._id.toString() !== ticketId
    );
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Ticket deleted successfully." });
  } catch (error) {
    console.error("Error deleting ticket:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to delete ticket." });
  }
};

export const updateCancellationRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value. Use 'approved' or 'rejected'.",
      });
    }

    const request = await CancellationRequest.findById(requestId);

    if (!request) {
      console.error(`Cancellation request with ID ${requestId} not found.`);
      return res
        .status(404)
        .json({ success: false, message: "Cancellation request not found." });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        success: false,
        message: "This request has already been processed.",
      });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const user = await User.findById(request.user);
      if (!user) {
        console.error(`User with ID ${request.user} not found.`);
        return res
          .status(404)
          .json({ success: false, message: "User not found." });
      }

      const ticketExists = user.tickets.some(
        (ticket) => ticket._id.toString() === request.ticket.toString()
      );

      if (!ticketExists) {
        return res.status(400).json({
          success: false,
          message: "Ticket does not exist in the user's account.",
        });
      }

      user.tickets = user.tickets.filter(
        (ticket) => ticket._id.toString() !== request.ticket.toString()
      );
      await user.save();
    }

    res.status(200).json({
      success: true,
      request,
      message: `Cancellation request ${status} processed successfully.`,
    });
  } catch (error) {
    console.error("Error updating cancellation request status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update request status." });
  }
};
