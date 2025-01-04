import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authUser"
import { toast } from "react-toastify"

const Forgetpass = () => {
  const [email, setEmail] = useState("")
  const { requestPasswordReset, isSubmittingForgetPassword } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }

    try {
      await requestPasswordReset(email)
      setEmail("") // Clear the input field after success
    } catch (error) {
      toast.error(error.message || "Failed to send reset link")
    }
  }

  return (
    <div className="hero-bg h-screen w-full">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <Link to="/">
          <img src="/netflix-logo.png" alt="logo" className="w-52" />
        </Link>
      </header>

      <div className="mx-3 mt-20 flex items-center justify-center">
        <div className="w-full max-w-md space-y-6 rounded-lg bg-black/60 p-8 shadow-md">
          <h1 className="mb-4 text-center text-2xl font-bold text-white">
            Forgot Password
          </h1>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-md bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
              disabled={isSubmittingForgetPassword}
            >
              {isSubmittingForgetPassword ? "Submitting..." : "Send Reset Link"}
            </button>
          </form>
          <div className="text-center text-gray-400">
            Remembered your password?{" "}
            <Link to="/login" className="text-red-500 hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Forgetpass
