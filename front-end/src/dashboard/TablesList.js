import React, { useState } from "react";
import { finishSeat } from "../utils/api";

function TablesList({ table, setTrigger }) {
  //   console.log(table);
  const [seatError, setSeatError] = useState(null);

  const handleClick = async (event) => {
    setSeatError(null);
    const windowConfirm = window.confirm(
      "Is this table ready to seat new guests? This cannot be undone."
    );
    if (windowConfirm === true) {
      try {
        await finishSeat(table.table_id, table.reservation_id);
      } catch (error) {
        setSeatError(error);
      }
      setTrigger((prev) => prev + 1);
    }
    console.log(seatError);
  };

  return (
    <div className="col-md-3">
      <h4>{table.table_name}</h4>
      <p data-table-id-status={`${table.table_id}`}>
        {table.reservation_id ? "Occupied" : "Free"}
      </p>
      {table.reservation_id && (
        <button
          className="btn btn-danger button"
          data-table-id-finish={`${table.table_id}`}
          onClick={handleClick}
        >
          Finish
        </button>
      )}
    </div>
  );
}

export default TablesList;
