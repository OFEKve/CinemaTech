import { useState } from "react"
import { Link } from "react-router-dom"
import styled from "styled-components"
import { LogOut, Menu, Search } from "lucide-react"
import { useAuthStore } from "../store/authUser"
import { useContentStore } from "../store/content"

const Header = styled.header`
  padding: 0.1rem;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 50;
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  background-color: rgba(0, 0, 0, 0.1);
  padding: 0 1rem;
`

const Logo = styled.img`
  width: 8rem;
  @media (min-width: 640px) {
    width: 10rem;
  }
`

const NavLinks = styled.div`
  display: none;
  gap: 1rem;
  align-items: center;
  @media (min-width: 640px) {
    display: flex;
  }
`

const NavLink = styled(Link)`
  &:hover {
    text-decoration: underline;
  }
`

const UserActions = styled.div`
  z-index: 50;
  display: flex;
  gap: 1rem;
  align-items: center;
`

const Avatar = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  border: 2px solid #ffc107;
  object-fit: cover;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`

const MobileMenu = styled.div`
  position: absolute;
  left: 0;
  top: 5rem;
  z-index: 40;
  width: 100%;
  background: linear-gradient(to right, #1f2937, #111827);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  @media (min-width: 640px) {
    display: none;
  }
`

const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`

const MobileNavLink = styled(Link)`
  display: block;
  padding: 0.5rem 1rem;
  text-align: center;
  background-color: #2d3748;
  color: white;
  border-radius: 0.5rem;
  transition: all 0.3s;
  &:hover {
    background-color: #1f2937;
    color: #fbbf24;
  }
`

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuthStore()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)

  const { setContentType } = useContentStore()

  return (
    <Header>
      <div className="flex items-center gap-8">
        <Link to="/">
          <Logo src="/netflix-logo.png" alt="Netflix Logo" />
        </Link>
        <NavLinks>
          {user?.isAdmin && (
            <NavLink to="/admin/dashboard">Admin Dashboard</NavLink>
          )}
          <NavLink to="/" onClick={() => setContentType("movie")}>
            Movies
          </NavLink>
          <NavLink to="/tickets">My Tickets</NavLink>
        </NavLinks>
      </div>

      <UserActions>
        <Link to="/search">
          <Search className="size-6 cursor-pointer text-white" />
        </Link>
        <Avatar src={user.image} alt="Avatar" />
        <LogOut className="size-6 cursor-pointer text-white" onClick={logout} />
        <Menu
          className="size-6 cursor-pointer text-white sm:hidden"
          onClick={toggleMobileMenu}
        />
      </UserActions>

      {isMobileMenuOpen && (
        <MobileMenu>
          <MobileNav>
            <MobileNavLink
              to="/"
              onClick={() => {
                toggleMobileMenu()
                setContentType("movie")
              }}
            >
              Movies
            </MobileNavLink>
            <MobileNavLink to="/tickets" onClick={toggleMobileMenu}>
              Tickets Shows
            </MobileNavLink>
            {user?.isAdmin && (
              <MobileNavLink to="/admin/dashboard" onClick={toggleMobileMenu}>
                Admin Dashboard
              </MobileNavLink>
            )}
          </MobileNav>
        </MobileMenu>
      )}
    </Header>
  )
}

export default Navbar
