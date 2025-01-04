import { Link } from "react-router-dom"
import Navbar from "../../components/Navbar"
import { TicketCheck } from "lucide-react"
import useGetTrendingContent from "../../hooks/useGetTrendingContent"
import {
  MOVIE_CATEGORIES,
  ORIGINAL_IMG_BASE_URL,
  TV_CATEGORIES,
} from "../../utils/constants"
import { useContentStore } from "../../store/content"
import MovieSlider from "../../components/MovieSlider"
import { useState } from "react"
import toast from "react-hot-toast"
import axios from "axios"

const HomeScreen = () => {
  const { trendingContent } = useGetTrendingContent()
  const { contentType } = useContentStore()
  const [imgLoading, setImgLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.")
      return
    }
    setIsSearching(true)
    try {
      const res = await axios.get(
        `http://localhost:3000/api/v1/search/movie/${searchTerm}`,
        { withCredentials: true }
      )
      setSearchResults(res.data.content)
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("No results found for your query.")
      } else {
        toast.error("An error occurred. Please try again later.")
      }
    }
  }

  if (!trendingContent) {
    return (
      <div className="relative h-screen text-white">
        <Navbar />
        <div className="shimmer absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center bg-black/70" />
      </div>
    )
  }

  return (
    <>
      <div className="relative h-screen text-white">
        <div className="w-full bg-black">
          <Navbar />
        </div>

        {imgLoading && (
          <div className="shimmer absolute left-0 top-0 -z-10 flex h-full w-full items-center justify-center bg-black/70" />
        )}

        {trendingContent?.backdrop_path && (
          <img
            src={ORIGINAL_IMG_BASE_URL + trendingContent?.backdrop_path}
            alt="Hero img"
            className="absolute left-0 top-0 -z-50 h-full w-full object-cover"
            onLoad={() => {
              setImgLoading(false)
            }}
          />
        )}

        <div
          className="absolute left-0 top-0 -z-50 h-full w-full bg-black/50"
          aria-hidden="true"
        />

        <div className="absolute left-0 top-0 flex h-full w-full flex-col justify-center px-8 md:px-16 lg:px-32">
          <div className="absolute left-0 top-0 -z-10 h-full w-full bg-gradient-to-b from-black via-transparent to-transparent" />

          <div className="max-w-2xl">
            <h1 className="title-mov mb-4 mt-12 text-5xl font-bold text-slate-400">
              Movie of the Moment:
            </h1>
            <h1 className="mt-4 text-balance text-6xl font-extrabold">
              {trendingContent?.title || trendingContent?.name}
            </h1>
            <p className="mt-2 text-lg">
              {trendingContent?.release_date?.split("-")[0] ||
                trendingContent?.first_air_date?.split("-")[0]}{" "}
              | {trendingContent?.adult ? "18+" : "PG-13"}
            </p>

            <p className="mt-4 text-lg">
              {trendingContent?.overview.length > 200
                ? trendingContent?.overview.slice(0, 200) + "..."
                : trendingContent?.overview}
            </p>
          </div>

          <div className="mt-8 flex">
            <Link
              to={`/watch/${trendingContent?.id}`}
              className="mr-4 flex items-center rounded bg-white px-4 py-2 font-bold text-black hover:bg-white/80"
            >
              <TicketCheck className="mr-2 size-6 fill-black" />
              Book tickets
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-10 bg-black py-10">
        {isSearching ? (
          searchResults.length ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {searchResults.map(
                (result) =>
                  result.poster_path && (
                    <div key={result.id} className="rounded bg-gray-800 p-4">
                      <Link to={`/watch/${result.id}`}>
                        <img
                          src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                          alt={result.title || result.name}
                          className="h-auto w-full rounded"
                        />
                        <h2 className="mt-2 text-xl font-bold">
                          {result.title || result.name}
                        </h2>
                      </Link>
                    </div>
                  )
              )}
            </div>
          ) : (
            <p className="text-center text-white">No results found.</p>
          )
        ) : contentType === "movie" ? (
          MOVIE_CATEGORIES.map((category) => (
            <MovieSlider key={category} category={category} />
          ))
        ) : (
          TV_CATEGORIES.map((category) => (
            <MovieSlider key={category} category={category} />
          ))
        )}
      </div>
    </>
  )
}

export default HomeScreen
