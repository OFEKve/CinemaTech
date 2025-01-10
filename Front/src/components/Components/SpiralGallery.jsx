import React, { useEffect, useState, useRef } from "react"
import styled from "styled-components"
import { toast } from "react-toastify"

const Wrapper = styled.div`
  position: relative;
  width: 100%;
  background-color: #222; /* רקע שחור */
  padding: 20px 0;
  overflow: hidden;
`

const CarouselContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1.5rem; /* מרווח גדול יותר בין האלמנטים */
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem;
  position: relative;
  height: 420px;
  &::-webkit-scrollbar {
    display: none; /* הסתרת פס הגלילה */
  }
`

const ItemCard = styled.div`
  flex: 0 0 150px;
  border: 2px solid #444; /* גבול אפור כהה */
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4); /* צל מעודן */
  background: linear-gradient(145deg, #222, #333); /* מעבר צבעים שחור כהה */
  padding: 1rem;
  font-size: 0.9rem;
  transition:
    transform 0.4s,
    box-shadow 0.4s;
  position: relative;
  z-index: 2; /* וודא שהכרטיס מעל כל תוכן אחר */

  &:hover {
    transform: translateY(-10px); /* תזוזה למעלה */
    box-shadow: 0 8px 20px rgba(255, 0, 0, 0.6); /* צל אדום בעת ההובר */
    z-index: 5; /* מבטיח שהכרטיס יופיע מעל אלמנטים אחרים */
  }
`

const ItemImage = styled.img`
  width: 120px;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  margin-bottom: 0.5rem;
  transition: transform 0.4s;

  ${ItemCard}:hover & {
    transform: rotate(-5deg) scale(1.1);
  }
`

const ItemName = styled.h3`
  font-size: 1.1rem;
  margin: 0.5rem 0;
  color: #fff; /* טקסט לבן */
  text-transform: uppercase;
  letter-spacing: 1px;
`

const ItemDescription = styled.p`
  font-size: 0.8rem;
  color: #aaa; /* טקסט אפור */
  margin: 0.5rem 0;
`

const ItemPrice = styled.p`
  font-size: 1rem;
  font-weight: bold;
  margin: 0.5rem 0;
  color: #ff4d4d; /* צבע אדום */
`
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center; /* ממרכז את הכפתורים */
  gap: 10px; /* רווח בין הכפתורים */
  bottom: 10px;
  margin-top: 0.5rem; /* רווח מעל הכפתורים */
  position: absolute;
  flex-wrap: wrap;
  padding-right: 15px;
  z-index: 1; /* שמירה על הימצאות מעל רקע */
`

const AddButton = styled.button`
  background-color: #ff4d4d; /* אדום בוהק */
  border: none;
  border-radius: 8px;
  padding: 0.4rem 0.8rem;
  margin: 0.3rem;
  font-size: 0.9rem;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #e60000; /* אדום כהה יותר */
  }
`

const ScrollButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #111;
  border: 2px solid #ff4d4d; /* גבול אדום */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  font-size: 1.5rem;
  color: white;
  z-index: 10;

  &:hover {
    background-color: #ff4d4d; /* אדום בוהק */
  }

  ${(props) => (props.left ? "left: 10px;" : "right: 10px;")}
`

const SpiralGallery = ({ categoryName, onAddItem }) => {
  const [menuItems, setMenuItems] = useState([])
  const [selectedItems, setSelectedItems] = useState([]) // מערך של מוצרים שנבחרו
  const [loading, setLoading] = useState(true)
  const carouselRef = useRef(null)

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch(
          `https://cinematech-1.onrender.com/api/v1/menu/${categoryName}`,
          {
            withCredentials: true,
          }
        )

        if (!response.ok) {
          throw new Error("Failed to fetch menu data")
        }

        const data = await response.json()

        if (data && data.items) {
          // מוודאים שהמחיר הוא מספר
          const formattedItems = data.items.map((item) => ({
            ...item,
            price: parseFloat(item.price), // ודא שהמחיר הוא מספר
          }))
          setMenuItems(formattedItems)
        } else {
          console.error("Menu items are missing in the response:", data)
          setMenuItems([])
        }
      } catch (error) {
        console.error("Error fetching menu data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchMenuItems()
  }, [categoryName])

  if (loading) {
    return <div>Loading...</div>
  }

  const handleAdd = (e, item) => {
    e.preventDefault()

    const itemWithId = { ...item, id: item._id || `${item.name}-${Date.now()}` }

    setSelectedItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((i) => i._id === item._id)

      if (existingItemIndex >= 0) {
        return prevItems.map((i, index) =>
          index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        return [...prevItems, { ...itemWithId, quantity: 1 }]
      }
    })

    if (onAddItem) {
      onAddItem({ ...itemWithId, quantity: 1 })
    }
  }

  return (
    <Wrapper>
      <ScrollButton
        left
        onClick={() => (carouselRef.current.scrollLeft -= 300)}
      >
        &#8592;
      </ScrollButton>
      <CarouselContainer ref={carouselRef}>
        {menuItems.map((item, index) => (
          <ItemCard key={index}>
            <ItemImage
              src={item.picture || "/default-image.png"}
              alt={item.name}
            />
            <ItemName>{item.name}</ItemName>
            <ItemDescription>{item.description}</ItemDescription>
            <ButtonContainer>
              <ItemPrice>
                Price: {item.price ? `${item.price.toFixed(2)} ₪` : "N/A"}
              </ItemPrice>
              <div>
                <AddButton onClick={(e) => handleAdd(e, item)}>+</AddButton>
              </div>
            </ButtonContainer>
          </ItemCard>
        ))}
      </CarouselContainer>
      <ScrollButton onClick={() => (carouselRef.current.scrollLeft += 300)}>
        &#8594;
      </ScrollButton>
    </Wrapper>
  )
}

export default SpiralGallery
