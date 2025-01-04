import { useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import axios from "axios"
import { toast } from "react-toastify"

const ResetPassword = () => {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const token = searchParams.get("token")

    if (!token) {
      toast.error("Invalid or missing reset token.")
      return
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.")
      return
    }

    try {
      setIsSubmitting(true)
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/reset-password",
        {
          token,
          newPassword: password,
        },
        {
          withCredentials: true,
        }
      )
      toast.success(response.data.message || "Password reset successful!")
      navigate("/login") // ניתוב מחדש למסך ההתחברות
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reset password.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="hero-bg flex h-screen w-full items-center justify-center">
      <div className="w-full max-w-md space-y-6 rounded-lg bg-black/60 p-8 shadow-md">
        <h1 className="mb-4 text-center text-2xl font-bold text-white">
          Reset Password
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              New Password
            </label>
            <input
              type="password"
              id="password"
              className="mt-1 w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-300"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              className="mt-1 w-full rounded-md border border-gray-700 bg-transparent px-3 py-2 text-white focus:outline-none focus:ring"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-red-600 py-2 font-semibold text-white hover:bg-red-700"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Resetting Password..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
