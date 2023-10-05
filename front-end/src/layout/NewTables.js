import React, { useState } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { createTable } from "../utils/api";
import ErrorAlert from "./ErrorAlert";

function NewTables() {
  const history = useHistory();

  const initialFormState = {
    table_name: "",
    capacity: "",
  };

  const [formData, setFormData] = useState({ ...initialFormState });

  const [tablesError, setTablesError] = useState(null);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const reservationFormated = {
      ...formData,
      capacity: Number(formData.capacity),
    };

    await createTable(reservationFormated)
      .then(() => history.push(`/dashboard`))
      .catch(setTablesError);
  };

  return (
    <div>
      <form className="row g-3 mt-2" onSubmit={handleSubmit}>
        <div className="col-md-6">
          <label htmlFor="table_name" className="form-label">
            Table Name:
          </label>
          <input
            id="table_name"
            name="table_name"
            type="text"
            onChange={handleChange}
            value={formData.table_name}
            required
            className="form-control"
          />
        </div>

        <div className="col-md-6">
          <label htmlFor="capacity" className="form-label">
            Capacity:
          </label>
          <input
            id="capacity"
            name="capacity"
            type="number"
            onChange={handleChange}
            value={formData.capacity}
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
      <ErrorAlert error={tablesError}/>
    </div>
  );
}

export default NewTables;
