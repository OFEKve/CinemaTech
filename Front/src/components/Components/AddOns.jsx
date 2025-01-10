import { useEffect, useState } from "react"
import styled from "styled-components"
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js"
import TicketGenerator from "./TicketGenerator" // ייבוא רכיב הכרטיס
import SpiralGallery from "./SpiralGallery" // ייבוא גלריות
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import ProgressBar from "./ProgressBar"
const RemoveButton = styled.button`
  background-color: #444;
  border: 1px solid #ff4d4d;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  font-size: 0.9rem;
  color: #fff;
  cursor: pointer;

  &:hover {
    background-color: #ff4d4d;
    border-color: #e60000;
  }
`

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: 1000;
`
const CartItemContainer = styled.div`
  display: flex;
  flex-wrap: wrap; /* מאפשר עטיפה לשורות */
  gap: 15px; /* רווח בין האלמנטים */
  justify-content: flex-start; /* יישור האלמנטים להתחלה */
  align-items: flex-start; /* יישור אנכי */
  padding: 10px; /* רווח פנימי */
  max-height: 300px; /* גובה מקסימלי */
  overflow-y: auto; /* מאפשר גלילה אנכית אם צריך */
  border: 1px solid #333; /* מסגרת עדינה */
  background-color: #222; /* רקע כהה */
`

const ModalDiv = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1e1e2f;
  color: #ffffff;
  padding: 20px;
  z-index: 1001;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
  width: 70%;
  height: 80%;
  overflow-y: auto;
`

const Cart = styled.div`
  background: linear-gradient(145deg, #222, #333);
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4);
  color: #fff;
`

const CartTitle = styled.h1`
  font-size: 1.8rem;
  color: #ff4d4d;
  text-transform: uppercase;
  text-align: center;
  margin-bottom: 20px;
`

const CartItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #444;
  border-radius: 8px;
  padding: 10px;
  width: 120px;
  height: auto;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  margin: 10px;
  text-align: center;
  transition:
    transform 0.4s,
    box-shadow 0.4s;

  &:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 20px rgba(255, 0, 0, 0.6);
  }

  @media (max-width: 768px) {
    width: 60px;
    height: 60px;
  }
`

const ProductImage = styled.img`
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 5px;
  transition: transform 0.4s;

  ${CartItem}:hover & {
    transform: rotate(-5deg) scale(1.1);
  }
`

const CartItemText = styled.p`
  margin: 0;
  font-size: 0.9rem;
  color: #fff;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 0.5rem;
  }
`

const GalleryWrapper = styled.div`
  margin-bottom: 30px;
`

const CategoryTitle = styled.h2`
  font-size: 1.5rem;
  color: #ff6f61;
  margin-bottom: 15px;
  text-transform: uppercase;
  height: 30px;
