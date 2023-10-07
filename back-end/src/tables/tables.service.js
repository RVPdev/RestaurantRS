const knex = require("../db/connection");

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

function read(tableId) {
  return knex("tables").select("*").where({ table_id: tableId }).first();
}

function create(table) {
  return knex("tables")
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
  return knex("tables").where({ table_id: tableId }).update({
    reservation_id: null,
  });
}

module.exports = {
  list,
  read,
  create,
  update,
  delete: destroy,
};
