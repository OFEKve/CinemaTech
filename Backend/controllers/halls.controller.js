import Hall from "../models/halls.model.js";

// פונקציה להקצאת אולם
export async function assignHall(req, res) {
  try {
    const { movieId, timeSlot, hallNumber } = req.body;

    if (!movieId || !timeSlot || !hallNumber) {
      return res.status(400).json({
        success: false,
        message: "Movie ID, time slot, and hall number are required.",
      });
    }

    // בדיקה אם כבר יש הקצאה לסרט והשעה
    const existingHall = await Hall.findOne({ movieId, timeSlot });
    if (existingHall) {
      return res.status(400).json({
        success: false,
        message: "Hall already assigned for this movie and time slot.",
        hall: existingHall,
      });
    }

    // יצירת הקצאה חדשה
    const newHall = await Hall.create({ movieId, timeSlot, hallNumber });

    res.status(201).json({
      success: true,
      message: "Hall assigned successfully.",
      hall: newHall,
    });
  } catch (error) {
    console.error("Error in assignHall:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

export async function getHallForMovie(req, res) {
  try {
    const { movieId } = req.params;
    const { timeSlot } = req.query;

    if (!movieId || !timeSlot) {
      return res.status(400).json({
        success: false,
        message: "Movie ID and time slot are required.",
      });
    }

    // נסה למצוא אולם קיים
    let hall = await Hall.findOne({ movieId, timeSlot });

    if (!hall) {
      // אם אין אולם, הקצה אולם חדש מתוך רשימת האולמות הזמינים
      const availableHalls = [1, 2, 3, 4, 5, 6, 7, 8, 9];
      const assignedHallNumber = await findAvailableHallNumber(
        timeSlot,
        availableHalls
      );

      if (!assignedHallNumber) {
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
    }

    res.status(200).json({
      success: true,
      hall,
    });
  } catch (error) {
    console.error("Error in getHallForMovie:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}

// פונקציה למציאת מספר אולם פנוי
async function findAvailableHallNumber(timeSlot, availableHalls) {
  for (const hallNumber of availableHalls) {
    const existingHall = await Hall.findOne({ timeSlot, hallNumber });
    if (!existingHall) {
      return hallNumber;
    }
  }
  return null; // אם אין אולמות פנויים
}

// פונקציה לשליפת כל האולמות
export async function getAllHalls(req, res) {
  try {
    const halls = await Hall.find({});
    res.status(200).json({
      success: true,
      halls,
    });
  } catch (error) {
    console.error("Error in getAllHalls:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error.",
    });
  }
}
