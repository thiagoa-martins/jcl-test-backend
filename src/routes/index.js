const { Router } = require("express");

const studentsRoutes = require("./students.routes");
const coursesRoutes = require("./courses.routes");

const routes = Router();

routes.use("/students", studentsRoutes);
routes.use("/courses", coursesRoutes);

module.exports = routes;