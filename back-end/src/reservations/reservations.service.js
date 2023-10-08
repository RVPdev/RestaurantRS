const knex = require("../db/connection");

// get all reservations from db
function list() {
  return knex("reservations").select("*");
}

// get resrevation by ID
function read(reservationId) {
  return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId })
    .first();
}

function readDate(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .whereNot({ status: "finished" })
    .orderBy('reservation_time', "asc");
}

// create a new reservation
function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdReservation) => createdReservation[0]);
}

// updates an existing reservation
function update(reservation) {
  return knex("reservations")
    .where({ reservation_id: reservation.reservation_id })
    .update({status: reservation.status});
}


// destroy an specific reservation
function destroy(reservationId) {
  return knex("reservations").where({ reservationId }).del();
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
  readDate,
};
