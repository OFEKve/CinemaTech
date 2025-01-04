import Hall from "../models/halls.model.js";
import Seat from "../models/seat.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

async function findAvailableHallNumber(timeSlot, availableHalls) {
  await Hall.deleteMany({});

  console.log(
    `Attempting to find an available hall for time slot: ${timeSlot}`
  );

  for (const hallNumber of availableHalls) {
    // בדוק אם אולם תפוס
    const existingHall = await Hall.findOne({ timeSlot, hallNumber });

    if (!existingHall) {
      console.log(`Hall ${hallNumber} is available.`);
      return hallNumber; // החזר את מספר האולם הפנוי
    } else {
      console.log(`Hall ${hallNumber} is already assigned.`);
    }
  }

  console.log("No available halls found.");
  return null; // אם כל האולמות תפוסים, החזר null
}

export async function reserveSeats(req, res) {
  try {
    const { movieId, seats, timeSlot, date } = req.body;

    if (!movieId || !seats || !timeSlot || !date) {
      return res.status(400).json({
        success: false,
        message: "Movie ID, seats, time slot, and date are required.",
      });
    }

    // חיפוש אולם קיים
    let hall = await Hall.findOne({ movieId, timeSlot });

    if (!hall) {
      console.log("No hall found. Attempting to assign a new hall.");

      // טווח אולמות: 1-10
      const availableHalls = Array.from({ length: 10 }, (_, i) => i + 1);

      // ניסיון למצוא אולם פנוי
      const assignedHallNumber = await findAvailableHallNumber(
        timeSlot,
        availableHalls
      );

      if (!assignedHallNumber) {
        console.log("No available halls to assign.");
        return res.status(400).json({
          success: false,
          message: "No available halls to assign.",
        });
      }

      // יצירת אולם חדש
      hall = await Hall.create({
        movieId,
        timeSlot,
        hallNumber: assignedHallNumber,
      });
      console.log(`Assigned new hall: ${assignedHallNumber}`);
    }

    // בדוק מושבים תפוסים
    const existingSeats = await Seat.find({
      movieId,
      timeSlot,
      date,
      hallNumber: hall.hallNumber,
      seatNumber: { $in: seats },
    });

    if (existingSeats.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Some seats are already reserved.",
        reservedSeats: existingSeats.map((seat) => seat.seatNumber),
      });
    }

    // שמירת מושבים חדשים
    const newSeats = seats.map((seat) => ({
      movieId,
      seatNumber: seat,
      timeSlot,
      date,
      hallNumber: hall.hallNumber,
    }));

    await Seat.insertMany(newSeats);

    res.status(201).json({
      success: true,
      message: `Seats reserved successfully in hall ${hall.hallNumber}!`,
      hallNumber: hall.hallNumber,
      reservedSeats: newSeats.map((seat) => seat.seatNumber),
    });
  } catch (error) {
    console.error("Error in reserveSeats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function getReservedSeats(req, res) {
  const { movieId } = req.params;
  const { timeSlot, date } = req.query;

  if (!movieId || !timeSlot || !date) {
    return res.status(400).json({
      success: false,
      message: "Movie ID, time slot, and date are required.",
    });
  }

  try {
    const movieDetails = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
    );

    if (!movieDetails) {
      return res.status(404).json({
        success: false,
        message: "Movie not found in TMDB.",
      });
    }

    let hall = await Hall.findOne({ movieId, timeSlot });
    if (!hall) {
      const availableHalls = [1, 2, 3, 4, 5, 6, 7, 8, 9]; // אולמות פנויים
      const assignedHallNumber = await findAvailableHallNumber(
        timeSlot,
        availableHalls
      );

      if (!assignedHallNumber) {
        console.error("No available halls to assign.");
        return res.status(400).json({
          success: false,
          message: "No available halls to assign.",
        });
      }

      hall = await Hall.create({
        movieId,
        timeSlot,
        hallNumber: assignedHallNumber,
      });

      console.log(
        `Assigned hall number ${assignedHallNumber} to movie ${movieId}`
      );
    }

    const reservedSeats = await Seat.find({
      movieId,
      timeSlot,
      date,
      hallNumber: hall.hallNumber,
    });

    res.status(200).json({
      success: true,
      movie: {
        title: movieDetails.title,
        overview: movieDetails.overview,
      },
      hallNumber: hall.hallNumber,
      reservedSeats: reservedSeats.map((seat) => seat.seatNumber),
    });
  } catch (error) {
    console.error("Error in getReservedSeats:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

// קבלת פרטי סרט
export async function getMovieDetails(req, res) {
  const { movieId } = req.params;

  if (!movieId) {
    return res.status(400).json({
      success: false,
      message: "Movie ID is required.",
    });
  }

  try {
    const movieDetails = await fetchFromTMDB(
      `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`
    );

    res.status(200).json({
      success: true,
      movie: movieDetails,
    });
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return res.status(404).json({
        success: false,
        message: "Movie not found.",
      });
    }
    res.status(500).json({
      success: false,
      message: "Failed to fetch movie details.",
    });
  }
}

// ביטול הזמנת מושבים
export async function cancelReservedSeats(req, res) {
  const { movieId, seats } = req.body;

  if (!movieId || !seats || seats.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Movie ID and seats are required.",
    });
  }

  try {
    const result = await Seat.deleteMany({
      movieId,
      seatNumber: { $in: seats },
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: "No seats found to cancel.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Seats canceled successfully.",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}
