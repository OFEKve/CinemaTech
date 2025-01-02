import React from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authUser.js"
import styled from "styled-components"

const Container = styled.div`
  background: url("/hero.png") no-repeat center center/cover;
  background-size: cover;
  background-position: center;
  height: 100vh;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Header = styled.header`
  width: 100%;
  max-width: 1200px;
  display: flex;
  justify-content: space-between;
  padding: 16px;
  position: absolute;
  top: 0;
`

const Logo = styled.img`
  width: 150px;
  cursor: pointer;
`

const FormContainer = styled.div`
  background-color: rgba(0, 0, 0, 0.6);
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  width: 100%;
  text-align: center;
`

const Title = styled.h1`
  color: white;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 16px;
`

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin: 8px 0;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: transparent;
  color: white;
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: #ff6f61;
    box-shadow: 0 0 4px rgba(255, 111, 97, 0.8);
  }
`

const Button = styled.button`
  width: 100%;
  padding: 12px;
  margin-top: 16px;
  border: none;
  border-radius: 4px;
  background-color: #ff6f61;
  color: white;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e55b50;
  }
`

const FooterText = styled.div`
  margin-top: 16px;
  color: gray;
  font-size: 14px;

  a {
    color: #ff6f61;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`

const SignUpPage = () => {
  const { searchParams } = new URL(document.location)
  const emailvalue = searchParams.get("email")
  const [email, setEmail] = React.useState(emailvalue || "")
  const [password, setPassword] = React.useState("")
  const [username, setUsername] = React.useState("")
  const [phone, setPhone] = React.useState("")

  const { signup } = useAuthStore()

  const handleSignUp = (e) => {
    e.preventDefault()
    signup({ username, email, password, phone })
  }

  return (
    <Container>
      <Header>
        <Link to={"/"}>
          <Logo src="/netflix-logo.png" alt="logo" />
        </Link>
      </Header>

      <FormContainer>
        <Title>Sign Up</Title>
        <form onSubmit={handleSignUp}>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <Input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit">Sign Up</Button>
        </form>
        <FooterText>
          Already a member? <Link to={"/login"}>Sign in</Link>
        </FooterText>
      </FormContainer>
    </Container>
  )
}

export default SignUpPage
