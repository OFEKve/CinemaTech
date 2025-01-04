import React from "react"
import { Routes, Route } from "react-router-dom"
import AdminUsers from "./AdminUsers"
import AdminSettings from "./AdminSettings"
import Sidebar from "./Sidebar"
import AdminCancellationRequests from "./AdminCancellationRequests"
import styled from "styled-components"
import { FaHome } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
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

const AdminDash = () => {
  const navigate = useNavigate()

  return (
    <DashboardContainer>
      <Sidebar />

      <ContentContainer>
        <Header>
          <IconButton onClick={() => navigate("/")} title="Go to Home Page">
            <FaHome />
          </IconButton>
          <h1>Admin Dashboard</h1>
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
