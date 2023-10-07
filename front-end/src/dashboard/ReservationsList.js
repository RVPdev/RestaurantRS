import React from "react";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { changeStatusSeat } from "../utils/api";

function ReservationsList({ reservation }) {
  const formatTime = (timeStr) => {
    const [hour, minute] = timeStr.split(":");

    // Determine AM/PM
    const isPM = hour >= 12;
    const adjustedHour = hour % 12 || 12; // Adjust the hour. Note: 12 in 24-hour format should become 12 in 12-hour format.

    // Return the new format
    return `${adjustedHour}:${minute} ${isPM ? "PM" : "AM"}`;
  };

  const seatClick = async (event) => {
    try {
      await changeStatusSeat(reservation.reservation_id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="col-md-3">
      <h4>
        {reservation.first_name} {reservation.last_name}
      </h4>
      <p>time: {formatTime(reservation.reservation_time)}</p>
      <p>Mobile: {reservation.mobile_number}</p>
      <p>People: {reservation.people}</p>
      <p data-reservation-id-status={`${reservation.reservation_id}`}>
        Status:{" "}
        {reservation.status.charAt(0).toUpperCase() +
          reservation.status.slice(1)}
      </p>
      {reservation.status === "booked" && (
        <Link
          className="btn btn-primary"
          to={`/reservations/${reservation.reservation_id}/seat`}
          href={`/reservations/${reservation.reservation_id}/seat`}
          onClick={seatClick}
        >
          Seat
        </Link>
      )}
    </div>
  );
}

export default ReservationsList;
