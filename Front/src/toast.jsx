import React from "react"
import styled, { keyframes } from "styled-components"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

// אנימציות כניסה ויציאה
const fadeInZoom = keyframes`
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  60% {
    transform: scale(1.1);
    opacity: 1;
  }
  100% {
    transform: scale(1);
  }
`

const fadeOutZoom = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  40% {
    transform: scale(1.1);
    opacity: 0.5;
  }
  100% {
    transform: scale(0.8);
    opacity: 0;
  }
`

// אנימציה לפס התקדמות
const progressBarShimmer = keyframes`
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
`

// ToastContainer מותאם אישית
const StyledToastContainer = styled(ToastContainer).attrs({
  autoClose: 1200, // התראה תיסגר אחרי 1.2 שניות
  position: "top-center",
  hideProgressBar: false,
  newestOnTop: true,
  closeOnClick: true,
  rtl: false,
  pauseOnFocusLoss: false,
  draggable: true,
  pauseOnHover: false,
  theme: "dark",
})`
  .Toastify__toast {
    border-radius: 12px;
    padding: 16px;
    font-size: 16px;
    font-weight: 500;
    margin-bottom: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
    animation:
      ${fadeInZoom} 0.5s ease forwards,
      ${fadeOutZoom} 0.5s 0.7s ease forwards;
  }

  .Toastify__toast--success {
    background: linear-gradient(90deg, #34d399, #10b981);
    border: 2px solid #10b981;
    color: #ffffff;
  }

  .Toastify__toast--error {
    background: linear-gradient(90deg, #ef4444, #dc2626);
    border: 2px solid #dc2626;
    color: #ffffff;
  }

  .Toastify__toast--info {
    background: linear-gradient(90deg, #3b82f6, #2563eb);
    border: 2px solid #2563eb;
    color: #ffffff;
  }

  .Toastify__toast--warning {
    background: linear-gradient(90deg, #facc15, #eab308);
    border: 2px solid #eab308;
    color: #ffffff;
  }

  .Toastify__progress-bar {
    height: 6px;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0.7),
      rgba(255, 255, 255, 0.3)
    );
    background-size: 200% 200%;
    animation: ${progressBarShimmer} 1s linear infinite;
  }

  .Toastify__close-button {
    color: white;
    opacity: 0.8;

    &:hover {
      opacity: 1;
      transform: scale(1.2);
      transition: all 0.2s ease;
    }
  }

  .Toastify__toast-icon {
    margin-right: 10px;
    svg {
      animation: ${fadeInZoom} 0.5s ease forwards;
    }
  }
`

const CustomToastContainer = () => <StyledToastContainer />

export default CustomToastContainer
