/**
 * List handler for reservation resources
 */
const service = require("./reservations.service");

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
  service
    .list()
    .then((data) => res.json({ data }))
    .catch(next);
}

// validator for the reservation ID
async function reservationExists(req, res, next) {
  service
    .read(req.params.reservationId)
    .then((reservation) => {
      if (reservation) {
        res.locals.reservation = reservation;
        return next();
      }
      next({ status: 404, message: `Reservation cannot be found.` });
    })
    .catch(next);
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
  service
    .create(req.body.data)
    .then((data) => res.status(201).json({ data }))
    .catch(next);
}

// update reervation
async function update(req, res, next) {
  const reservation = {
    ...req.body.data,
    reservation_id: res.locals.reservation.reservation_id,
  };

  service
    .update(reservation)
    .then((data) => res.json({ data }))
    .catch(next);
}

// destroy controller

async function destroy(req, res, next) {
  service
    .delete(res.locals.reservation.reservationId)
    .then(() => res.sendStatus(204))
    .catch(next);
}

module.exports = {
  list,
  read: [reservationExists, read],
  create: [hasValidProperties, hasRequiredProperties, create],
  update: [
    reservationExists,
    hasValidProperties,
    hasRequiredProperties,
    update,
  ],
  delete: [reservationExists, destroy],
};
