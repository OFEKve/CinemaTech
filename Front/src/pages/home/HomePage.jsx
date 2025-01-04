import React from "react"
import HomeScreen from "./HomeScreen"
import Authscreen from "./Authscreen"
import { useAuthStore } from "../../store/authUser"
const HomePage = () => {
  const { user } = useAuthStore()
  return <div>{user ? <HomeScreen /> : <Authscreen />}</div>
}
export default HomePage
