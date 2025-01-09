import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { FaTrashAlt, FaUserEdit, FaHome, FaSearch } from "react-icons/fa"
import { useNavigate } from "react-router-dom"
const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: #1e1e2f;
  padding: 8px 12px;
  border-radius: 10px;
  width: 300px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;

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

const HeaderContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
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

const Header = styled.h1`
  color: #fff;
  font-size: 36px;
  font-weight: bold;
  text-shadow: 2px 4px 6px rgba(0, 0, 0, 0.5);
  margin-bottom: 20px;
`

const UserTable = styled.table`
  width: 100%;
  max-width: 1200px;
  border-collapse: collapse;
  background-color: #1e1e2f;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  th,
  td {
    padding: 12px 15px;
    text-align: left;
    vertical-align: top;
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

const TicketContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  justify-content: center;
`

const TicketCard = styled.div`
  width: 150px;
  height: 200px;
  perspective: 1000px;
  margin: 10px;
  transition: transform 0.3s ease;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
  }
`

const CardInner = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.8s;
  transform: ${({ isFlipped }) =>
    isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
`

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background: #16a085;
  color: white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 16px;
  font-weight: bold;
`

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background: #1e1e2f;
  color: white;
  border-radius: 10px;
  padding: 10px;
  font-size: 14px;
`

const DeleteButton = styled.button`
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition:
    background-color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: #e60000;
    transform: scale(1.1);
  }
`

const AdminTicket = () => {
  const [users, setUsers] = useState([])
  const [flippedCards, setFlippedCards] = useState({})
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredUsers, setFilteredUsers] = useState([])
  const [visibleTickets, setVisibleTickets] = useState({}) // שמירת מצב ה-Hide/Show

  const navigate = useNavigate()

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

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/v1/admin/users",
          {
            credentials: "include",
          }
        )
        const data = await response.json()
        if (response.ok) {
          setUsers(data.users)
          setFilteredUsers(data.users) // עדכון filteredUsers
        } else {
          toast.error(data.message || "Failed to fetch users.")
        }
      } catch (error) {
        toast.error("Server error.")
      }
    }

    fetchUsers()
  }, [])

  const handleFlip = (ticketId) => {
    setFlippedCards((prev) => ({
      ...prev,
      [ticketId]: !prev[ticketId],
    }))
  }

  const handleToggleTickets = (userId) => {
    setVisibleTickets((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const handleDeleteTicket = async (userId, ticketId) => {
    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/admin/users/${userId}/tickets/${ticketId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      )
      const data = await response.json()
      if (response.ok) {
        toast.success(data.message)
        setUsers(
          users.map((user) =>
            user._id === userId
              ? {
                  ...user,
                  tickets: user.tickets.filter((t) => t._id !== ticketId),
                }
              : user
          )
        )
      } else {
        toast.error(data.message || "Failed to delete ticket.")
      }
    } catch (error) {
      toast.error("Server error.")
    }
  }

  return (
    <Container>
      <HeaderContainer>
        <IconButton onClick={() => navigate("/")} title="Go to Home Page">
          <FaHome />
        </IconButton>
        <IconButton
          onClick={() => navigate("/admin/dashboard")}
          title="Go to Admin Panel"
        >
          <FaUserEdit />
        </IconButton>
      </HeaderContainer>
      <Header>All Tickets by Users</Header>
      <SearchBar>
        <FaSearch />
        <input
          type="text"
          placeholder="Search by username or email..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </SearchBar>
      <UserTable>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Tickets</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                <button
                  onClick={() => handleToggleTickets(user._id)}
                  style={{
                    marginBottom: "10px",
                    padding: "8px 12px",
                    borderRadius: "5px",
                    backgroundColor: "#1abc9c",
                    color: "#fff",
                    border: "none",
                    cursor: "pointer",
                    fontWeight: "bold",
                  }}
                >
                  {visibleTickets[user._id] ? "Hide Tickets" : "Show Tickets"}
                </button>
                {visibleTickets[user._id] && (
                  <TicketContainer>
                    {user.tickets &&
                      user.tickets.map((ticket) => (
                        <TicketCard
                          key={ticket._id}
                          onMouseEnter={() => handleFlip(ticket._id)}
                          onMouseLeave={() => handleFlip(ticket._id)}
                        >
                          <CardInner isFlipped={flippedCards[ticket._id]}>
                            <CardFront>{ticket.movieName}</CardFront>
                            <CardBack>
                              <p>
                                <strong>Movie:</strong> {ticket.movieName}
                              </p>
                              <p>
                                <strong>Date:</strong>{" "}
                                {ticket.qrData?.date || "N/A"}
                              </p>
                              <p>
                                <strong>Time:</strong>{" "}
                                {ticket.selectedTimeSlot || "N/A"}
                              </p>
                              <p>
                                <strong>Hall:</strong>{" "}
                                {ticket.hallNumber || "N/A"}
                              </p>
                              <DeleteButton
                                onClick={() =>
                                  handleDeleteTicket(user._id, ticket._id)
                                }
                              >
                                <FaTrashAlt /> Delete
                              </DeleteButton>
                            </CardBack>
                          </CardInner>
                        </TicketCard>
                      ))}
                  </TicketContainer>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </UserTable>
    </Container>
  )
}

export default AdminTicket
