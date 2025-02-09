import { FiLoader } from "react-icons/fi"

const Loading = () => {
  return (
 
    <div className="flex items-center justify-center h-screen w-screen fixed overflow-hidden bg-gray-deep">
      <div className="flex flex-col items-center">
        <FiLoader className="text-5xl text-blue animate-spin" />
        <p className="mt-4 text-lg text-blue-light">Loading...</p>
      </div>
    </div>
  )
}

export default Loading