import { useEffect, useState } from "react"
import styled from "styled-components"
import QRCode from "react-qr-code"
import { Download, CalendarCheck, Clock, XCircle, Smile } from "lucide-react"
import { toast } from "react-toastify"
import { Link } from "react-router-dom"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Slider from "react-slick"
import jsPDF from "jspdf"

const ValidLabel = styled.div`
  position: absolute;
  top: 65px;
  left: -10px;
  background-color: #28a745; /* Green */
  color: white;
  font-size: 14px; /* Slightly larger text */
  font-weight: bold;
  padding: 5px 15px; /* Extra padding for a spacious look */
  transform: rotate(-45deg); /* Maintain the angle */
  transform-origin: left;
  z-index: 2;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px; /* Rounded edges */
  text-align: center;
  white-space: nowrap; /* Prevent text from breaking to the next line */
  display: flex; /* Flexbox for icon and text alignment */
  align-items: center; /* Center-align items vertically */
  gap: 5px; /* Space between icon and text */
  backface-visibility: hidden; /* מסתיר את ה-ValidLabel בצד האחורי */
`

const MovieTitle = styled.h1`
  color: #fff;
  font-size: 36px;
  margin-bottom: 20px;
  text-align: center;
  text-transform: uppercase;
  text-shadow:
    2px 4px 6px rgba(0, 0, 0, 0.7),
    0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  font-weight: bold;
  background-image: linear-gradient(45deg, #d1d1d1, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  z-index: 999;
`

const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #121212;
  color: white;

  min-height: 100vh;
  padding: 20px;

  @media (max-width: 768px) {
    padding: 10px;
  }
`

const MovieGroup = styled.div`
  margin-bottom: 40px;
  width: 100%;
  max-width: 900px;
  text-align: center;
  background: #1c1c1c; /* צבע רקע לדיב */
  padding: 20px;
  border-radius: 15px; /* עיגול פינות */
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition:
    transform 0.3s,
    box-shadow 0.3s;
  z-index: 999;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    margin-bottom: 20px;
    padding: 15px;
  }
`

const TicketsWrapper = styled.div`
  .slick-slider {
    overflow: visible !important; /* מאפשר תוכן גלוי */
  }
`

const CardWrapper = styled.div`
  width: 160px;
  height: 400px;
  perspective: 1500px;
  display: flex;
  justify-content: center;

  @media (max-width: 768px) {
    width: 90%;
    height: 350px;
  }
