// Importing necessary modules and functions
const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties("table_name", "capacity");

// List all tables
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data: data });
}

// Middleware to check if a table exists by its ID
async function tableExists(req, res, next) {
  const table = await service.read(req.params.tableId);

  if (table) {
    res.locals.table = table;
    return next();
  }

  next({
    status: 404,
    message: `Table ${req.params.tableId} cannot be found.`,
  });
}

// Middleware to check if a reservation exists by its ID
async function reservationExists(req, res, next) {
  const reservation = await reservationService.read(
    req.body.data.reservation_id
  );

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${req.body.data.reservation_id} cannot be found.`,
  });
}

// Read a specific table by its ID
async function read(req, res, next) {
  const { table: data } = res.locals;
  res.json({ data });
}

// Define valid properties for a table
const VALID_PROPERTIES = ["table_name", "capacity"];

// Middleware to check for valid properties in request body
function hasValidProperties(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES.includes(field)
  );

  if (invalidFields.length) {
    return next({
      status: 400,
      message: `Invalid field(s): ${invalidFields.join(", ")}`,
    });
  }

  next();
}

// Middleware to validate table properties like name length and capacity type
function validateTableProps(req, res, next) {
  const { data = {} } = req.body;

  if (data.table_name.length < 2) {
    return next({
      status: 400,
      message: "table_name",
    });
  }

  if (typeof data.capacity !== "number") {
    return next({
      status: 400,
      message: "capacity",
    });
  }

  next();
}

// Create a new table
async function create(req, res, next) {
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

// Update an existing table
async function update(req, res, next) {
  const table = {
    ...req.body.data,
    table_id: res.locals.table.table_id,
  };

  const data = await service.update(table);
  res.json({ data });
}

// Middleware to validate reservation_id property in request body
function tableValidatorU(req, res, next) {
  const { data = {} } = req.body;

  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  next();
}

// Middleware to check if the table is already occupied
function isOccupied(req,res,next) {

  if (res.locals.table.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is occupied",
    });
  }

  next();
}

// Middleware to validate if table's capacity is sufficient for a reservation
function valdiateCapacity(req,res,next) {

  if (res.locals.table.capacity < res.locals.reservation.people) {
    return next({
      status: 400,
      message: "capacity error",
    });
  }

  next();
}

// Delete an existing table
async function destroy(req, res, next) {
  const { table } = res.locals;
  await service.delete(table.table_id);
  res.sendStatus(204);
}

// Exporting module's functions
module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(tableExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    validateTableProps,
    asyncErrorBoundary(create),
  ],
  update: [
    tableValidatorU,
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    isOccupied,
    valdiateCapacity,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
};
