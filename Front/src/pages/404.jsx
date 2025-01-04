import { Link } from "react-router-dom"
import styled, { keyframes } from "styled-components"

// אנימציות
const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const buttonPulse = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 6px 20px rgba(255, 0, 0, 0.6);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
  }
`

// עיצוב מותאם
const NotFoundWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background:
    linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)),
    url("/404.png") no-repeat center center/cover;
  color: white;
  text-align: center;
  padding: 20px;
`

const Header = styled.header`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  padding: 20px;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
`

const Content = styled.main`
  z-index: 10;
  animation: ${fadeIn} 0.8s ease-out;

  h1 {
    font-size: 3.5rem;
    margin-bottom: 20px;
    text-shadow: 0 4px 10px rgba(0, 0, 0, 0.7);
    background: linear-gradient(90deg, #ff4d4d, #ff8c42);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    font-size: 1.3rem;
    margin-bottom: 30px;
    max-width: 600px;
    line-height: 1.6;
    color: #f5f5f5;
  }
`

const HomeButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(45deg, #ff4d4d, #ff8c42);
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  text-decoration: none;
  box-shadow: 0 4px 15px rgba(255, 0, 0, 0.4);
  transition: all 0.3s ease;
  animation: ${buttonPulse} 2s infinite;

  &:hover {
    background: linear-gradient(45deg, #ff6f61, #ff4d4d);
    transform: scale(1.1);
  }
`

const NotFoundPage = () => {
  return (
    <NotFoundWrapper>
      <Content>
        <h1>Oops! Page Not Found</h1>
        <p>
          It seems the page you're looking for doesn't exist. But don’t worry,
          we’ve got plenty more to explore! Click the button below to head back
          to the CinemaTech home page.
        </p>
        <HomeButton to={"/"}>Go Back Home</HomeButton>
      </Content>
    </NotFoundWrapper>
  )
}

export default NotFoundPage
