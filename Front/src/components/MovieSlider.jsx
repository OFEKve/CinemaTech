import { useEffect, useRef, useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import styled from "styled-components"
import { SMALL_IMG_BASE_URL } from "../utils/constants"
import { ChevronLeft, ChevronRight, Info } from "lucide-react"

const Wrapper = styled.div`
  position: relative;
  background-color: black;
  color: white;
  padding: 0 20px;

  &:hover .arrow {
    display: flex;
  }
`

const Title = styled.h2`
  margin-bottom: 16px;
  font-size: 24px;
  font-weight: bold;
`
const MovieTitle = styled.p`
  margin-bottom: 8px;
  font-size: 16px;
  font-weight: bold;
  text-align: center;
  color: white;
`
const Slider = styled.div`
  display: flex;
  height: 240px;
  gap: 16px;
  overflow-x: auto;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`

const ArrowButton = styled.button`
  display: none;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 48px;
  height: 48px;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;

  &.left {
    left: 20px;
  }
  &.right {
    right: 20px;
  }

  &:hover {
    background: rgba(0, 0, 0, 0.8);
  }
`

const Card = styled(Link)`
  flex: 0 0 255px;
  perspective: 1000px;

  &:hover .content {
    transform: rotateY(180deg);
  }
`

const Content = styled.div`
  position: relative;
  height: 150px;
  width: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s ease-in-out;
`

const FrontSide = styled.div`
  position: absolute;
  inset: 0;
  backface-visibility: hidden;
  img {
    width: 100%;
    height: 100%;
    border-radius: 8px;
  }
`

const BackSide = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: black;
  color: white;
  backface-visibility: hidden;
  transform: rotateY(180deg);
  border-radius: 8px;

  p {
    margin-bottom: 16px;
    text-align: center;
    font-size: 18px;
    font-weight: bold;
  }

  a {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    background: rgba(128, 128, 128, 0.5);
    border-radius: 8px;
    color: white;
    text-decoration: none;

    &:hover {
      background: rgba(128, 128, 128, 0.8);
    }

    svg {
      margin-right: 8px;
    }
  }
`

const MovieSlider = ({ category }) => {
  const contentType = "movie" // Force contentType to "movie"
  const [content, setContent] = useState([])
  const sliderRef = useRef(null)

  const formattedCategoryName =
    category.replaceAll("_", " ")[0].toUpperCase() +
    category.replaceAll("_", " ").slice(1)

  useEffect(() => {
    const getContent = async () => {
      const res = await axios.get(
        `http://localhost:3000/api/v1/${contentType}/${category}`,
        {
          withCredentials: true,
        }
      )

      setContent(res.data.content)
    }

    getContent()
  }, [contentType, category])

  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({
        left: -sliderRef.current.offsetWidth,
        behavior: "smooth",
      })
    }
  }

  const scrollRight = () => {
    sliderRef.current.scrollBy({
      left: sliderRef.current.offsetWidth,
      behavior: "smooth",
    })
  }

  return (
    <Wrapper>
      <Title>{formattedCategoryName} Movies</Title>
      <Slider ref={sliderRef}>
        {content.map((item) => (
          <Card to={`/watch/${item.id}`} key={item.id}>
            <MovieTitle>{item.title || item.name}</MovieTitle>

            <Content className="content">
              <FrontSide>
                <img
                  src={SMALL_IMG_BASE_URL + item.backdrop_path}
                  alt="Movie image"
                />
              </FrontSide>
              <BackSide>
                <p>{item.title || item.name}</p>
                <Link to={`/watch/${item.id}`}>
                  <Info size={20} />
                  More Details
                </Link>
              </BackSide>
            </Content>
          </Card>
        ))}
      </Slider>
      <ArrowButton className="arrow left" onClick={scrollLeft}>
        <ChevronLeft size={24} />
      </ArrowButton>
      <ArrowButton className="arrow right" onClick={scrollRight}>
        <ChevronRight size={24} />
      </ArrowButton>
    </Wrapper>
  )
}

export default MovieSlider
