import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createReservation } from "../utils/api";

import Form from "./Form";

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

  // Initalizing state for reservation errors on invalid dates
  const [reservationsError, setReservationsError] = useState(null);

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
    await createReservation(reservationFormatted)
      // Navigating to the dashboard after form submission
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(setReservationsError);
  };

  // Rendering the form
  return (
    <Form
      handleSubmit={handleSubmit}
      handleChange={handleChange}
      formData={formData}
      reservationsError={reservationsError}
      history={history}
    />
  );
}

export default NewReservation;
