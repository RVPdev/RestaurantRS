exports.up = function(knex) {
  return knex.schema.createTable('reservations', (table) => {
    // Primary Key
    table.increments('reservation_id').primary();

    // Other Fields
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('mobile_number').notNullable();
    table.date('reservation_date').notNullable();
    table.time('reservation_time').notNullable();
    table.integer('people').unsigned().notNullable();
    table.string('status').defaultTo("booked");

    // Timestamps
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('reservations');
};
