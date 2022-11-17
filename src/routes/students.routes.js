const { Router } = require("express");

const StudentsController = require("../controllers/StudentsController");

const studentsRoutes = Router();

const studentsController = new StudentsController();

studentsRoutes.post("/:course_id", studentsController.create);
studentsRoutes.put("/:id", studentsController.update);
studentsRoutes.get("/", studentsController.index);
studentsRoutes.get("/:id", studentsController.show);
studentsRoutes.delete("/:id", studentsController.delete);

module.exports = studentsRoutes;