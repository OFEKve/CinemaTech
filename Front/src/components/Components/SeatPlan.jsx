import { useState, useEffect } from "react"
import styled from "styled-components"
import AddOns from "./AddOns"
import { useParams } from "react-router-dom"
import { useLocation } from "react-router-dom"
import { toast } from "react-toastify"
import { useNavigate } from "react-router-dom"

import "react-toastify/dist/ReactToastify.css"

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
  background-image: linear-gradient(45deg, #ff6f61, #ff9e80);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`
const IconButton = styled.div`
  width: 60px;
  height: 60px;
  background-color: #ff6f61; /* צהוב */
  border-radius: 50%;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.3s;

  &:hover {
    transform: scale(1.2);
  }

  svg {
    width: 30px;
    height: 30px;
    stroke: white;
  }
`

const Container = styled.div`
  background-color: #000000;
  min-height: 100vh; /* מבטיח שהגובה יהיה לפחות גובה חלון הדפדפן */
  width: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start; /* מיישר את התוכן למעלה */
  position: relative;
  padding: 20px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  box-sizing: border-box;
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

const DatePickerContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  label {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
    color: #fff;
  }

  input {
    padding: 12px 15px;
    border: 2px solid #ccc;
    border-radius: 10px;
    font-size: 16px;
    outline: none;
    background-color: #fff; /* שינוי לרקע לבן */
    color: #222; /* שינוי צבע הטקסט לכהה כדי שיהיה ברור על רקע לבן */

    @media (max-width: 768px) {
      padding: 10px;
      font-size: 14px;
    }
  }
`

const TimeSlotContainer = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: column;
  align-items: center;

  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    color: #f0f0f0;
  }

  .time-slots {
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    justify-content: center;

    @media (max-width: 768px) {
      gap: 10px;
    }
  }

  .time-slot {
    padding: 12px 25px;
    font-size: 16px;
    font-weight: bold;
    border: none;
    border-radius: 8px;
    background-color: #4caf50;
    color: #fff;
    cursor: pointer;

    @media (max-width: 768px) {
      padding: 10px 20px;
      font-size: 14px;
    }

    @media (max-width: 480px) {
      padding: 8px 15px;
      font-size: 12px;
    }
  }
`

const Main = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start; /* מבטיח שהתוכן יתחיל מהחלק העליון */
  z-index: 1;
  padding-top: 100px; /* מוסיף רווח מעל התוכן */
  width: 100%;
  box-sizing: border-box; /* כולל את ה-padding בחישוב הגודל */
`

const LogoContainer = styled.div`
  position: absolute;
  top: 5px; /* מרחק מלמעלה */
  z-index: 10; /* מבטיח שזה יוצג מעל כל האלמנטים האחרים */
`

const Seat = styled.div`
  width: 40px;
  height: 40px;
  background-image: url("https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/chair-green.jpg");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 8px; /* מעגל פינות */
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* הצללה עדינה */
  position: relative;

  &.selected {
    background-image: url("https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/chair-blue.jpg");
    transform: scale(1.1);
    box-shadow: 0 4px 8px rgba(0, 0, 255, 0.3); /* הדגשה */
  }

  &.reserved {
    background-image: url("https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/chair-red.jpg");
    cursor: not-allowed;
    opacity: 0.6;
  }

  &:hover:not(.reserved) {
    transform: scale(1.1);
    box-shadow: 0 4px 10px rgba(0, 255, 0, 0.3);
  }
  @media (max-width: 768px) {
    width: 20px; /* חצי מהגודל המקורי */
    height: 20px; /* חצי מהגודל המקורי */
  }
`

const InfoDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px;
  background: #222;
  border-radius: 10px;
  color: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin-bottom: 30px;
  width: 90%;
  max-width: 600px;
  text-align: center;

  @media (max-width: 768px) {
    width: 95%;
  }
`

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 10px 0;
  background: #333;
  border-radius: 8px;
  color: #f0f0f0;
  font-size: 18px;
  font-weight: bold;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);

  span {
    color: #ff6f61;
    font-weight: 700;
  }
`

const SeatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 12px;
  justify-content: center;
  padding: 20px;
  background-color: #f8f8f8;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  z-index: 999;
`

const Screen = styled.div`
  width: 40%;
  height: 50px;
  background: linear-gradient(to top, #e0e0e0, #ffffff);
  text-align: center;
  line-height: 50px;
  font-weight: bold;
  border-radius: 50px / 20px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  color: #333;
  border: 2px solid #bcbcbc;
  margin: 20px 0;
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: rgba(255, 255, 255, 0.5);
    transform: skewX(-45deg);
    animation: screenShimmer 3s infinite;
  }

  @keyframes screenShimmer {
    0% {
      left: -100%;
    }
    50% {
      left: 100%;
    }
    100% {
      left: -100%;
    }
  }
  @media (max-width: 768px) {
    width: 90%; /* חצי מהגודל המקורי */
    height: 50%; /* חצי מהגודל המקורי */
  }
`

const ContinueButton = styled.button`
  background-color: #ff6f61;
  border: none;
  border-radius: 20px;
  height: 50px;
  width: 160px;
  cursor: pointer;
  font-size: 18px;
  color: white;
  margin-top: 20px;
  font-weight: bold;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
    background-color: #ff5a50;
  }

  &:active {
    transform: translateY(2px);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  }
`

const HallInfo = styled.div`
  margin: 15px 0;
  padding: 10px 15px;
  background: #444;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  border: 2px solid #555;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(255, 255, 255, 0.2);
  }
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


  }

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 10px;
  }
