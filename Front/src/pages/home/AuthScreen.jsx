import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import styled from "styled-components"

// Styled Components
const HeroBg = styled.div`
  position: relative;
  background-image: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.1)),
    url("https://res.cloudinary.com/duucxuyvk/image/upload/v1736410637/videos/images/hero.jpg");
`

const Header = styled.header`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
`

const Logo = styled.img`
  width: 8rem;
  @media (min-width: 768px) {
    width: 13rem;
  }
`

const SignInButton = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 2.5rem;
  width: 5rem;
  background-color: #dc2626;
  border-radius: 0.25rem;
  text-align: center;
  color: white;
`

const HeroSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 80rem;
  margin: auto;
  padding: 1.25rem;
  text-align: center;
  color: white;
`

const Title = styled.h1`
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: bold;
  @media (min-width: 768px) {
    font-size: 3rem;
  }
`

const Subtitle = styled.p`
  margin-bottom: 1rem;
  font-size: 1.125rem;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 50%;
  gap: 1rem;
  @media (min-width: 768px) {
    flex-direction: row;
  }
`

const EmailInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: 1px solid #4b5563;
  background-color: rgba(0, 0, 0, 0.8);
  color: white;
`

const GetStartedButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1rem;
  font-size: 1.25rem;
  background-color: #dc2626;
  border-radius: 0.25rem;
  color: white;
  gap: 0.5rem;

  @media (min-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1.5rem;
  }
`

const Separator = styled.div`
  height: 0.5rem;
  width: 100%;
  background-color: #232323;
`

const Section = styled.div`
  background-color: black;
  padding: 2.5rem 0;
  color: white;
`

const SectionContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 80rem;
  margin: auto;
  padding: 0 1rem;

  @media (min-width: 768px) {
    flex-direction: ${(props) => (props.$reverse ? "row-reverse" : "row")};
  }
`

const SectionText = styled.div`
  flex: 1;
  text-align: center;
  @media (min-width: 768px) {
    text-align: left;
  }
`

const SectionTitle = styled.h2`
  margin-bottom: 1rem;
  font-size: 2rem;
  font-weight: 800;
  @media (min-width: 768px) {
    font-size: 2.5rem;
  }
`

const SectionDescription = styled.p`
  font-size: 1.125rem;
  @media (min-width: 768px) {
    font-size: 1.25rem;
  }
`

const SectionImageWrapper = styled.div`
  flex: 1;
  position: relative;
`

const SectionImage = styled.img`
  margin-top: 1rem;
  position: relative;
  z-index: 1;
  width: 100%;
`

const SectionVideo = styled.video`
  position: absolute;
  top: ${(props) => props.$top || "50%"};
  left: 50%;
  width: ${(props) => props.$width || "80%"};
  height: ${(props) => props.$height || "75%"};
  transform: translate(-50%, -50%);
  z-index: 0;
`

const AuthScreen = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    navigate("/signup?email=" + email)
  }

  return (
    <HeroBg>
      <Header>
        <Logo
          src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410637/videos/images/zqjtfyt3ssnhmszf6ope.png"
          alt="Logo"
        />
        <SignInButton to="/login">Sign In</SignInButton>
      </Header>

      <HeroSection>
        <Title>
          Book tickets for the latest releases in just a few clicks.
        </Title>
        <Subtitle>Discover the Magic of Movies Near You!</Subtitle>
        <Subtitle>
          Ready to watch? Enter your email to create or restart your membership.
        </Subtitle>
        <Form onSubmit={handleFormSubmit}>
          <EmailInput
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <GetStartedButton type="submit">
            Get Started <ChevronRight size={24} />
          </GetStartedButton>
        </Form>
      </HeroSection>

      <Separator />

      {/* First Section */}
      <Section>
        <SectionContent>
          <SectionText>
            <SectionTitle>Browse latest movies</SectionTitle>
            <SectionDescription>
              Catch the latest blockbusters and fan favorites playing near you!
            </SectionDescription>
          </SectionText>
          <SectionImageWrapper>
            <SectionImage
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410624/videos/images/ctagatqijheaaik85ids.png"
              alt="TV"
            />
            <SectionVideo autoPlay muted loop>
              <source src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736333398/videos/b9l8ukmknd2mkgtkm7rz.mp4" />
            </SectionVideo>
          </SectionImageWrapper>
        </SectionContent>
      </Section>

      <Separator />

      {/* Second Section */}
      <Section>
        <SectionContent $reverse>
          <SectionText>
            <SectionTitle>Make Your Movie Experience Delicious!</SectionTitle>
            <SectionDescription>
              Grab your favorite snacks, from buttery popcorn to nachos with
              cheesy dip.
            </SectionDescription>
          </SectionText>
          <SectionImageWrapper>
            <SectionImage
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410624/videos/images/ctagatqijheaaik85ids.png"
              alt="TV"
            />
            <SectionVideo autoPlay muted loop>
              <source src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736410903/videos/idgqgl8lxv1eexfcbact.mp4" />
            </SectionVideo>
          </SectionImageWrapper>
        </SectionContent>
      </Section>

      <Separator />

      {/* Third Section */}
      <Section>
        <SectionContent>
          <SectionText>
            <SectionTitle>Never Miss a Moment!</SectionTitle>
            <SectionDescription>
              Book early and lock in the best views before they're gone.
            </SectionDescription>
          </SectionText>
          <SectionImageWrapper>
            <SectionImage
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/mjuseapxrjgry2h5dvp2.png"
              alt="Device"
            />
            <SectionVideo
              $top="36%"
              $width="65%"
              $height="54%"
              autoPlay
              muted
              loop
            >
              <source src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736333422/videos/boswltxayuhlqujjmubp.mp4" />
            </SectionVideo>
          </SectionImageWrapper>
        </SectionContent>
      </Section>

      <Separator />

      {/* Fourth Section */}
      <Section>
        <SectionContent $reverse>
          <SectionText>
            <SectionTitle>Fast, Easy, Secure.</SectionTitle>
            <SectionDescription>
              Enjoy a smooth and secure checkout experience every time.
            </SectionDescription>
          </SectionText>
          <SectionImageWrapper>
            <SectionImage
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410638/videos/images/kxb86bija6rquk7xvnim.png"
              alt="Enjoy on your TV"
            />
          </SectionImageWrapper>
        </SectionContent>
      </Section>
    </HeroBg>
  )
}

export default AuthScreen