`

const TicketCard = styled.div`
  width: 90%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition:
    transform 0.6s ease-in-out,
    box-shadow 0.4s ease-in-out;
  transform: ${({ isFlipped }) =>
    isFlipped ? "rotateY(180deg)" : "rotateY(0deg)"};
  cursor: pointer;
  background: linear-gradient(145deg, #2e2e2e, #1e1e1e); /* אפור כהה */
  border-radius: 15px;
  box-shadow:
    0px 4px 8px rgba(0, 0, 0, 0.3),
    0px -4px 8px rgba(255, 255, 255, 0.1);
  &:hover {
    box-shadow:
      0px 6px 12px rgba(0, 0, 0, 0.5),
      0px -6px 12px rgba(255, 255, 255, 0.2);
  }
`

const Poster = styled.img`
  width: 100%;
  height: 80%;
  object-fit: cover;
  border-radius: 15px 15px 0 0;
`

const QRCodeWrapper = styled.div`
  padding: 10px;
  background: #2e2e2e; /* רקע אפור כהה */
  border-radius: 10px;
  margin-top: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
`

const ExpiredButton = styled.button`
  position: absolute;
  top: 50px;
  left: -10px;
  background-color: #ff4d4d; /* Red */
  color: white;
  font-size: 14px;
  font-weight: bold;
  padding: 5px 15px;
  transform: rotate(-45deg);
  transform-origin: left;
  z-index: 2;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  text-align: center;
  white-space: nowrap;
  border: none;
  display: flex;
  align-items: center;
  gap: 5px; /* Space between icon and text */
  cursor: default; /* Make it non-clickable */
`

const NoTicketsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  height: 100vh;
  color: white;

  h2 {
    font-size: 24px;
    margin: 16px 0;
    color: #ff9800;

    @media (max-width: 768px) {
      font-size: 20px;
    }
  }

  p {
    font-size: 16px;
    color: #ccc;
    margin-bottom: 20px;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }
`

const CancelButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ff4d4d;
  color: white;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #e60000;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`

const VideoWrapper = styled.div`
  position: fixed; /* מיקום קבוע */
  top: 0;
  bottom: 0; /* מבטיח שהווידאו מתפרס לגובה המסך */
  width: 200px; /* רוחב אחיד */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1; /* ווידאו נשאר מאחורי האלמנטים המרכזיים */

  &.left {
    left: 0; /* מקבע את הווידאו לשמאל המסך */
  }

  &.right {
    right: 0; /* מקבע את הווידאו לימין המסך */
  }

  .screen-frame {
    position: relative;
    width: 100%; /* תופס את כל רוחב ה-VideoWrapper */
    height: 100%; /* תופס את כל גובה ה-VideoWrapper */
    display: flex;
    justify-content: center;
    align-items: center;
  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover; /* מתיחה מתאימה לוידאו */
    border-radius: 10px; /* עיגול קצוות אופציונלי */
  }
`
const BrowseButton = styled.button`
  background-color: #ff9800;
  color: black;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e68a00;
  }
`

const CardFront = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #1c1f24; /* גוון כהה עם נגיעה קרירה */

  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
`

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  background-color: #212121;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  transform: rotateY(180deg);
`

const TicketInfo = styled.div`
  text-align: center;
  margin-top: 10px;
  color: #d3d3d3;
`

const Info = styled.p`
  font-size: 16px;
  margin: 5px 0;
`

const CarouselWrapper = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
`
const VideoFrame = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: #333;

  border-radius: 15px;

  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: pulse 10s infinite;
  }
  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`

const Tickets = ({ user }) => {
  const [groupedTickets, setGroupedTickets] = useState({})
  const [isFlipped, setIsFlipped] = useState({})
  const [cancellationReasons, setCancellationReasons] = useState({})
  const [cancellationRequests, setCancellationRequests] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [timeoutReached, setTimeoutReached] = useState(false)
  const [showOnlyValidTickets, setShowOnlyValidTickets] = useState(false)
  document.querySelectorAll("button .hover-effect").forEach((effect) => {
    effect.parentElement.addEventListener("mouseenter", () => {
      effect.style.left = "100%"
    })
    effect.parentElement.addEventListener("mouseleave", () => {
      effect.style.left = "-100%"
    })
  })

  const filteredGroupedTickets = Object.entries(groupedTickets).reduce(
    (acc, [key, tickets]) => {
      const filteredTickets = tickets.filter(
        (ticket) =>
          !showOnlyValidTickets || // Show all tickets if the filter is off
          new Date(ticket.selectedDate) >= new Date().setHours(0, 0, 0, 0) // Filter valid tickets
      )
      if (filteredTickets.length > 0) {
        acc[key] = filteredTickets
      }
      return acc
    },
    {}
  )

  const toggleFilter = () => {
    setShowOnlyValidTickets((prev) => !prev)
  }
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }

  const calculateDaysLeft = (date) => {
    const today = new Date()
    const targetDate = new Date(date)
    const timeDifference = targetDate - today

    // מחשבים את ההפרש בימים (מעגלים למעלה כדי להציג את היום הנוכחי כ-"1 יום")
    return Math.ceil(timeDifference / (1000 * 60 * 60 * 24))
  }

  const getCancellationStatus = (ticketId) => {
    const request = cancellationRequests.find((req) => req.ticket === ticketId)
    return request ? request.status : null
  }

  const handleCancelRequest = async (ticketId) => {
    const reason = cancellationReasons[ticketId]
    if (!reason || reason.trim() === "") {
      toast.error("Please provide a reason for cancellation.")
      return
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/v1/tickets/${ticketId}/cancellation`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ reason }),
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success("Cancellation request submitted successfully!")
        fetchCancellationRequests()
      } else {
        toast.error(data.message || "Failed to submit cancellation request.")
      }
    } catch (error) {
      toast.error("Server error. Please try again.")
    }
  }

  useEffect(() => {
    const timeout = setTimeout(() => {
      setTimeoutReached(true) // מאפשר שגיאה רק אחרי עיכוב
    }, 5000) // 5 שניות המתנה

    return () => clearTimeout(timeout)
  }, [])

  const fetchCancellationRequests = async () => {
    try {
      const response = await fetch(
        `  http://localhost:3000/api/v1/tickets/${user.username}/cancellation-requests`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      )

      const data = await response.json()

      if (response.ok) {
        setCancellationRequests(data.requests)
      } else {
        if (timeoutReached)
          toast.error(data.message || "Failed to fetch cancellation requests.")
      }
    } catch (error) {
      if (timeoutReached)
        toast.error("Server cancellation requests error. Please try again.")
    }
  }

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tickets/${user.username}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            credentials: "include",
          }
        )

        const data = await response.json()

        if (response.ok) {
          const grouped = data.tickets.reduce((acc, ticket) => {
            const key = `${ticket.movieName}-${ticket.selectedTimeSlot}`

            if (!acc[key]) {
              acc[key] = []
            }

            const selectedDate = ticket.qrData?.date || "Date not available"

            ticket.selectedSeats.forEach((seat) =>
              acc[key].push({
                ...ticket,
                selectedSeat: seat,
                selectedDate,
              })
            )

            return acc
          }, {})

          setGroupedTickets(grouped)
        } else {
          if (timeoutReached)
            toast.error(data.message || "Failed to fetch tickets.")
        }
      } catch (error) {
        if (timeoutReached)
          toast.error("fetch tickets from the Server error. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchTickets()
    fetchCancellationRequests()
  }, [user, timeoutReached])

  if (isLoading) {
    return (
      <>
        <p>Loading tickets...</p>
      </>
    )
  }

  if (Object.keys(groupedTickets).length === 0) {
    return (
      <NoTicketsContainer>
        <Smile size={48} />
        <h2>No Tickets Found</h2>
        <p>
          It looks like you don’t have any tickets yet. Browse movies and book
          your tickets now!
        </p>
        <Link to="/">
          <BrowseButton>Browse Movies</BrowseButton>
        </Link>
      </NoTicketsContainer>
    )
  }

  return (
    <TicketContainer>
      <VideoWrapper className="left">
        <VideoFrame>
          <div className="screen-frame">
            <video autoPlay muted loop>
              <source
                src="https://res.cloudinary.com/duucxuyvk/video/upload/f_mp4/videos/hs9hg6yeu1yw4pfxigjk.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </VideoFrame>
      </VideoWrapper>
      <Link to="/">
        <img
          src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410637/videos/images/zqjtfyt3ssnhmszf6ope.png"
          alt="Netflix Logo"
          style={{ width: "150px", height: "auto" }}
        />
      </Link>
      <MovieTitle>Welcome, {user.username}</MovieTitle>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          style={{
            padding: "12px 24px",
            backgroundImage: "linear-gradient(45deg, #d1d1d1, #f0f0f0)",
            color: "transparent",
            WebkitBackgroundClip: "text",
            border: "2px solid #d1d1d1",
            borderRadius: "8px",
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.3)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
          }}
          onClick={toggleFilter}
        >
          <span
            style={{
              position: "absolute",
              top: 0,
              left: "-100%",
              width: "300%",
              height: "100%",
              backgroundImage:
                "linear-gradient(90deg, #d1d1d1, #f0f0f0, #d1d1d1)",
              opacity: 0.3,
              transform: "skewX(-30deg)",
              transition: "left 0.4s ease-in-out",
            }}
            className="hover-effect"
          ></span>
          {showOnlyValidTickets
            ? "Show All Tickets"
            : "Show Current Tickets Only"}
        </button>
      </div>
      {Object.entries(filteredGroupedTickets).map(([key, tickets]) => (
        <MovieGroup key={key}>
          <MovieTitle>
            {tickets[0].movieName} - {tickets[0].selectedTimeSlot}-
          </MovieTitle>
          <CarouselWrapper>
            <TicketsWrapper>
              <Slider {...settings}>
                {tickets.map((ticket, index) => {
                  const isExpired =
                    new Date(ticket.selectedDate) <
                    new Date().setHours(0, 0, 0, 0)
                  const daysLeft = calculateDaysLeft(ticket.selectedDate)
                  return (
                    <CardWrapper key={index}>
                      <TicketCard
                        isFlipped={isFlipped[key + index] || false}
                        isExpired={isExpired}
                        onClick={(e) => {
                          if (e.target.tagName !== "TEXTAREA" && !isExpired) {
                            setIsFlipped((prev) => ({
                              ...prev,
                              [key + index]: !prev[key + index],
                            }))
                          }
                        }}
                      >
                        {isExpired ? (
                          <ExpiredButton>
                            <Clock size={16} /> Expired
                          </ExpiredButton>
                        ) : (
                          <ValidLabel>
                            <CalendarCheck size={16} />
                            {daysLeft > 1 ? `${daysLeft} Days` : "Tomorrow"}
                          </ValidLabel>
                        )}
                        <CardFront>
                          <Poster
                            src={ticket.movieImage || "/default-poster.jpg"}
                            alt="Movie Poster"
                          />
                          <TicketInfo>
                            <Info>
                              <strong>Seat:</strong> {ticket.selectedSeat}
                            </Info>
                            <Info>
                              <strong>Hall:</strong>{" "}
                              {ticket.hallNumber || "N/A"}
                            </Info>
                            <Info>
                              <strong>Date:</strong>{" "}
                              {ticket.selectedDate || "N/A"}
                            </Info>
                          </TicketInfo>
                        </CardFront>

                        <CardBack>
                          {!isExpired && (
                            <>
                              <QRCodeWrapper>
                                <QRCode
                                  value={JSON.stringify(ticket.qrData || {})}
                                  size={150}
                                  bgColor="#ffffff"
                                  fgColor="#000000"
                                  level="Q"
                                />
                              </QRCodeWrapper>
                              {getCancellationStatus(ticket._id) ? (
                                <p>
                                  <strong>Status:</strong>{" "}
                                  {getCancellationStatus(ticket._id)}
                                </p>
                              ) : (
                                <>
                                  <textarea
                                    placeholder="Enter reason for cancellation"
                                    value={
                                      cancellationReasons[ticket._id] || ""
                                    }
                                    onChange={(e) =>
                                      setCancellationReasons((prev) => ({
                                        ...prev,
                                        [ticket._id]: e.target.value,
                                      }))
                                    }
                                    style={{
                                      width: "100%",
                                      height: "60px",
                                      marginTop: "10px",
                                      padding: "10px",
                                      borderRadius: "5px",
                                      border: "1px solid #ccc",
                                      color: "black",
                                      backgroundColor: "white",
                                    }}
                                  />
                                  <CancelButton
                                    onClick={() =>
                                      handleCancelRequest(ticket._id)
                                    }
                                  >
                                    <XCircle /> Cancellation request
                                  </CancelButton>
                                </>
                              )}
                            </>
                          )}
                        </CardBack>
                      </TicketCard>
                    </CardWrapper>
                    //git branch -M main
                    //git remote add origin https://github.com/OFEKve/CinemaTech.git
                  )
                })}
              </Slider>
            </TicketsWrapper>
          </CarouselWrapper>
        </MovieGroup>
      ))}
      <VideoWrapper className="right">
        <VideoFrame>
          <div className="screen-frame">
            <video autoPlay muted loop>
              <source
                src="https://res.cloudinary.com/duucxuyvk/video/upload/f_mp4/videos/hs9hg6yeu1yw4pfxigjk.mp4
"
                type="video/mp4"
              />
            </video>
          </div>
        </VideoFrame>
      </VideoWrapper>
    </TicketContainer>
  )
}

export default Tickets
