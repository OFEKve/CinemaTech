import React from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { Users, Settings, Ticket, Clipboard } from "lucide-react" // אייקונים מ-lucide-react

const SidebarContainer = styled.div`
  width: 250px;
  background: linear-gradient(135deg, #34495e, #2c3e50);
  color: white;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  position: fixed;
  height: 100%;
`

const SidebarTitle = styled.h2`
  font-size: 24px;
  color: #ecf0f1;
  margin-bottom: 30px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
`

const SidebarItem = styled(Link)`
  text-decoration: none;
  color: white;
  padding: 12px 20px;
  margin: 8px 0;
  border-radius: 5px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 16px;
  transition:
    background-color 0.3s,
    transform 0.2s;

  &:hover {
    background-color: #1abc9c;
    transform: scale(1.05);
  }
`

const SidebarFooter = styled.div`
  margin-top: auto;
  font-size: 14px;
  color: #95a5a6;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #7f8c8d;
`

const Sidebar = () => {
  return (
    <SidebarContainer>
      <SidebarTitle>Admin Panel</SidebarTitle>
      <SidebarItem to="/admin/users">
        <Users size={20} /> Manage Users
      </SidebarItem>
      {/* <SidebarItem to="/admin/settings">
        <Settings size={20} /> Settings
      </SidebarItem> */}
      <SidebarItem to="/admin/tickets">
        <Ticket size={20} /> Manage Tickets
      </SidebarItem>
      <SidebarItem to="/admin/cancellation-requests">
        <Clipboard size={20} /> Cancellation Requests
      </SidebarItem>
      <SidebarFooter>© Ofek Vegas & Shmuel Zimmer , 2024</SidebarFooter>
    </SidebarContainer>
  )
}

export default Sidebar
