import React from "react"
import { Navigate, Route, Routes } from "react-router-dom"
import SignUpPage from "./pages/Registration/SignUpPage"
import LoginPage from "./pages/Registration/LoginPage"
import HomePage from "./pages/home/HomePage"
import WatchPage from "./pages/Registration/WatchPage"
import SeatPlan from "./components/Components/SeatPlan"
import Ticket from "./pages/home/Ticket"
import AdminDash from "./pages/admin/AdminDesh"
import AdminUsers from "./pages/admin/AdminUsers"
import AdminSettings from "./pages/admin/AdminSettings"
import AdminTickets from "./pages/admin/AdminTicket"
import SearchPage from "./pages/Registration/SearchPage"
import AdminCancellationRequests from "./pages/admin/AdminCancellationRequests"
import Forgetpass from "./pages/Registration/Forgetpass"
import Reset_Password from "./pages/Registration/Reset_Password"
import { useAuthStore } from "./store/authUser"
import NotFoundPage from "./pages/404"
const RoutesConfig = () => {
  const { user } = useAuthStore()

  return (
    <Routes>
      <Route
        path="/search"
        element={user ? <SearchPage /> : <Navigate to={"/login"} />}
      />
      <Route path="/" element={<HomePage />} />
      <Route path="/tickets" element={<Ticket user={user} />} />
      <Route
        path="/signup"
        element={!user ? <SignUpPage /> : <Navigate to={"/"} />}
      />
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to={"/"} />}
      />
      <Route
        path="/forgetpassword"
        element={!user ? <Forgetpass /> : <Navigate to={"/"} />}
      />
      <Route path="/reset-password" element={<Reset_Password />} />
      <Route
        path="/watch/:id"
        element={user ? <WatchPage /> : <Navigate to={"/login"} />}
      />
      <Route path="/admin/dashboard" element={<AdminDash />} />
      <Route path="/admin/users" element={<AdminUsers />} />
      <Route path="/admin/settings" element={<AdminSettings />} />
      <Route path="/admin/tickets" element={<AdminTickets />} />
      <Route
        path="/admin/cancellation-requests"
        element={<AdminCancellationRequests />}
      />
      <Route path="/*" element={<NotFoundPage />} />

      <Route path="/seat/:movieId" element={<SeatPlan username={user} />} />
    </Routes>
  )
}

export default RoutesConfig
