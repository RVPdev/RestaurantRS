import React from "react";

function TablesList({ table }) {
//   console.log(table);
  return (
    <div className="col-md-3">
      <h4>{table.table_name}</h4>
      <p data-table-id-status={`${table.table_id}`}>
        {table.reservation_id ? "Occupied" : "Free"}
      </p>
      {table.reservation_id && (
        <buton className="btn btn-danger">Finish</buton>
      )}
    </div>
  );
}

export default TablesList;
