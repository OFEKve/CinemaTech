import axios from "axios";

export async function fetchFromTMDB(url) {
  const options = {
    headers: {
      accept: "application/json",
      Authorization: "Bearer " + process.env.TMDB_API,
    },
  };
  const response = await axios.get(url, options);
  if (response.status !== 200) {
    throw new Error("Failed to fetch data from TMDB");
  }
  return response.data;
}
