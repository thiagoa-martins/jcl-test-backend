const AppError = require("../utils/AppError");
const knex = require("../database/knex");
const sqliteConnection = require("../database/sqlite");

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
    const { id } = request.params;
    // const student = await database.get(
    //   "SELECT * FROM students WHERE id = (?)",
    //   [id]
    // );
    const database = await sqliteConnection();

    const student = await knex("students").where({ id });

    if (!String(student)) {
      throw new AppError("Usuário não encontrado.");
    }

    // const studentByEmail = await database.get(
    //   "SELECT * FROM students WHERE email = (?)",
    //   [email]
    // );

    const studentByEmail = await knex("students").where({ email });
    // console.log(studentByEmail);

    if (
      String(studentByEmail) &&
      studentByEmail[0]["id"] !== student[0]["id"]
    ) {
      throw new AppError("Este e-mail já está em uso.");
    }

    // console.log(Boolean(String(studentByEmail),  studentByEmail[0]["id"], student[0]["id"]))

    student[0]["name"] = name ?? student[0]["name"];
    student[0]["email"] = email ?? student[0]["email"];

    const nameUpdated = student[0]["name"];
    const emailUpdated = student[0]["email"];
    // await database.run(
    //   "UPDATE students SET name = ?, email = ?, updated_at = DATETIME('now') WHERE id = ?",
    //   [nameUpdated, emailUpdated, id]
    // );
    const updated_at = Date.now();
    // console.log(timestamp);

    await knex("students")
      .insert({
        name: nameUpdated,
        email: emailUpdated,
        updated_at,
      })
      .where({ id });

    response.json();
  }

  async index(request, response) {
    const students = await knex("students").orderBy("id");

    return response.json(students);
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
