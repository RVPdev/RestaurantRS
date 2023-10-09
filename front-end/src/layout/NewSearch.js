import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import ErrorAlert from "./ErrorAlert";
import ReservationsList from "../dashboard/ReservationsList";

function NewSearch() {
  const initialFormState = {
    mobile_number: "",
  };

  const [mobile, setMobile] = useState({ ...initialFormState });
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadReservation, [mobile]);

  function loadReservation() {
    console.log("Load Reservation ~~~~~~~~~~~~~~~~~~~~");
    const abortController = new AbortController();
    setReservationsError(null);

    listReservations(mobile, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    return () => abortController.abort();
  }

  const handleChange = (event) => {
    setMobile({ ...mobile, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    loadReservation();
  };

  return (
    <div>
      <form className="row g-3 mt-2" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <input
            name="mobile_number"
            placeholder="Enter a customer's phone number"
            type="tel"
            className="form-control"
            onChange={handleChange}
            value={mobile.mobile_number}
          ></input>
        </div>

        <div className="col-md-6">
          <button type="submit" className="btn btn-primary">
            Find
          </button>
        </div>
      </form>
      <div className="row g-3 mt-2">
        {reservations.map((reservation, index) => (
          <ReservationsList reservation={reservation} key={index} />
        ))}
      </div>
      {reservations.length === 0 && <h2>No reservations found</h2>}
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default NewSearch;
