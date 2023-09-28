/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// requireporperties
const hasProperties = require("../errors/hasProperties");
const hasRequiredProperties = hasProperties(
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
);

// list function form controller and query selector
async function list(req, res, next) {
  const { date } = req.query;

  if (date) {
    const data = await service.readDate(date);
    res.json({ data: data });
  }

  const data = await service.list();
  res.json({ data: data });
}

// validator for the reservation ID
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({
    status: 404,
    message: `Reservation ${req.params.reservationId} cannot be found.`,
  });
}

// read function to display reservation by ID
async function read(req, res) {
  const { reservation: data } = res.locals;
  res.json({ data });
}

// property validator
const VALID_PROPERTIES = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
];

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

  if (typeof data.people !== "number" || data.people <= 0) {
    return next({
      status: 400,
      message: "'people' field must be a number greater than 0",
    });
  }

  next();
}

function validateDateTime(req, res, next) {
  const { data = {} } = req.body;

  // Validate date and time
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

  if (!dateRegex.test(data.reservation_date)) {
    return next({
      status: 400,
      message:
        "'reservation_date' field must be a valid date in YYYY-MM-DD format",
    });
  }

  if (!timeRegex.test(data.reservation_time)) {
    return next({
      status: 400,
      message:
        "'reservation_time' field must be a valid time in HH:mm:ss format",
    });
  }

  next();
}

// create a new reservation
async function create(req, res, next) {
  const data = await service.create(req.body.data);

  res.status(201).json({ data });
}

// update reervation
async function update(req, res, next) {
  const reservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  const data = await service.update(reservation);
  res.json({ data });
}

// destroy controller

async function destroy(req, res, next) {
  const { reservation } = res.locals;
  await service.delete(reservation.reservation_id);
  res.sendStatus(204);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    hasValidProperties,
    hasRequiredProperties,
    validateDateTime,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    hasRequiredProperties,
    validateDateTime,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
