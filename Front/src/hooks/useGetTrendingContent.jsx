import { useEffect, useState } from "react"
import { useContentStore } from "../store/content"
import axios from "axios"

const useGetTrendingContent = () => {
  const [trendingContent, setTrendingContent] = useState(null)
  const { contentType } = useContentStore()

  useEffect(() => {
    const getTrendingContent = async () => {
      const res = await axios.get(
        `https://cinematech-1.onrender.com/api/v1/${contentType}/trending`,
        {
          withCredentials: true,
        }
      )
      setTrendingContent(res.data.content)
    }

    getTrendingContent()
  }, [contentType])

  return { trendingContent }
}
export default useGetTrendingContent
