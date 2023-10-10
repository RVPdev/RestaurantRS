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
  const { date, mobile_number } = req.query;

  if (date) {
    const data = await service.readDate(date);
    res.json({ data: data });
  } else if (mobile_number) {
    const data = await service.search(mobile_number);
    res.json({ data: data });
  } else {
    const data = await service.list();
    res.json({ data: data });
  }
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
  "status",
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

const VALID_PROPERTIES_TWO = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people",
  "status",
  "reservation_id",
  "created_at",
  "updated_at",
];

function hasValidPropertiesTwo(req, res, next) {
  const { data = {} } = req.body;

  const invalidFields = Object.keys(data).filter(
    (field) => !VALID_PROPERTIES_TWO.includes(field)
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

function validateStatus(req, res, next) {
  const { data = {} } = req.body;

  if (data.status === "seated" || data.status === "finished") {
    return next({
      status: 400,
      message: "'status' cannot be seated or finished",
    });
  }

  next();
}

function rejectForeingStatus(req, res, next) {
  const { data = {} } = req.body;
  const validStatus = ["booked", "seated", "finished", "cancelled"];
  if (!validStatus.includes(data.status)) {
    return next({
      status: 400,
      message: "'status' unknown please set to an allowed status",
    });
  }
  next();
}

function updateFinish(req, res, next) {
  const data = res.locals.reservation;

  if (data.status === "finished") {
    return next({
      status: 400,
      message: "cannot be updated when reservation is finished",
    });
  }

  next();
}

function validateReservationDate(req, res, next) {
  const { data: { reservation_date } = {} } = req.body;

  if (!reservation_date)
    return next({ status: 400, message: "Reservation date is required" });

  const reservationDate = new Date(reservation_date);
  const today = new Date();

  // Set the time of today to 00:00:00 to only compare date, not time.
  today.setHours(0, 0, 0, 0);

  if (reservationDate.getDay() === 1) {
    // 1 corresponds to Tuesday in JavaScript Date object
    return next({ status: 400, message: "Restaurant is closed" });
  }

  if (reservationDate < today) {
    return next({ status: 400, message: "Make the reservation in the future" });
  }

  next();
}

function validateReservationTime(req, res, next) {
  const { data: { reservation_date, reservation_time } = {} } = req.body;

  if (!reservation_time)
    return next({ status: 400, message: "Reservation time is required" });

  const reservationDateTime = new Date(
    `${reservation_date}T${reservation_time}`
  );

  const reservationHour = reservationDateTime.getHours();
  const reservationMinute = reservationDateTime.getMinutes();

  const reservationTimeInMinutes = reservationHour * 60 + reservationMinute;
  const openingTimeInMinutes = 10 * 60 + 30; // 10:30 AM
  const closingTimeInMinutes = 21 * 60 + 30; // 9:30 PM

  if (reservationTimeInMinutes < openingTimeInMinutes) {
    return next({
      status: 400,
      message: "Reservations cannot be made before 10:30 AM",
    });
  }

  if (reservationTimeInMinutes > closingTimeInMinutes) {
    return next({
      status: 400,
      message: "Reservations cannot be made after 9:30 PM",
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
    reservation_id: res.locals.reservation.reservation_id,
    status: req.body.data.status,
  };

  await service.update(reservation);
  res.status(200).json({ data: reservation });
}

async function updateRes(req, res) {
  const { reservationId } = req.params;
  const updatedReservation = {
    ...req.body.data,
    reservation_id: reservationId,
  };

  const data = await service.updateRes(updatedReservation);
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
    validateStatus,
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationExists),
    rejectForeingStatus,
    updateFinish,
    asyncErrorBoundary(update),
  ],
  updateRes: [
    asyncErrorBoundary(reservationExists),
    hasValidPropertiesTwo,
    hasRequiredProperties,
    validateDateTime,
    validateReservationDate,
    validateReservationTime,
    asyncErrorBoundary(updateRes),
  ],
  delete: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(destroy)],
};
