import React, { useEffect, useState } from "react";
import {
  useHistory,
  useParams,
} from "react-router-dom/cjs/react-router-dom.min";
import { readReservation, updateReservation } from "../utils/api";
import Form from "./Form";

function ReservationEditor() {
  const { reservation_id } = useParams();
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

  useEffect(() => {
    const abortController = new AbortController();

    readReservation(reservation_id, abortController.signal)
      .then(setFormData)
      .catch();

    return () => abortController.abort();
  }, [reservation_id]);

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
      reservation_time: formData.reservation_time.slice(0, 5),
    };

    await updateReservation(reservationFormatted, reservation_id)
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

export default ReservationEditor;