`

const AddOns = ({
  open,
  onClose,
  selectedSeats,
  seatPrice,
  addonsTotal,
  onAddItem,
  movieId,
  setReservedSeats,
  movieName,
  movieImage,
  username,
  selectedTimeSlot,
  selectedDate,
  hallNumber,
}) => {
  if (!open) return null
  const [currentStep, setCurrentStep] = useState(1)

  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [cartItems, setCartItems] = useState([])
  const a = selectedSeats.length

  const [totalPrice, setTotalPrice] = useState(a * seatPrice)

  const totalSeatsPrice = selectedSeats.length * seatPrice

  const updateTotalPrice = (items) => {
    const addonsPrice = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    )
    setTotalPrice(totalSeatsPrice + addonsPrice)
  }

  const handleAddItem = (item) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i.id === item.id)
      console.log(username.username)

      if (existingItemIndex !== -1) {
        const updatedItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
        updateTotalPrice(updatedItems)
        return updatedItems
      } else {
        const newItem = { ...item, quantity: 1 }
        const updatedItems = [...prevItems, newItem]
        updateTotalPrice(updatedItems)
        return updatedItems
      }
    })

    toast.success(`${item.name} added to the cart!`)
  }

  const handleRemoveItem = (itemId) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === itemId
      )

      if (existingItemIndex >= 0) {
        const updatedItems = [...prevItems]
        if (updatedItems[existingItemIndex].quantity > 1) {
          // הפחת את הכמות אם היא גדולה מ-1
          updatedItems[existingItemIndex].quantity -= 1
        } else {
          // הסר את המוצר אם הכמות היא 1
          updatedItems.splice(existingItemIndex, 1)
        }
        updateTotalPrice(updatedItems)

        return updatedItems
      } else {
        toast.error(`No item found to remove.`)
        return prevItems
      }
    })

    toast.success(`Item removed successfully!`)
  }

  const handlePaymentSuccess = async (details) => {
    try {
      setCurrentStep(3)

      const response = await fetch(
        "https://cinematech-1.onrender.com/api/v1/seat/reserve",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            movieId,
            seats: selectedSeats,
            timeSlot: selectedTimeSlot,
            date: selectedDate,
          }),
          credentials: "include",
        }
      )

      const data = await response.json()

      if (response.ok) {
        toast.success(`Payment successful! Thank you,.` + username.username)
        setReservedSeats((prevReserved) => [...prevReserved, ...selectedSeats])
        setPaymentSuccess(true)
      } else {
        toast.error(
          data.message || "Failed to reserve seats. Please try again."
        )
      }
    } catch (error) {
      toast.error("Server error. Please try again.")
    }
  }

  const handlePaymentError = (error) => {
    toast.error(`Payment failed. Please try again. ${error}`)
  }

  return (
    <PayPalScriptProvider
      options={{
        "client-id":
          "AZXualD8Ok5Rh1CTbBziLGL1OkCRvxaJs2f-a4mKzzWkcWiunK88I_YLu_PXw8nacHIj56WlE4KDhDIc",
        currency: "ILS",
      }}
    >
      <Overlay onClick={onClose} />
      <ModalDiv>
        <ProgressBar currentStep={currentStep} />

        {!paymentSuccess ? (
          <>
            <Cart>
              <CartTitle>Your Cart</CartTitle>
              <CartItemText>
                Total Price: ₪{totalPrice.toFixed(2)}{" "}
                <div
                  style={{
                    marginTop: "10px",
                    display: "flex",
                    gap: "10px",
                    justifyContent: "center",
                  }}
                >
                  <PayPalButtons
                    disabled={totalPrice <= 0}
                    createOrder={(data, actions) => {
                      return actions.order.create({
                        purchase_units: [
                          {
                            amount: {
                              value: totalPrice.toFixed(2),
                            },
                          },
                        ],
                      })
                    }}
                    onApprove={async (data, actions) => {
                      const details = await actions.order.capture()
                      handlePaymentSuccess(details)
                    }}
                    onError={(error) => handlePaymentError(error)}
                  />
                </div>
              </CartItemText>
              {selectedSeats.length > 0 && (
                <>
                  <h3 style={{ color: "#ff4d4d", marginBottom: "10px" }}>
                    Selected Seats:
                  </h3>
                  <div
                    style={{
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {selectedSeats.map((seat, index) => (
                      <CartItem key={index}>
                        <ProductImage
                          src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/chair-red.jpg"
                          alt="Seat"
                        />
                        <CartItemText>Seat {seat}</CartItemText>
                      </CartItem>
                    ))}
                  </div>
                </>
              )}
              <h3 style={{ color: "#ff4d4d", marginBottom: "10px" }}>
                Selected Items:
              </h3>
              <CartItemContainer>
                {cartItems.map(
                  (item, index) => (
                    console.log(item, index),
                    (
                      <CartItem key={index}>
                        <ProductImage
                          src={item.picture || "/default-image.png"}
                          alt={item.name}
                        />
                        <CartItemText>{item.name}</CartItemText>
                        <CartItemText>
                          Price: ₪{item.price.toFixed(2)}
                        </CartItemText>
                        <CartItemText>Quantity: {item.quantity}</CartItemText>
                        <RemoveButton onClick={() => handleRemoveItem(item.id)}>
                          Remove
                        </RemoveButton>
                      </CartItem>
                    )
                  )
                )}
              </CartItemContainer>

              <div
                className="align-items-center flex justify-center"
                style={{ marginTop: "20px" }}
              ></div>
            </Cart>
            {/* גלריות */}
            <GalleryWrapper>
              <CategoryTitle>Food</CategoryTitle>
              <SpiralGallery
                categoryName="Food"
                onAddItem={(item) => handleAddItem(item)}
              />
            </GalleryWrapper>
            <GalleryWrapper>
              <CategoryTitle>Drinks</CategoryTitle>
              <SpiralGallery
                categoryName="Drinks"
                onAddItem={(item) => handleAddItem(item)}
              />
            </GalleryWrapper>
            <GalleryWrapper>
              <CategoryTitle>Deals</CategoryTitle>
              <SpiralGallery
                categoryName="Deals"
                onAddItem={(item) => handleAddItem(item)}
              />
            </GalleryWrapper>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <PayPalButtons
                disabled={totalPrice <= 0} // כפתור מושבת אם totalPrice קטן או שווה ל-0
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: totalPrice.toFixed(2),
                        },
                      },
                    ],
                  })
                }}
                onApprove={async (data, actions) => {
                  const details = await actions.order.capture()

                  handlePaymentSuccess(details)
                }}
                onError={(error) => handlePaymentError(error)}
              />
            </div>
          </>
        ) : (
          <TicketGenerator
            movieImage={movieImage}
            movieName={movieName}
            selectedSeats={selectedSeats}
            username={username.username}
            selectedTimeSlot={selectedTimeSlot}
            selectedDate={selectedDate}
            hallNumber={hallNumber}
          />
        )}
      </ModalDiv>
    </PayPalScriptProvider>
  )
}

export default AddOns
