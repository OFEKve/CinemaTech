import React from "react"

const TimeSlotSelector = ({
  timeSlots,
  selectedTimeSlot,
  setSelectedTimeSlot,
}) => {
  return (
    <div className="time-slot-selector">
      <h3>Select a Time Slot:</h3>
      {timeSlots.map((slot) => (
        <button
          key={slot}
          onClick={() => setSelectedTimeSlot(slot)}
          className={`time-slot ${selectedTimeSlot === slot ? "selected" : ""}`}
        >
          {slot}
        </button>
      ))}
    </div>
  )
}

export default TimeSlotSelector
