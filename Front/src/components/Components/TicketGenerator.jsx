import { useRef, useState, useEffect } from "react"
import QRCode from "react-qr-code"
import { useNavigate } from "react-router-dom"
import { toast } from "react-toastify"
import styled from "styled-components"
import Confetti from "react-confetti"
import { Download } from "lucide-react"
import { ArrowRight } from "lucide-react"
import jsPDF from "jspdf"

const TicketContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #1c1e26;
  overflow: hidden;
  text-align: center;
  padding: 20px;
`
const Button = styled.button`
  padding: 12px 24px;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #d40813;
    transform: translateY(-2px);
  }
`
const AnimatedButton = styled(Button)`
  background: linear-gradient(90deg, #4caf50, #45a049);
  border: none;
  font-size: 18px;
  padding: 12px 24px;
  color: white;
  border-radius: 50px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease-in-out;
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 0px;

  &:before {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 200%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.2),
      rgba(255, 255, 255, 0)
    );
    z-index: 1;
    transition: all 0.4s ease-in-out;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:hover:before {
    left: 0;
  }

  span {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: center;
  }

  svg {
    margin-left: 8px;
    transform: translateX(0);
    transition: transform 0.3s ease-in-out;
  }

  &:hover svg {
    transform: translateX(5px); /* הזזת האייקון ימינה באנימציה */
  }
`

const ThankYouMessage = styled.div`
  color: white;
  padding: 20px;
  border-radius: 10px;
  font-size: 40px;
  font-weight: bold;
  margin-bottom: 30px;
  box-shadow: 0 4px 10px rgba(255, 253, 208, 0.4); /* צבע קרם */
`

const CardWrapper = styled.div`
  width: 400px;
  height: 500px;
  perspective: 1500px;
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
`

const Card = styled.div`
  width: 80%;
  height: 70%;
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
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
`

const CardBack = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  background-color: #2b2e3b;
  color: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 20px;
`

const Poster = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 15px;
`

const Details = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
`

const InfoSection = styled.div`
  flex: 1;
  padding-right: 20px;
`

const QRSection = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
`

const Info = styled.p`
  margin: 10px 0;
  font-size: 16px;
  line-height: 1.5;
  color: #ddd;
`

const DownloadButton = styled.button`
  margin-top: 10px;
  padding: 10px 20px;
  background-color: transparent;
  color: white;
  border: 1px solid #ff9800;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #ff9800;
    color: black;
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 14px;
  }
`

const TicketGenerator = ({
  movieName,
  movieImage,
  selectedSeats,
  username,
  selectedTimeSlot,
  selectedDate,
  hallNumber,
}) => {
  const cardRef = useRef(null)
  const [isFlipped, setIsFlipped] = useState(false)
  const navigate = useNavigate()
  const [showConfetti, setShowConfetti] = useState(true)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 4000) // 4 שניות

    return () => clearTimeout(timer) // ניקוי הטיימר אם הקומפוננטה יוצאת מהמסך
  }, [])

  const qrData = {
    movieName,
    selectedSeats,
    movieImage,
    selectedTimeSlot,
    date: selectedDate,
    hallNumber,
  }
  const handleDownload = (ticket) => {
    if (!ticket) {
      console.error("Ticket data is undefined.")
      return
    }

    const doc = new jsPDF()

    doc.setFont("helvetica", "bold")
    doc.setFontSize(22)
    doc.setTextColor(40, 40, 40)
    doc.text(" CinemaTech Ticket Invoice", 105, 20, { align: "center" })

    // הוספת קו הפרדה
    doc.setDrawColor(200, 0, 0) // צבע אדום
    doc.setLineWidth(0.5)
    doc.line(20, 30, 190, 30)

    // מידע על המשתמש
    doc.setFont("helvetica", "normal")
    doc.setFontSize(14)
    doc.setTextColor(60, 60, 60)
    doc.text(`Hello, ${username}`, 20, 40)

    // מידע על הסרט
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.setTextColor(30, 30, 30)
    doc.text("Movie Information:", 20, 50)

    doc.setFont("helvetica", "normal")
    doc.setFontSize(12)
    doc.setTextColor(60, 60, 60)
    doc.text(` Movie: ${ticket.movieName}`, 20, 60)
    doc.text(` Seat: ${ticket.selectedSeats}`, 20, 70)
    doc.text(` Hall: ${ticket.hallNumber}`, 20, 80)
    doc.text(` Time: ${ticket.selectedTimeSlot}`, 20, 90)
    doc.text(` Date: ${ticket.selectedDate}`, 20, 100)

    // הוספת קו הפרדה נוסף
    doc.setDrawColor(0, 0, 0)
    doc.line(20, 110, 190, 110)

    // הוספת פסקת תודה
    doc.setFont("helvetica", "italic")
    doc.setFontSize(14)
    doc.setTextColor(100, 100, 100)
    doc.text("Thank you for choosing CinemaTech! Enjoy the movie! ", 105, 120, {
      align: "center",
    })

    // שמירת הקובץ
    doc.save(`CinemaTech-Ticket-${username}.pdf`)
  }

  const saveTicketToUser = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/v1/tickets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          ticket: qrData,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || "Failed to save ticket.")
      }

      const data = await response.json()
      console.log("Ticket saved:", data)
      toast.success("Ticket saved successfully!")
    } catch (error) {
      console.error("Error saving ticket:", error)
      toast.error("Failed to save ticket.")
    }
  }

  useEffect(() => {
    saveTicketToUser()
  }, [])

  return (
    <TicketContainer>
      {showConfetti && <Confetti />}
      <ThankYouMessage>Thank you for your payment! 🎉</ThankYouMessage>
      <CardWrapper
        onMouseEnter={() => setIsFlipped(true)}
        onMouseLeave={() => setIsFlipped(false)}
      >
        <Card ref={cardRef} isFlipped={isFlipped}>
          <CardFront>
            <Poster src={movieImage} alt={movieName} />
          </CardFront>

          <CardBack>
            <Details>
              <InfoSection>
                <Info>
                  <strong>Movie:</strong> {movieName}
                </Info>
                <Info>
                  <strong>Seats:</strong> {selectedSeats.join(", ")}
                </Info>
                <Info>
                  <strong>Time:</strong> {selectedTimeSlot}
                </Info>
                <Info>
                  <strong>Date:</strong> {qrData.date}
                </Info>
                <Info>
                  <strong>Hall:</strong> {hallNumber}
                </Info>
              </InfoSection>
              <QRSection>
                <QRCode value={JSON.stringify(qrData)} size={150} />
              </QRSection>
            </Details>
            <DownloadButton
              onClick={() =>
                handleDownload({
                  movieName,
                  selectedSeats: selectedSeats.join(", "),
                  hallNumber,
                  selectedTimeSlot,
                  selectedDate,
                })
              }
            >
              <Download /> Download Ticket
            </DownloadButton>
          </CardBack>
        </Card>
      </CardWrapper>
      <AnimatedButton onClick={() => navigate("/tickets")}>
        <Button>
          {" "}
          <span>
            My Tickets <ArrowRight />
          </span>
        </Button>
      </AnimatedButton>
    </TicketContainer>
  )
}

export default TicketGenerator
