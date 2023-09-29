import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

function NewReservation() {
  const history = useHistory();
  const [formData, setFromData] = useState();

  return (
    <form>
      <label htmlFor="first_name">First Name:</label>
      <input id="first_name" name="first_name" type="text" required />

      <label htmlFor="last_name">Last Name:</label>
      <input id="last_name" name="last_name" type="text" required />

      <label htmlFor="mobile_number">Mobile Number</label>
      <input id="mobile_number" name="mobile_number" type="tel" required />

      <label htmlFor="reservation_date">Date of Reservation</label>
      <input
        id="reservation_date"
        name="reservation_date"
        type="date"
        required
      />

      <label htmlFor="reservation_time">Time of Reservation</label>
      <input
        id="reservation_time"
        name="reservation_time"
        type="time"
        required
      />

      <label htmlFor="people">Number of People</label>
      <input id="people" name="people" type="number" min={1} required />

      <button type="submit">Submit</button>
      <button type="button">Cancel</button>
    </form>
  );
}

export default NewReservation;
