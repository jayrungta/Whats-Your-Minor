"use strict"
const excelRoutes = require("./excel");
const coursesRoutes = require("./courses");

const constructorMethod = (app) => {
    app.use("/excel", excelRoutes);
    app.use("/courses", coursesRoutes);

    app.use("*", (req, res) => {
        res.sendStatus(404);
    })
};

module.exports = constructorMethod;
