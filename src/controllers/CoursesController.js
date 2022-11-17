const AppError = require("../utils/AppError");

const knex = require("../database/knex");

class CoursesController {
  async create(request, response) {
    const { title } = request.body;

    if (!title) {
      throw new AppError("O título é obrigatório.");
    }

    const course = await knex("courses").where({ title });

    if (String(course)) {
      throw new AppError("O curso já existe.");
    }

    await knex("courses").insert({ title });

    response.status(201).json();
  }
}

module.exports = CoursesController;