`

const SeatPlan = ({ username }) => {
  const { movieId } = useParams()
  const location = useLocation()
  const { movieName, movieImage } = location.state
  const ticketPrice = 49
  const totalSeats = 80
  const seatsPerRow = 10
  const [selectedSeats, setSelectedSeats] = useState([])
  const [reservedSeats, setReservedSeats] = useState([])
  const [hallNumber, setHallNumber] = useState(null)
  const [addonsTotal, setAddonsTotal] = useState(0)
  const [isOpen, setIsOpen] = useState(false)
  const [loadingSeats, setLoadingSeats] = useState(true)
  const [timeSlots] = useState(["17:00 PM", "19:00 PM", "21:00 PM", "23:00 PM"])
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0])
  const navigate = useNavigate()

  const seatPositions = Array.from({ length: totalSeats }, (_, i) => {
    const row = String.fromCharCode(65 + Math.floor(i / seatsPerRow))
    const column = (i % seatsPerRow) + 1
    return `${row}${column}`
  })

  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0] // תאריך נוכחי בפורמט YYYY-MM-DD
  })

  const maxDate = (() => {
    const today = new Date()
    const nextWeek = new Date()
    nextWeek.setDate(today.getDate() + 7)
    return nextWeek.toISOString().split("T")[0]
  })()

  useEffect(() => {
    const fetchReservedSeats = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/seat/reserved/${movieId}?timeSlot=${selectedTimeSlot}&date=${selectedDate}`,
          { withCredentials: true }
        )
        const data = await response.json()

        if (response.ok) {
          setReservedSeats(data.reservedSeats)
        } else {
          toast.error(data.message || "Failed to fetch reserved seats.")
        }
      } catch (error) {
        toast.error("Server error. Please try again.")
      } finally {
        setLoadingSeats(false)
      }
    }

    fetchReservedSeats()
  }, [movieId, selectedTimeSlot, selectedDate])

  useEffect(() => {
    const fetchHallNumber = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/halls/${movieId}?timeSlot=${selectedTimeSlot}`
        )
        const data = await response.json()

        if (response.ok) {
          setHallNumber(data.hall.hallNumber)
        } else {
          toast.error(data.message || "No hall assigned. Assigning a new hall.")
        }
      } catch (error) {
        toast.error("Error fetching or assigning hall number.")
      }
    }

    fetchHallNumber()
  }, [movieId, selectedTimeSlot])

  const toggleSeatSelection = (position) => {
    if (reservedSeats.includes(position)) return

    setSelectedSeats((prevSelected) => {
      if (prevSelected.includes(position)) {
        return prevSelected.filter((seat) => seat !== position)
      } else {
        return [...prevSelected, position]
      }
    })
  }

  const handlePayNowClick = () => {
    if (selectedSeats.length === 0) {
      toast.error("Please select at least one seat.", {})
      return
    }

    setIsOpen(true)
  }

  return (
    <>
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
      <VideoWrapper className="right">
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
      <Container>
        <LogoContainer>
          <IconButton onClick={() => navigate("/")} title="Go to Home">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2.5"
              stroke="white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 12l2-2m0 0l7-7m-7 7v12a2 2 0 002 2h3m10-9l2 2m0 0l-7 7m7-7H9"
              />
            </svg>
          </IconButton>
        </LogoContainer>
        <Main>
          <InfoDisplay>
            <InfoItem>
              <MovieTitle>{movieName || "Movie Title"}</MovieTitle>
            </InfoItem>
            <InfoItem>
              <DatePickerContainer>
                <label htmlFor="date-picker">Select a Date:</label>
                <input
                  type="date"
                  id="date-picker"
                  value={selectedDate}
                  min={selectedDate}
                  max={maxDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                />
              </DatePickerContainer>
              {hallNumber && <HallInfo>Hall Number: {hallNumber}</HallInfo>}
            </InfoItem>
            <InfoItem>
              <TimeSlotContainer>
                <h3
                  style={{
                    color: "#fff",
                    marginBottom: "10px",
                    textAlign: "center",
                  }}
                >
                  Select a Time Slot:
                </h3>
                <div
                  style={{ display: "flex", gap: "10px", marginBottom: "20px" }}
                >
                  {timeSlots.map((slot) => (
                    <button
                      key={slot}
                      onClick={() => setSelectedTimeSlot(slot)}
                      className={`time-slot ${
                        selectedTimeSlot === slot ? "selected" : ""
                      }`}
                      style={{
                        padding: "10px 20px",
                        borderRadius: "5px",
                        background:
                          selectedTimeSlot === slot ? "#4caf50" : "#ccc",
                        color: selectedTimeSlot === slot ? "#fff" : "#000",
                        cursor: "pointer",
                      }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </TimeSlotContainer>
            </InfoItem>
          </InfoDisplay>

          <Screen>Screen</Screen>
          <br />
          <SeatsContainer>
            {seatPositions.map((position, index) => (
              <Seat
                key={index}
                className={
                  reservedSeats.includes(position)
                    ? "reserved"
                    : selectedSeats.includes(position)
                      ? "selected"
                      : ""
                }
                onClick={() => toggleSeatSelection(position)}
              />
            ))}
          </SeatsContainer>

          <ContinueButton onClick={handlePayNowClick}>Pay now</ContinueButton>
        </Main>

        <AddOns
          open={isOpen}
          onClose={() => setIsOpen(false)}
          selectedSeats={selectedSeats}
          seatPrice={ticketPrice}
          addonsTotal={addonsTotal}
          onAddItem={(price) => setAddonsTotal((prev) => prev + price)}
          movieId={movieId}
          setReservedSeats={setReservedSeats}
          movieName={movieName}
          movieImage={movieImage}
          username={username}
          selectedTimeSlot={selectedTimeSlot}
          selectedDate={selectedDate}
          hallNumber={hallNumber}
        />
      </Container>
    </>
  )
}

export default SeatPlan
