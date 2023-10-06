
exports.up = function(knex) {
    return knex.schema.createTable("tables", (table) => {
        // Creating columns as per your requirements
        
        // Primary key: table_id
        table.increments("table_id").primary();
    
        // table_name column: Must be a string, not nullable, and at least 2 characters long.
        table.string("table_name").notNullable();
    
        // capacity column: Must be an integer, not nullable, and at least 1.
        table.integer("capacity").notNullable().unsigned();
    
        // reservation_id column: This is a foreign key.
        table.integer("reservation_id").unsigned();
        table.foreign("reservation_id").references("reservation_id").inTable("reservations");
        table.timestamps(true, true);
      });
};

exports.down = function(knex) {
  return knex.schema.dropTable("tables")
};
