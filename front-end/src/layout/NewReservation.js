import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";

function NewReservation() {
  // Initializing useHistory hook for navigating routes
  const history = useHistory();

  // Initializing the form state object
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };

  // Initializing state for form data and setting it to initialFormState object
  const [formData, setFormData] = useState({ ...initialFormState });

  // Function to handle changes in input fields and updating the state accordingly
  const handleChange = (event) => {
    // Updating formData state with new input values
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    // Preventing default form submission behavior
    event.preventDefault();

    // Formatting reservation data before sending
    const reservationFormatted = {
      ...formData,
      people: Number(formData.people),
    };

    // Sending the formatted reservation data to create a reservation
    await createReservation(reservationFormatted);

    // Resetting the form to initial state after submission
    setFormData(initialFormState);

    // Navigating to the dashboard after form submission
    history.push(`/dashboard?date=${formData.reservation_date}`);
  };

  // Rendering the form
  return (
    <form onSubmit={handleSubmit} className="row g-3 mt-2">
      <div className="col-md-6">
        <label htmlFor="first_name" className="form-label">
          First Name:
        </label>
        <input
          id="first_name"
          name="first_name"
          type="text"
          onChange={handleChange}
          value={formData.first_name}
          required
          className="form-control"
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="last_name" className="form-label">
          Last Name:
        </label>
        <input
          id="last_name"
          name="last_name"
          type="text"
          onChange={handleChange}
          value={formData.last_name}
          required
          className="form-control"
        />
      </div>
      <div className="col-md-6">
        <label htmlFor="mobile_number" className="form-label">
          Mobile Number
        </label>
        <input
          id="mobile_number"
          name="mobile_number"
          type="tel"
          onChange={handleChange}
          value={formData.mobile_number}
          required
          className="form-control"
        />
      </div>

      <div className="col-md-6">
        <label htmlFor="people" className="form-label">
          Number of People
        </label>
        <input
          id="people"
          name="people"
          type="number"
          min={1}
          onChange={handleChange}
          value={formData.people}
          required
          className="form-control"
        />
      </div>

      <div class="col-md-6">
        <label htmlFor="reservation_date" className="form-label">
          Date of Reservation
        </label>
        <input
          id="reservation_date"
          name="reservation_date"
          type="date"
          onChange={handleChange}
          value={formData.reservation_date}
          required
          className="form-control"
        />
      </div>

      <div class="col-md-6">
        <label htmlFor="reservation_time" className="form-label">
          Time of Reservation
        </label>
        <input
          id="reservation_time"
          name="reservation_time"
          type="time"
          onChange={handleChange}
          value={formData.reservation_time}
          required
          className="form-control"
        />
      </div>

      <button type="submit" className="btn btn-secondary">
        Submit
      </button>
      <button
        type="button"
        className="btn btn-danger"
        onClick={() => history.goBack()}
      >
        Cancel
      </button>
    </form>
  );
}

export default NewReservation;
