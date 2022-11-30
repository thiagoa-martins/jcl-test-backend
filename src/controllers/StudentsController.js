const AppError = require("../utils/AppError");
const knex = require("../database/knex");

class StudentsController {
  async create(request, response) {
    const { name, email } = request.body;
    const { course_id } = request.params;
    const id = course_id;

    if (!name || !email) {
      throw new AppError("Nome e E-mail são obrigatórios!");
    }

    const checkCourseExists = await knex("courses").where({ id });

    if (!String(checkCourseExists)) {
      throw new AppError("O curso não existe!");
    }

    const checkStudentExists = await knex("students").where({ email });

    if (String(checkStudentExists)) {
      throw new AppError("Este e-mail já esta em uso.");
    }

    await knex("students").insert({ name, email, course_id });

    response.status(201).json();
  }

  async update(request, response) {
    const { name, email } = request.body;
    let { course_id } = request.body;
    const { id } = request.params;

    const student = await knex("students").where({ id });

    if (!String(student)) {
      throw new AppError("Usuário não encontrado.");
    }

    if (!name || !email) {
      throw new AppError("Nome e e-mail são obrigatórios!");
    }

    const studentByEmail = await knex("students").where({ email });

    if (
      String(studentByEmail) &&
      studentByEmail[0]["id"] !== student[0]["id"]
    ) {
      throw new AppError("Este e-mail já está em uso.");
    }

    const updated_at = knex.fn.now();

    course_id = course_id ?? student.course_id;

    await knex("students").where({ id }).update({ name, email, updated_at, course_id });

    response.json();
  }

  async index(request, response) {
    const studentsAndCourses = await knex("students")
      .select([
        "courses.title",
        "students.course_id",
        "students.name",
        "students.email",
        "students.id",
      ])
      .innerJoin("courses", "courses.id", "students.course_id")
      .orderBy("title");

    response.json(studentsAndCourses);
  }

  async show(request, response) {
    const { id } = request.params;

    const student = await knex("students").where({ id });

    return response.json(student);
  }

  async delete(request, response) {
    const { id } = request.params;

    await knex("students").where({ id }).delete();

    return response.status(200).json();
  }
}

module.exports = StudentsController;
