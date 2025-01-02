import React from "react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../../store/authUser"
import styled from "styled-components"

const HeroBg = styled.div`
  height: 100vh;
  width: 100%;

  background: url("/hero.png") no-repeat center center/cover;
`

const Header = styled.header`
  max-width: 960px;
  margin: 0 auto;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const Logo = styled.img`
  width: 150px;
`

const FormContainer = styled.div`
  margin: 50px auto;
  display: flex;
  justify-content: center;
  align-items: center;
`

const FormBox = styled.div`
  background: rgba(0, 0, 0, 0.6);
  border-radius: 10px;
  padding: 32px;
  max-width: 400px;
  width: 100%;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.5);
`

const FormTitle = styled.h1`
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  color: white;
  margin-bottom: 16px;
`

const FormGroup = styled.div`
  margin-bottom: 16px;
`

const FormLabel = styled.label`
  display: block;
  font-size: 14px;
  color: #ccc;
  margin-bottom: 8px;
`

const FormInput = styled.input`
  width: 100%;
  padding: 8px;
  border-radius: 5px;
  border: 1px solid #555;
  background-color: transparent;
  color: white;
  font-size: 14px;
`

const FormButton = styled.button`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  border: none;
  background-color: #e50914;
  color: white;
  font-size: 16px;
  cursor: pointer;
  font-weight: bold;
  &:hover {
    background-color: #d40813;
  }
`

const FormFooter = styled.div`
  text-align: center;
  color: #ccc;
  font-size: 14px;
  margin-top: 16px;
`

const LinkStyled = styled(Link)`
  color: #e50914;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`

const LoginPage = () => {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const { login } = useAuthStore()

  const handleSignUp = (e) => {
    e.preventDefault()
    login({ email, password })
  }

  return (
    <HeroBg>
      <Header>
        <Link to="/">
          <Logo src="/netflix-logo.png" alt="logo" />
        </Link>
      </Header>

      <FormContainer>
        <FormBox>
          <FormTitle>Login</FormTitle>
          <form onSubmit={handleSignUp}>
            <FormGroup>
              <FormLabel htmlFor="email">Email</FormLabel>
              <FormInput
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormGroup>

            <FormGroup>
              <FormLabel htmlFor="password">Password</FormLabel>
              <FormInput
                type="password"
                id="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormGroup>
            <FormButton>Login</FormButton>
          </form>
          <FormFooter>
            Don't have an account? <LinkStyled to="/signup">Sign Up</LinkStyled>
            <br />
            Forgot your password?{" "}
            <LinkStyled to="/forgetpassword">Reset Password</LinkStyled>
          </FormFooter>
        </FormBox>
      </FormContainer>
    </HeroBg>
  )
}

export default LoginPage
