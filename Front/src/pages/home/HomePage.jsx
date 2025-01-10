import HomeScreen from "@/pages/home/HomeScreen"
import AuthScreen from "@/pages/home/AuthScreen"
import { useAuthStore } from "@/store/authUser"

const HomePage = () => {
  const { user } = useAuthStore()
  return <div>{user ? <HomeScreen /> : <AuthScreen />}</div>
}
export default HomePage
