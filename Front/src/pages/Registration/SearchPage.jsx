import { useState } from "react"
import styled from "styled-components"
import Navbar from "../../components/Navbar"
import { Search } from "lucide-react"
import { toast } from "react-toastify"
import axios from "axios"
import { ORIGINAL_IMG_BASE_URL } from "../../utils/constants"
import { useNavigate } from "react-router-dom"

const PageWrapper = styled.div`
  display: flex;
  min-height: 100vh;
  align-items: center;
  justify-content: center;
  background-color: black;
  color: white;
`

const Container = styled.div`
  margin-top: 180px; /* מרווח עליון נוסף */
  padding: 2rem;
  text-align: center;
`

const Form = styled.form`
  margin: 0 auto 2rem auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 400px;
`

const Input = styled.input`
  width: 100%;
  padding: 0.5rem;
  background-color: #2d3748;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;

  &::placeholder {
    color: #a0aec0;
  }
`

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #c53030;
  }

  svg {
    margin-right: 0.5rem;
  }
`

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`

const ResultCard = styled.div`
  cursor: pointer;
  background-color: #2d3748;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;

  img {
    width: 100%;
    border-radius: 0.5rem;
  }

  h2 {
    margin-top: 0.5rem;
    font-size: 1.25rem;
    font-weight: bold;
    color: white;
  }
`

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [results, setResults] = useState([])
  const navigate = useNavigate()

  const handleSearch = async (e) => {
    e.preventDefault()

    if (!searchTerm.trim()) {
      toast.error("Please enter a search term.")
      return
    }

    try {
      const res = await axios.get(
        `https://cinematech-1.onrender.com/api/v1/search/movie/${searchTerm}`,
        { withCredentials: true }
      )

      if (res.data.content.length === 0) {
        toast.error("Nothing found, please try a different search.")
      } else {
        setResults(res.data.content)
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("Nothing found, please try a different search.")
      } else {
        toast.error("An error occurred, please try again later.")
      }
    }
  }

  const handleNavigate = (id) => {
    try {
      navigate(`/watch/${id}`)
    } catch (error) {
      toast.error("Failed to navigate. Please try again later.")
      console.error("Navigation error:", error)
    }
  }

  return (
    <PageWrapper>
      <Navbar />
      <Container>
        <Form onSubmit={handleSearch}>
          <Input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search for a movie"
          />
          <Button type="submit">
            <Search size={16} /> Search
          </Button>
        </Form>

        <ResultsGrid>
          {results
            .filter((result) => result.poster_path)
            .map((result) => (
              <ResultCard
                key={result.id}
                onClick={() => handleNavigate(result.id)}
              >
                <img
                  src={ORIGINAL_IMG_BASE_URL + result.poster_path}
                  alt={result.title || "Movie Poster"}
                />
                <h2>{result.title || "Unknown Title"}</h2>
              </ResultCard>
            ))}
        </ResultsGrid>
      </Container>
    </PageWrapper>
  )
}

export default SearchPage
