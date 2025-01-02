import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {},
  alias: {
    "react-qr-code": "node_modules/react-qr-code/dist/index.esm.js",
  },
})
