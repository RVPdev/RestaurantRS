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

// list function form controller
async function list(req, res, next) {
  const data = await service.list();
  res.json({ data });
}

// validator for the reservation ID
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);

  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }

  next({ status: 404, message: `Reservation cannot be found.` });
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

  const invalidFields = Objact.keys(data).filter(
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
  create: [hasValidProperties, hasRequiredProperties, asyncErrorBoundary(create)],
  update: [
    asyncErrorBoundary(reservationExists),
    hasValidProperties,
    hasRequiredProperties,
    asyncErrorBoundary(update),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
