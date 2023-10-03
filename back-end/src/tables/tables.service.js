const knex = require("../db/connection");

function list() {
  return knex("tables").select("*");
}

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function create(table) {
  return knex("table")
    .insert(table)
    .returning("*")
    .then((createTable) => createTable[0]);
}

function update(table) {
  return knex("tables")
    .select("*")
    .where({ table_id: table.table_id })
    .update(table, "*");
}

function destroy(tableId) {
  return knex("tables").where({ tableId }).del();
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
};
