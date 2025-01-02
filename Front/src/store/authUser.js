import axios from "axios"
import { toast } from "react-toastify"
import { create } from "zustand"

export const useAuthStore = create((set) => ({
  user: null,
  isSigningUp: false,
  isCheckingAuth: true,
  isLoggingOut: false,
  isLoggingIn: false,
  isSubmittingForgetPassword: false,
  signup: async (credentials) => {
    set({ isSigningUp: true })
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/signup",
        credentials,
        {
          withCredentials: true,
        }
      )
      set({ user: response.data.user, isSigningUp: false })
      toast.success("Account created successfully")
    } catch (error) {
      toast.error(error.response.data.message || "Signup failed")
      set({ isSigningUp: false, user: null })
    }
  },
  login: async (credentials) => {
    set({ isLoggingIn: true })
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/login",
        credentials,
        {
          withCredentials: true,
        }
      )
      set({ user: response.data.user, isLoggingIn: false })
    } catch (error) {
      set({ isLoggingIn: false, user: null })
      toast.error(error.response.data.message || "Login failed")
    }
  },
  logout: async () => {
    set({ isLoggingOut: true })
    try {
      await axios.post("http://localhost:3000/api/v1/auth/logout", {
        createntials: true,
      })
      set({ user: null, isLoggingOut: false })
      toast.success("Logged out successfully")
    } catch (error) {
      set({ isLoggingOut: false })
      toast.error(error.response.data.message || "Logout failed")
    }
  },
  authCheck: async () => {
    set({ isCheckingAuth: true })
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/auth/authCheck",
        {
          withCredentials: true,
        }
      )

      set({ user: response.data.user, isCheckingAuth: false })
    } catch (error) {
      set({ isCheckingAuth: false, user: null })
      // toast.error(error.response.data.message || "An error occurred");
    }
  },
  requestPasswordReset: async (email) => {
    set({ isSubmittingForgetPassword: true })
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/auth/request-password-reset",
        { email },
        {
          withCredentials: true,
        }
      )
      toast.success(
        response.data.message || "Password reset link sent successfully"
      )
    } catch (error) {
      set({ isSubmittingForgetPassword: false })
      toast.error(
        error.response?.data?.message || "Failed to send password reset link"
      )
    } finally {
      set({ isSubmittingForgetPassword: false })
    }
  },
}))
