import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronRight } from "lucide-react"

const AuthScreen = () => {
  const [email, setEmail] = useState("")
  const navigate = useNavigate()

  const handleFormSubmit = (e) => {
    e.preventDefault()
    navigate("/signup?email=" + email)
  }

  return (
    <div className="hero-bg relative">
      {/* Navbar */}
      <header className="flex w-full items-center justify-between px-4 py-2">
        <img
          src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410637/videos/images/zqjtfyt3ssnhmszf6ope.png"
          alt=" Logo"
          className="w-32 md:w-52"
        />
        <Link
          to={"/login"}
          className="flex h-10 w-20 items-center justify-center rounded bg-red-600 text-center text-white"
        >
          Sign In
        </Link>
      </header>

      {/* hero section */}
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center py-5 text-center text-white">
        <h1 className="mb-4 text-4xl font-bold md:text-6xl">
          Book tickets for the latest releases in just a few clicks.{" "}
        </h1>
        <p className="mb-4 text-lg">Discover the Magic of Movies Near You!</p>
        <p className="mb-4">
          Ready to watch? Enter your email to create or restart your membership.
        </p>

        <form
          className="flex w-1/2 flex-col gap-4 md:flex-row"
          onSubmit={handleFormSubmit}
        >
          <input
            type="email"
            placeholder="Email address"
            className="flex-1 rounded border border-gray-700 bg-black/80 p-2"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button className="flex items-center justify-center rounded bg-red-600 px-2 py-1 text-xl md:py-2 lg:px-6 lg:text-2xl">
            Get Started
            <ChevronRight className="size-8 md:size-10" />
          </button>
        </form>
      </div>

      {/* separator */}
      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      {/* 1st section */}
      <div className="bg-black py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 md:flex-row md:px-2">
          {/* left side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Browse latest movies
            </h2>
            <p className="text-lg md:text-xl">
              Catch the latest blockbusters and fan favorites playing near you!
            </p>
          </div>
          {/* right side */}
          <div className="relative flex-1">
            <img
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410624/videos/images/ctagatqijheaaik85ids.png"
              alt="Tv image"
              className="relative z-20 mt-4"
            />
            <video
              className="absolute left-1/2 top-1/2 z-10 h-1/2 -translate-x-1/2 -translate-y-1/2"
              style={{ width: "80%" }}
              playsInline
              autoPlay
              muted
              loop
            >
              <source
                src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736333398/videos/b9l8ukmknd2mkgtkm7rz.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>

      {/* separator */}
      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      {/* 2nd section */}
      <div className="bg-black py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-center px-4 md:flex-row md:px-2">
          {/* left side */}
          <div className="relative flex-1">
            <div className="relative">
              <div className="relative flex-1">
                <img
                  src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410624/videos/images/ctagatqijheaaik85ids.png"
                  alt="Tv image"
                  className="relative z-20 mt-4"
                />
                <video
                  className="absolute left-1/2 top-1/2 z-10 h-1/2 -translate-x-1/2 -translate-y-1/2"
                  playsInline
                  autoPlay
                  muted
                  loop
                >
                  <source
                    src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736410903/videos/idgqgl8lxv1eexfcbact.mp4"
                    type="video/mp4"
                  />
                </video>
              </div>
            </div>
          </div>
          {/* right side */}

          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-balance text-4xl font-extrabold md:text-5xl">
              Make Your Movie Experience Delicious!
            </h2>
            <p className="text-lg md:text-xl">
              Grab your favorite snacks, from buttery popcorn to nachos with
              cheesy dip.
            </p>
          </div>
        </div>
      </div>

      {/* separator */}

      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      {/* 3rd section */}
      <div className="bg-black py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center px-4 md:flex-row md:px-2">
          {/* left side */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Never Miss a Moment!{" "}
            </h2>
            <p className="text-lg md:text-xl">
              Book early and lock in the best views before they're gone.
            </p>
          </div>

          {/* right side */}
          <div className="relative flex-1">
            <img
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410636/videos/images/mjuseapxrjgry2h5dvp2.png"
              alt="Device image"
              className="relative z-20 mt-4"
            />
            <video
              className="absolute left-1/2 top-2 z-10 h-3/6 max-w-[62%] -translate-x-1/2"
              playsInline
              autoPlay={true}
              muted
              loop
            >
              <source
                src="https://res.cloudinary.com/duucxuyvk/video/upload/v1736333422/videos/boswltxayuhlqujjmubp.mp4"
                type="video/mp4"
              />
            </video>
          </div>
        </div>
      </div>

      <div className="h-2 w-full bg-[#232323]" aria-hidden="true" />

      {/* 4th section*/}
      <div className="bg-black py-10 text-white">
        <div className="mx-auto flex max-w-6xl flex-col-reverse items-center justify-center px-4 md:flex-row md:px-2">
          {/* left */}
          <div className="relative flex-1">
            <img
              src="https://res.cloudinary.com/duucxuyvk/image/upload/v1736410638/videos/images/kxb86bija6rquk7xvnim.png"
              alt="Enjoy on your TV"
              className="mt-4"
            />
          </div>
          {/* right */}
          <div className="flex-1 text-center md:text-left">
            <h2 className="mb-4 text-4xl font-extrabold md:text-5xl">
              Fast, Easy, Secure.{" "}
            </h2>
            <p className="text-lg md:text-xl">
              Enjoy a smooth and secure checkout experience every time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
export default AuthScreen
