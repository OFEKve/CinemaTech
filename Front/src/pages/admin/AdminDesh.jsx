import { useState, useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import { FaHome, FaBell } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
import styled from "styled-components"
import AdminUsers from "./AdminUsers"
import AdminSettings from "./AdminSettings"
import Sidebar from "./SideBar"
import AdminCancellationRequests from "./AdminCancellationRequests"
const DashboardContainer = styled.div`
  display: flex;
  height: 100vh;
  background-color: #f5f6fa;
`

const ContentContainer = styled.div`
  flex: 1;
  margin-left: 250px; /* מתאים לרוחב ה-sidebar */
  padding: 20px;
  background: #ecf0f1;
  overflow-y: auto;
`

const Header = styled.header`
  background: #2c3e50;
  color: white;
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`
const IconButton = styled.div`
  width: 60px;
  height: 60px;
  background-color: #1abc9c;
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition:
    transform 0.3s,
    background-color 0.3s;

  &:hover {
    transform: scale(1.2);
    background-color: #16a085;
  }

  svg {
    width: 30px;
    height: 30px;
    stroke: white;
  }
`

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
`

const NotificationsPanel = styled.div`
  position: absolute;
  top: 60px;
  right: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;
  display: ${(props) => (props.isVisible ? "block" : "none")};
`
const BellIcon = styled(FaBell)`
  font-size: 24px;
  color: white;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.1);
  }
`

const NotificationCount = styled.span`
  position: absolute;
  top: -8px;
  right: -8px;
  background-color: #e74c3c;
  color: white;
  border-radius: 50%;
  padding: 2px 6px;
  font-size: 12px;
  min-width: 18px;
  text-align: center;
  animation: pulse 1.5s infinite;

  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
    }
  }
`
const NotificationBell = styled.div`
  position: relative;
  cursor: pointer;
  margin-left: 20px;
  display: inline-block;
`
const NotificationItem = styled.div`
  padding: 12px;
  border-bottom: 1px solid #eee;

  .reason {
    color: #666;
    font-style: italic;
    margin-top: 5px;
    font-size: 0.9em;
  }

  .date {
    color: #999;
    font-size: 0.8em;
    margin-top: 3px;
  }
`
const AdminDash = () => {
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([]) // אתחול כמערך ריק
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkForNewRequests = async () => {
      try {
        const response = await fetch(
          "https://cinematech-1.onrender.com/api/v1/admin/cancellation-requests/unread",
          { credentials: "include" }
        )
        if (!response.ok) {
          throw new Error("Network response was not ok")
        }
        const data = await response.json()
        setNotifications(data.requests || [])
        setUnreadCount(data.requests?.length || 0)
      } catch (error) {
        console.error("Error fetching notifications:", error)
        setNotifications([])
        setUnreadCount(0)
      } finally {
        setIsLoading(false)
      }
    }

    checkForNewRequests()
    const interval = setInterval(checkForNewRequests, 30000)

    return () => clearInterval(interval)
  }, [])

  const handleNotificationClick = () => {
    // שינוי מצב הצגת ההתראות בלבד
    setShowNotifications(!showNotifications)
  }

  return (
    <DashboardContainer>
      <Sidebar />
      <ContentContainer>
        <Header>
          <HeaderContent>
            <IconButton onClick={() => navigate("/")} title="Go to Home Page">
              <FaHome />
            </IconButton>
            <h1>Admin Dashboard</h1>
            <NotificationBell onClick={handleNotificationClick}>
              <BellIcon />
              {!isLoading && unreadCount > 0 && (
                <NotificationCount>{unreadCount}</NotificationCount>
              )}
              <NotificationsPanel isVisible={showNotifications}>
                {isLoading ? (
                  <NotificationItem>Loading...</NotificationItem>
                ) : notifications.length > 0 ? (
                  notifications.map((notification, index) => (
                    <NotificationItem key={index}>
                      <strong>{notification.username}</strong> requested
                      cancellation
                      <div className="reason">
                        Reason: {notification.reason}
                      </div>
                      <div className="date">
                        <br />
                        Requested on: {notification.requestDate}
                      </div>
                    </NotificationItem>
                  ))
                ) : (
                  <NotificationItem>
                    No new cancellation requests
                  </NotificationItem>
                )}
              </NotificationsPanel>
            </NotificationBell>
          </HeaderContent>
          <p>Welcome, Admin! Manage your site here.</p>
        </Header>

        <Routes>
          <Route path="/users" element={<AdminUsers />} />
          <Route path="/settings" element={<AdminSettings />} />
          <Route
            path="/cancellation-requests"
            element={<AdminCancellationRequests />}
          />
        </Routes>
      </ContentContainer>
    </DashboardContainer>
  )
}

export default AdminDash
