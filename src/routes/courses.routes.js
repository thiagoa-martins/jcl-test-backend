const { Router } = require("express");

const CoursesController = require("../controllers/CoursesController");

const coursesController = new CoursesController;

const coursesRoutes = Router();

coursesRoutes.put("/", coursesController.create);

module.exports = coursesRoutes;
