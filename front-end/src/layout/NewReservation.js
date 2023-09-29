import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";

function NewReservation() {
  const history = useHistory();

  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  const [formData, setFromData] = useState({ ...initialFormState });

  const handleChange = (event) => {
    setFromData({ ...formData, [event.target.name]: event.target.value });
    console.log(formData, "`````````````");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    console.log(formData, "~~~~~~~~~~~~~~~~~");
    
    const reservationFormated = {
      ...formData, "people": Number(formData.people),
    };

    await createReservation(reservationFormated);

    setFromData(initialFormState);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="first_name">First Name:</label>
      <input
        id="first_name"
        name="first_name"
        type="text"
        onChange={handleChange}
        value={formData.first_name}
        required
      />

      <label htmlFor="last_name">Last Name:</label>
      <input
        id="last_name"
        name="last_name"
        type="text"
        onChange={handleChange}
        value={formData.last_name}
        required
      />

      <label htmlFor="mobile_number">Mobile Number</label>
      <input
        id="mobile_number"
        name="mobile_number"
        type="tel"
        onChange={handleChange}
        value={formData.mobile_number}
        required
      />

      <label htmlFor="reservation_date">Date of Reservation</label>
      <input
        id="reservation_date"
        name="reservation_date"
        type="date"
        onChange={handleChange}
        value={formData.reservation_date}
        required
      />

      <label htmlFor="reservation_time">Time of Reservation</label>
      <input
        id="reservation_time"
        name="reservation_time"
        type="time"
        onChange={handleChange}
        value={formData.reservation_time}
        required
      />

      <label htmlFor="people">Number of People</label>
      <input
        id="people"
        name="people"
        type="number"
        min={1}
        onChange={handleChange}
        value={formData.people}
        required
      />

      <button type="submit">Submit</button>
      <button type="button">Cancel</button>
    </form>
  );
}

export default NewReservation;
