exports.up = (knex) =>
  knex.schema.createTable("students", (table) => {
    table.increments("id");
    table.text("name");
    table.text("email");
    table
      .integer("course_id")
      .references("id")
      .inTable("courses")
      .onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("students");
