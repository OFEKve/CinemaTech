import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"
import { FaUserEdit, FaHome } from "react-icons/fa"

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

const FilterContainer = styled.div`
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
`

const FilterButton = styled.button`
  padding: 10px 20px;
  background-color: ${({ active }) => (active ? "#16a085" : "#34495e")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition:
    background-color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: #1abc9c;
    transform: scale(1.1);
  }
`

const RequestTable = styled.table`
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

const ActionButton = styled.button`
  background-color: ${({ color }) => color || "#4caf50"};
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition:
    background-color 0.3s,
    transform 0.3s;

  &:hover {
    background-color: ${({ hoverColor }) => hoverColor || "#45a049"};
    transform: scale(1.1);
  }
`

const AdminCancellationRequests = () => {
  const [requests, setRequests] = useState([])
  const [statusFilter, setStatusFilter] = useState("pending")
  const navigate = useNavigate()

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `https://cinematech-1.onrender.com/api/v1/admin/cancellation-requests?status=${statusFilter}`,
          { credentials: "include" }
        )
        const data = await response.json()

        if (response.ok) {
          setRequests(data.requests)
        } else {
          toast.error(data.message || "Failed to fetch requests.")
        }
      } catch (error) {
        toast.error("Server error.")
      }
    }

    fetchRequests()
  }, [statusFilter])

  const handleUpdateStatus = async (requestId, status) => {
    try {
      const response = await fetch(
        `https://cinematech-1.onrender.com/api/v1/admin/cancellation-requests/${requestId}/status`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ status }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success(`Request ${status} successfully!`)
        setRequests((prev) => prev.filter((req) => req._id !== requestId))
      } else {
        toast.error(data.message || "Failed to update request.")
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
      <Header>Cancellation Requests</Header>
      <FilterContainer>
        <FilterButton
          active={statusFilter === "pending"}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </FilterButton>
        <FilterButton
          active={statusFilter === "approved"}
          onClick={() => setStatusFilter("approved")}
        >
          Approved
        </FilterButton>
        <FilterButton
          active={statusFilter === "rejected"}
          onClick={() => setStatusFilter("rejected")}
        >
          Rejected
        </FilterButton>
      </FilterContainer>
      <RequestTable>
        <thead>
          <tr>
            <th>User</th>
            <th>Ticket</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request._id}>
              {console.log(request)}
              <td>
                Name: {request.user?.username} <br /> Mail:{" "}
                {request.user?.email}
              </td>
              <td>
                ticket id: {request.ticket} <br />
              </td>
              <td>{request.reason}</td>
              <td>{request.status}</td>
              <td>
                {statusFilter === "pending" && (
                  <>
                    <ActionButton
                      color="#4caf50"
                      hoverColor="#45a049"
                      onClick={() =>
                        handleUpdateStatus(request._id, "approved")
                      }
                    >
                      Approve
                    </ActionButton>
                    <ActionButton
                      color="#ff4d4d"
                      hoverColor="#e60000"
                      onClick={() =>
                        handleUpdateStatus(request._id, "rejected")
                      }
                    >
                      Reject
                    </ActionButton>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </RequestTable>
    </Container>
  )
}

export default AdminCancellationRequests
