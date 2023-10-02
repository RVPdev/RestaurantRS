import React from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { previous, next } from "../utils/date-time";

function NavigationDate({ date }) {
  const history = useHistory();

//   console.log(date);

  return (
    <div className="row row-cols-auto ms-2 mb-3">
      <button
        className="col btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
      >
        Prev
      </button>
      <button
        className="col ms-3 btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard`)}
      >
        Today
      </button>
      <button
        className="col ms-3 btn btn-secondary"
        type="button"
        onClick={() => history.push(`/dashboard?date=${next(date)}`)}
      >
        Next
      </button>
    </div>
  );
}

export default NavigationDate;
