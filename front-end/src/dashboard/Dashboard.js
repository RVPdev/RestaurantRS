import React, { useEffect, useState } from "react";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import NavigationDate from "./NavigationDate";
import ReservationsList from "./ReservationsList";
import TablesList from "./TablesList";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);

  const [trigger, setTrigger] = useState(0)

  useEffect(loadDashboard, [date, trigger]);


  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    setTablesError(null);

    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);

    listTables(abortController.signal).then(setTables).catch(setTablesError);

    return () => abortController.abort();
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
      </div>
      <div>
        <NavigationDate date={date} />
      </div>
      <ErrorAlert error={reservationsError} />

      <div className="row g-3 mt-2">
        {reservations.map((reservation, index) => (
          <ReservationsList reservation={reservation} key={index} />
        ))}
      </div>

      <div className="row g-3 mt-2">
        {tables.map((table, index) => (
          <TablesList table={table} key={index} setTrigger={setTrigger} />
        ))}
      </div>
      <ErrorAlert error={tablesError} />
    </main>
  );
}

export default Dashboard;
