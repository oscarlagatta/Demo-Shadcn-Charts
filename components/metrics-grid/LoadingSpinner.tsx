import type React from "react"

export const LoadingSpinner: React.FC = () => (
  <div className="relative h-5 w-5">
    <div className="absolute inset-0 animate-spin rounded-full border-2 border-b-amber-500 border-l-red-500 border-r-green-500 border-t-transparent"></div>
    <div className="absolute inset-1 flex items-center justify-center rounded-full bg-white">
      <div className="h-1 w-1 rounded-full bg-gray-700"></div>
    </div>
  </div>
)

export const renderLoadingSpinner = () => {
  return (
    <div className="h-[600px] w-full flex flex-col items-center justify-center">
      <LoadingSpinner />
      <p className="mt-4 text-gray-600 font-medium">Loading metrics data...</p>
    </div>
  )
}
