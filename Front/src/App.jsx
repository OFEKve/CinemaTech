import React, { useEffect } from "react"
import { useAuthStore } from "./store/authUser"
import CustomToastContainer from "./toast"
import Footer from "./components/Footer"
import { useLocation } from "react-router-dom"
import RoutesConfig from "./RoutesConfig"

const App = () => {
  const { authCheck } = useAuthStore()
  const location = useLocation()

  useEffect(() => {
    authCheck()
  }, [authCheck])

  const hideFooterPaths = ["/seat/:movieId", "/tickets", "/admin"]
  const shouldShowFooter = !hideFooterPaths.some((path) =>
    location.pathname.startsWith(path.replace(":movieId", ""))
  )

  return (
    <>
      <RoutesConfig />
      {shouldShowFooter && <Footer />}
      <CustomToastContainer />
    </>
  )
}

export default App
