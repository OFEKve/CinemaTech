import { User } from "../models/user.model.js";
import { fetchFromTMDB } from "../services/tmdb.service.js";

export async function searchMovie(req, res) {
  const { searchTerm } = req.params;

  if (!searchTerm) {
    return res
      .status(400)
      .json({ success: false, message: "Search term is required" });
  }

  try {
    const encodedSearchTerm = encodeURIComponent(searchTerm); // קידוד הפרמטר
    const response = await fetchFromTMDB(
      `https://api.themoviedb.org/3/search/movie?query=${encodedSearchTerm}&include_adult=false&language=en-US&page=1`
    );

    if (!response.results || response.results.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No results found" });
    }

    res.status(200).json({ success: true, content: response.results });
  } catch (error) {
    console.error("Error in searchMovie controller:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
