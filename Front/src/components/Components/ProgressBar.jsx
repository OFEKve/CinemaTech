import React from "react"
import styled, { keyframes } from "styled-components"
import MovieSlider from "../MovieSlider"

const glowAnimation = keyframes`
  0% {
    box-shadow: 0 0 5px rgba(255, 111, 97, 0.4);
  }
  50% {
    box-shadow: 0 0 15px rgba(255, 111, 97, 0.8);
  }
  100% {
    box-shadow: 0 0 5px rgba(255, 111, 97, 0.4);
  }
`

const ProgressBarContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 30px;
  background-color: #2a2a3e;
  border-radius: 12px;
  margin: 30px 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    padding: 10px 15px;
  }
`

const Step = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ active }) => (active ? "#ff9e80" : "#666")};
  font-size: 14px;
  transition: color 0.3s ease;
`

const Circle = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${({ active }) => (active ? "#ff6f61" : "#444")};
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: bold;
  font-size: 18px;
  transition:
    background-color 0.3s ease,
    transform 0.3s ease;
  animation: ${({ active }) => (active ? glowAnimation : "none")} 1.5s infinite;
  transform: ${({ active }) => (active ? "scale(1.1)" : "scale(1)")};
`

const Line = styled.div`
  flex: 1;
  height: 8px;
  background: linear-gradient(
    90deg,
    ${({ active }) => (active ? "#ff6f61" : "#444")},
    ${({ active }) => (active ? "#ff9e80" : "#444")}
  );
  border-radius: 4px;
  transition: background 0.3s ease;
  margin: 0 8px;
`

const ProgressBar = ({ currentStep }) => {
  const steps = ["Select seats", "Add Snacks", "Confirmation"]

  return (
    <ProgressBarContainer>
      {steps.map((step, index) => (
        <React.Fragment key={index}>
          <Step active={index <= currentStep}>
            <Circle active={index <= currentStep}>{index + 1}</Circle>
            <span>{step}</span>
          </Step>
          {index < steps.length - 1 && <Line active={index < currentStep} />}
        </React.Fragment>
      ))}
    </ProgressBarContainer>
  )
}

export default ProgressBar
