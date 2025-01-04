const Footer = () => {
  return (
    <footer className="border-t border-gray-800 bg-black py-6 text-white md:px-8 md:py-0">
      <div className="flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
        <p className="text-muted-foreground text-balance text-center text-sm leading-loose md:text-left">
          ©{" "}
          <a
            target="_blank"
            className="font-medium underline underline-offset-4"
          >
            Ofek Vegas & Shmuel Zimmer , 2024
          </a>
        </p>
      </div>
    </footer>
  )
}
export default Footer
