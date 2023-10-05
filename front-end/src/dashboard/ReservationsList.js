import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";

function ReservationsList({ reservation }) {
  console.log(reservation);

  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");

    // Determine AM/PM
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12; // Adjust the hour. Note: 12 in 24-hour format should become 12 in 12-hour format.

    // Return the new format
    return `${adjustedHour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  return (
    <div className="col-md-3">
      <h4>
        {reservation.first_name} {reservation.last_name}
      </h4>
      <p>time: {formatTime(reservation.reservation_time)}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>People: {reservation.people}</p>
      <Link
        className="btn btn-primary"
        to={`/reservations/${reservation.reservation_id}/seat`}
        href={`/reservations/${reservation.reservation_id}/seat`}
      >
        Seat
      </Link>
    </div>
  );
}

export default ReservationsList;
