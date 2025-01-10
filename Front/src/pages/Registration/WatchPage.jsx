import { useEffect, useRef, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useContentStore } from "../../store/content"
import axios from "axios"
import Navbar from "../../components/Navbar"
import { ChevronLeft, ChevronRight } from "lucide-react"
import ReactPlayer from "react-player"
import {
  ORIGINAL_IMG_BASE_URL,
  SMALL_IMG_BASE_URL,
} from "../../utils/constants"
import { formatReleaseDate } from "../../utils/dateFunction"
import WatchPageSkeleton from "../../components/skeletons/WatchPageSkeleton"
import ProgressBar from "../../components/Components/ProgressBar"
import styled from "styled-components"
const EmptyContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 80px); /* מניח שגובה ה-Navbar הוא 80px */
  text-align: center;
  background: linear-gradient(135deg, #1e1e2f, #2a2a3e);
  padding: 20px;
  color: white;
`

const SadEmoji = styled.div`
  font-size: 80px;
  animation: bounce 2s infinite;
  margin-bottom: 20px;

  @keyframes bounce {
    0%,
    100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`

const Message = styled.p`
  font-size: 18px;
  line-height: 1.6;
  color: #d1d1d1;
  max-width: 600px;
  margin-bottom: 20px;
`

const HomeButton = styled.button`
  padding: 12px 24px;
  font-size: 16px;
  font-weight: bold;
  background: linear-gradient(45deg, #ff5722, #e91e63);
  color: white;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(45deg, #e91e63, #ff5722);
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  }

  &:active {
    transform: scale(0.95);
  }
`

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: black;
  color: white;
`

const ContentContainer = styled.div`
  container: auto;
  height: 100%;
  padding: 4rem 1rem;
`
const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1.75rem;
  max-width: 6xl;
  margin: auto;
  margin-top: 6rem; /* מרווח עליון כדי להרחיק מה-Navbar */
  @media (min-width: 768px) {
    flex-direction: row;
  }
`
const StyledButton = styled.button`
  margin-top: 2rem;
  background: linear-gradient(45deg, #ff5722, #e91e63);
  color: white;
  padding: 0.75rem 2rem;
  font-size: 1.25rem;
  font-weight: bold;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    background: linear-gradient(45deg, #e91e63, #ff5722);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.5);
    transform: translateY(-3px);
  }

  &:active {
    transform: translateY(1px);
  }
`

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const Title = styled.h2`
  font-size: 36px;
  font-weight: bold;
  text-align: center;
  text-shadow:
    2px 4px 6px rgba(0, 0, 0, 0.7),
    0 0 10px rgba(255, 255, 255, 0.5);
  letter-spacing: 2px;
  color: white;
  margin-bottom: 20px;
  height: 50px; /* גובה קבוע לשם הסרט */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden; /* במידה והטקסט ארוך מדי */
  text-overflow: ellipsis; /* לחתוך עם שלוש נקודות במקרה הצורך */
  white-space: nowrap; /* למנוע ירידת שורה */
`

const Subtitle = styled.p`
  margin-top: 0.5rem;
  font-size: 1.125rem;
`

const Overview = styled.p`
  font-size: 18px;
  line-height: 1.5;
  text-align: justify;
  margin-top: 1rem;
  max-height: 150px; /* גובה קבוע לתיאור */
  overflow: hidden; /* למנוע גלישה */
  text-overflow: ellipsis; /* לחתוך עם שלוש נקודות */
  padding: 10px;
  background: rgba(0, 0, 0, 0.5); /* רקע כדי להבליט את התיאור */
  border-radius: 8px; /* פינות מעוגלות */
`

const PosterImage = styled.img`
  max-height: 400px;
  border-radius: 0.5rem;
`

const VideoWrapper = styled.div`
  .video-tv-wrapper {
    position: relative;
    width: 400px;
    height: 300px;
    margin: auto;
  }

  .tv-frame {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-inside-tv {
    position: absolute;
    top: 12%;
    left: 10%;
    width: 78%;
    height: 70%;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    border-radius: 8px;
  }
`

const SimilarMoviesContainer = styled.div`
  margin-top: 3rem;
  max-width: 5xl;
  margin: auto;
  position: relative;
`

const SimilarMoviesHeader = styled.h3`
  margin-bottom: 1rem;
  font-size: 1.875rem;
  font-weight: bold;
`

const SimilarMoviesSlider = styled.div`
  display: flex;
  gap: 1rem;
  overflow-x: scroll;
  padding-bottom: 1rem;
  scrollbar-width: none;
  &::-webkit-scrollbar {
    display: none;
  }
`

const SimilarMovieCard = styled(Link)`
  width: 13rem;
  flex: none;
  img {
    width: 100%;
    border-radius: 0.5rem;
  }
  h4 {
    margin-top: 0.5rem;
    font-size: 1.125rem;
    font-weight: 600;
  }
`

const ArrowButton = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-color: #4b5563;
  color: white;
  border-radius: 9999px;
  padding: 0.5rem;
  &:hover {
    background-color: #374151;
  }
`

const WatchPage = () => {
  const { id } = useParams()
  const [trailers, setTrailers] = useState([])
  const [currentTrailerIdx, setCurrentTrailerIdx] = useState(0)
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({})
  const [similarContent, setSimilarContent] = useState([])
  const { contentType } = useContentStore()
  const navigate = useNavigate()
  const sliderRef = useRef(null)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const getTrailers = async () => {
      try {
        const res = await axios.get(
          `https://cinematech-1.onrender.com/api/v1/${contentType}/${id}/trailers`,
          { withCredentials: true }
        )
        setTrailers(res.data.trailers)
      } catch (error) {
        console.error("Error fetching trailers:", error)
        setTrailers([])
      }
    }

    getTrailers()
  }, [contentType, id])

  useEffect(() => {
    const getSimilarContent = async () => {
      try {
        const res = await axios.get(
          `https://cinematech-1.onrender.com/api/v1/${contentType}/${id}/similar`,
          { withCredentials: true }
        )
        setSimilarContent(res.data.similar)
      } catch (error) {
        console.error("Error fetching similar content:", error)
        setSimilarContent([])
      }
    }

    getSimilarContent()
  }, [contentType, id])

  useEffect(() => {
    const getContentDetails = async () => {
      try {
        const res = await axios.get(
          `https://cinematech-1.onrender.com/api/v1/${contentType}/${id}/details`,
          { withCredentials: true }
        )
        setContent(res.data.content)
      } catch (error) {
        console.error("Error fetching content details:", error)
        setContent(null)
      } finally {
        setLoading(false)
      }
    }

    getContentDetails()
  }, [contentType, id])

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

  if (loading) {
    return (
      <PageContainer>
        <WatchPageSkeleton />
      </PageContainer>
    )
  }

  if (!content) {
    return (
      <PageContainer>
        <Navbar />
        <EmptyContentContainer>
          <SadEmoji>😥</SadEmoji>
          <Title>No Content Found</Title>
          <Message>
            Sorry, we couldn't find the content you're looking for. <br />
            Please try searching again or explore our homepage.
          </Message>
          <HomeButton onClick={() => navigate("/")}>Back to Home</HomeButton>
        </EmptyContentContainer>
      </PageContainer>
    )
  }

  const goToNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => prevStep + 1)
    }
  }

  return (
    <PageContainer>
      <ContentContainer>
        <Navbar />

        <MainContent>
          <div>
            <Title>{content?.title || content?.name}</Title>
            <Subtitle>
              {formatReleaseDate(
                content?.release_date || content?.first_air_date
              )}{" "}
              |{" "}
              {content?.adult ? (
                <span style={{ color: "#dc2626" }}>18+</span>
              ) : (
                <span style={{ color: "#16a34a" }}>PG-13</span>
              )}
            </Subtitle>
            <Overview>{content?.overview}</Overview>
            <ButtonContainer>
              <StyledButton
                onClick={() => {
                  goToNextStep()
                  navigate(`/seat/${id}`, {
                    state: {
                      movieName: content?.title || content?.name,
                      movieImage: ORIGINAL_IMG_BASE_URL + content?.poster_path,
                    },
                  })
                }}
              >
                Select Seats
              </StyledButton>
            </ButtonContainer>
          </div>
          <PosterImage
            src={
              content?.poster_path
                ? ORIGINAL_IMG_BASE_URL + content?.poster_path
                : "/default-poster.png"
            }
            alt="Poster image"
          />
          <div>
            <VideoWrapper>
              <div className="video-tv-wrapper">
                <img
                  src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410624/videos/images/ctagatqijheaaik85ids.png"
                  alt="TV Frame"
                  className="tv-frame"
                />
                <div className="video-inside-tv">
                  {trailers.length > 0 ? (
                    <ReactPlayer
                      controls
                      width="91%"
                      height="75%"
                      className="react-player"
                      url={`https://www.youtube.com/watch?v=${trailers[currentTrailerIdx]?.key}`}
                    />
                  ) : (
                    <img
                      src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410638/videos/images/zylsgwqrrs5naz8yc6qi.png"
                      alt="No trailers available"
                      style={{
                        width: "90%",
                        height: "75%",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  )}
                </div>
              </div>
            </VideoWrapper>
          </div>
        </MainContent>

        <ProgressBar currentStep={currentStep} />

        {similarContent.length > 0 && (
          <SimilarMoviesContainer>
            <SimilarMoviesHeader>Similar Movies</SimilarMoviesHeader>
            <SimilarMoviesSlider ref={sliderRef}>
              {similarContent.map((content) => {
                if (!content.poster_path) return null
                return (
                  <SimilarMovieCard
                    key={content.id}
                    to={`/watch/${content.id}`}
                  >
                    <img
                      src={SMALL_IMG_BASE_URL + content.poster_path}
                      alt="Poster path"
                    />
                    <h4>{content.title || content.name}</h4>
                  </SimilarMovieCard>
                )
              })}
            </SimilarMoviesSlider>
            <ArrowButton style={{ left: 0 }} onClick={scrollLeft}>
              <ChevronLeft size={24} />
            </ArrowButton>
            <ArrowButton style={{ right: 0 }} onClick={scrollRight}>
              <ChevronRight size={24} />
            </ArrowButton>
          </SimilarMoviesContainer>
        )}
      </ContentContainer>
    </PageContainer>
  )
}

export default WatchPage
