import { FaSpinner } from "react-icons/fa" // ייבוא Spinner מ-react-icons

const WatchPageSkeleton = () => {
  return (
    <div className="relative">
      {/* Spinner מרכזי */}
      <div className="absolute inset-0 flex items-center justify-center">
        <FaSpinner
          style={{ fontSize: "100px" }}
          className="animate-spin text-white"
        />
      </div>

      {/* אנימציית Skeleton */}
      <div className="animate-pulse">
        <div className="shimmer mb-4 h-6 w-40 rounded-md bg-gray-700"></div>
        <div className="shimmer mb-4 h-96 w-full rounded-md bg-gray-700"></div>
        <div className="shimmer mb-2 h-6 w-3/4 rounded-md bg-gray-700"></div>
        <div className="shimmer mb-4 h-6 w-1/2 rounded-md bg-gray-700"></div>
        <div className="shimmer h-24 w-full rounded-md bg-gray-700"></div>
      </div>
    </div>
  )
}

export default WatchPageSkeleton
