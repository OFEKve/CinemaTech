// controllers/admin.controller.js
import { User } from "../models/user.model.js";
import { CancellationRequest } from "../models/cancellationRequest.model.js";
import QRCode from "qrcode";

// Add ticket to user
export const addTicketToUser = async (req, res) => {
  try {
    const { username, ticket } = req.body;

    if (!username || !ticket) {
      return res
        .status(400)
        .json({ message: "Missing username or ticket data" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      !ticket.movieName ||
      !ticket.selectedSeats ||
      !ticket.date ||
      !ticket.movieImage ||
      !ticket.selectedTimeSlot ||
      !ticket.hallNumber
    ) {
      return res.status(400).json({ message: "Invalid ticket data" });
    }

    const qrData = {
      movieName: ticket.movieName,
      selectedSeats: ticket.selectedSeats,
      date: ticket.date,
      movieImage: ticket.movieImage,
      selectedTimeSlot: ticket.selectedTimeSlot,
      hallNumber: ticket.hallNumber,
    };

    const qrImage = await QRCode.toDataURL(JSON.stringify(qrData));

    user.tickets.push({
      ...ticket,
      date: new Date(ticket.date),
      qrData,
      qrImage,
    });

    await user.save();

    res
      .status(200)
      .json({ message: "Ticket saved successfully", tickets: user.tickets });
  } catch (error) {
    console.error("Error saving ticket:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user tickets
export const getUserTickets = async (req, res) => {
  const { username } = req.params;

  if (!username) {
    return res.status(400).json({ message: "Username is required" });
  }

  try {
    const user = await User.findOne({ username }).select("tickets");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ tickets: user.tickets });
  } catch (error) {
    console.error("Error fetching tickets:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Submit cancellation request
export const submitCancellationRequest = async (req, res) => {
  const { ticketId } = req.params;
  const { reason } = req.body;
  const userId = req.user._id;

  if (!ticketId || !reason) {
    return res
      .status(400)
      .json({ message: "Ticket ID and cancellation reason are required" });
  }

  try {
    const user = await User.findById(userId).select("tickets");
    const ticket = user.tickets.find(
      (t) => t._id.toString() === ticketId.toString()
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    const existingRequest = await CancellationRequest.findOne({
      ticket: ticketId,
      user: userId,
    });

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: "Cancellation request already exists" });
    }

    const newRequest = new CancellationRequest({
      user: userId,
      ticket: ticketId,
      reason,
      status: "pending",
    });

    await newRequest.save();

    res.status(201).json({
      message: "Cancellation request submitted successfully",
      request: newRequest,
    });
  } catch (error) {
    console.error("Error submitting cancellation request:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get user cancellation requests
export const getUserCancellationRequests = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const requests = await CancellationRequest.find({ user: user._id });
    res.status(200).json({ requests });
  } catch (error) {
    console.error("Error fetching cancellation requests:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all cancellation requests (Admin)
export const getAllCancellationRequests = async (req, res) => {
  try {
    const requests = await CancellationRequest.find()
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

// Update cancellation request status (Admin)
export const updateCancellationRequestStatus = async (req, res) => {
  const { requestId } = req.params;
  const { status } = req.body;

  try {
    const request = await CancellationRequest.findById(requestId);

    if (!request) {
      return res
        .status(404)
        .json({ success: false, message: "Cancellation request not found." });
    }

    request.status = status;
    await request.save();

    if (status === "approved") {
      const user = await User.findById(request.user);
      if (user) {
        user.tickets = user.tickets.filter(
          (ticket) => ticket._id.toString() !== request.ticket.toString()
        );
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      request,
      message: `Cancellation request ${status} successfully.`,
    });
  } catch (error) {
    console.error("Error updating cancellation request status:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to update request status." });
  }
};
