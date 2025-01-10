import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaTrashAlt, FaUserEdit, FaHome, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"

const Container = styled.div`
  background: linear-gradient(to bottom, #2c3e50, #34495e);
  min-height: 100vh;
  padding: 20px;
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: "Roboto", sans-serif;
`

const Header = styled.div`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`

const HeaderIcons = styled.div`
  display: flex;
  gap: 20px;
  position: absolute;
  top: 20px;
  left: 20px;
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
  transition: transform 0.3s;

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

const Title = styled.h1`
  color: #fff;
  font-size: 36px;
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  text-align: center;
  text-transform: uppercase;
  margin-bottom: 20px;
`

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #1e1e2f;
  padding: 8px 12px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

  input {
    background: none;
    border: none;
    outline: none;
    color: #fff;
    font-size: 16px;
    flex: 1;
    margin-left: 10px;
  }

  svg {
    color: #1abc9c;
  }
`

const TableContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  background-color: #1e1e2f;
`

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th,
  td {
    padding: 15px;
    text-align: left;
  }

  th {
    background: #16a085;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
  }

  tr:nth-child(even) {
    background-color: #2a2a3d;
  }

  tr:hover {
    background-color: #34495e;
  }

  td {
    border-bottom: 1px solid #2a2a3d;
    color: #ddd;
  }
`

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
`

const StyledButton = styled.button`
  background-color: ${({ color }) => color || "#1abc9c"};
  color: white;
  border: none;
  border-radius: 10px;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition:
    background-color 0.3s,
    transform 0.3s;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#16a085"};
    transform: scale(1.05);
  }
`

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "https://cinematech-1.onrender.com/api/v1/admin/users",
          {
            credentials: "include",
          }
        )
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users)
          setFilteredUsers(data.users)
        } else {
          toast.error(data.message || "Failed to fetch users.")
        }
      } catch (error) {
        toast.error("Server error.")
      }
    }

    fetchUsers()
  }, [])

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase()
    setSearchQuery(query)
    setFilteredUsers(
      users.filter(
        (user) =>
          user.username.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.includes(query))
      )
    )
  }

  const handleDeleteUser = async (userId) => {
    try {
      const response = await fetch(
        `https://cinematech-1.onrender.com/api/v1/admin/users/${userId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      if (response.ok) {
        toast.success("User deleted successfully.")
        setFilteredUsers(filteredUsers.filter((user) => user._id !== userId))
      } else {
        toast.error("Failed to delete user.")
      }
    } catch (error) {
      toast.error("Server error.")
    }
  }

  const handleUpdateRole = async (userId, isAdmin) => {
    try {
      const response = await fetch(
        `https://cinematech-1.onrender.com/api/v1/admin/users/${userId}/role`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ isAdmin }),
        }
      )
      if (response.ok) {
        toast.success("User role updated.")
        setFilteredUsers(
          filteredUsers.map((user) =>
            user._id === userId ? { ...user, isAdmin } : user
          )
        )
      } else {
        toast.error("Failed to update role.")
      }
    } catch (error) {
      toast.error("Server error.")
    }
  }

  return (
    <Container>
      <HeaderIcons>
        <IconButton onClick={() => navigate("/")} title="Go to Home">
          <FaHome />
        </IconButton>
        <IconButton
          onClick={() => navigate("/admin/dashboard")}
          title="Go to Admin Panel"
        >
          <FaUserEdit />
        </IconButton>
      </HeaderIcons>
      <Header>
        <Title>User Management</Title>
        <SearchBar>
          <FaSearch />
          <input
            type="text"
            placeholder="Search by username or email..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </SearchBar>
      </Header>
      <TableContainer>
        <UserTable>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>{user.username}</td>
                <td>{user.email}</td>
                <td>{user.isAdmin ? "Admin" : "User"}</td>
                <td>{user.phone || "N/A"}</td>
                <td>
                  <ActionButtons>
                    <StyledButton
                      color={user.isAdmin ? "#ff4d4d" : "#4caf50"}
                      hoverColor={user.isAdmin ? "#e60000" : "#45a049"}
                      onClick={() => handleUpdateRole(user._id, !user.isAdmin)}
                    >
                      <FaUserEdit />
                      {user.isAdmin ? "Make User" : "Make Admin"}
                    </StyledButton>
                    <StyledButton
                      color="#ff4d4d"
                      hoverColor="#e60000"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      <FaTrashAlt />
                      Delete
                    </StyledButton>
                  </ActionButtons>
                </td>
              </tr>
            ))}
          </tbody>
        </UserTable>
      </TableContainer>
    </Container>
  )
}

export default AdminUsers
