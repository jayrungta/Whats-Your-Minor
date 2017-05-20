"use strict"
const express = require('express');
const router = express.Router();
var mongoXlsx = require('mongo-xlsx');
const data = require("../data");
const excelData = data.excel;

var course_data = [{ course_no: "01-220-102", course_name: "Introduction to Microeconomics", department: "Economics", major_requirement: "Yes", minor_requirement: "No", upper: "No", lower: "No", major: "Economics" },
{ course_no: "01-220-103", course_name: "Introduction to Macroeconomics", department: "Economics", major_requirement: "Yes", minor_requirement: "No", upper: "No", lower: "No", major: "Economics" }];

var course_model = mongoXlsx.buildDynamicModel(course_data);

var minor_data = [{ minor: "Minor", requirements: 2, electives: 2, upper: 2, lower: 2, total: 2}];

var minor_model = mongoXlsx.buildDynamicModel(minor_data);

var major_data = [{ major: "Minor", requirements: 2, electives: 2, upper: 2, lower: 2, total: 2}];

var major_model = mongoXlsx.buildDynamicModel(major_data);

let courses = ["./excel_files/econ.xlsx", "./excel_files/it.xlsx", "./excel_files/pol.xlsx"];

let majors = "./excel_files/majors.xlsx";
let minors = "./excel_files/minors.xlsx";

router.get("/", (req, res) => {

    excelData.printAll().then((result) => {
        res.json(result);
    }).catch((e) => {
        res.json(e.message);
    })
});

router.get("/addcourses", (req, res) => {
    courses.forEach(function (file) {
        setTimeout(() => {
            mongoXlsx.xlsx2MongoData(file, course_model, function (err, mongoData) {
                var mongoData = mongoData.filter(function (x) {
                    if (x["course_no"] != null)
                        return x;
                });
                setTimeout(() => {
                    excelData.addCourse(mongoData).then((result) => {
                        if (result == "success") {
                            console.log(file, "success");
                        }
                    }).catch((e) => {
                        res.json(e.message);
                        throw e;
                    })
                }, 2000);
            });
        }, 2000)
    }, this);
    
    setTimeout(() => {
    res.sendStatus(200)},5000);
});

router.get("/addmajor", (req, res) => {
        setTimeout(() => {
            mongoXlsx.xlsx2MongoData(majors, major_model, function (err, mongoData) {
                var mongoData = mongoData.filter(function (x) {
                    if (x["major"] != null)
                        return x;
                });
                setTimeout(() => {
                    excelData.addMajor(mongoData).then((result) => {
                        if (result == "success") {
                            console.log("majors success");
                            res.sendStatus(200);
                        }
                    }).catch((e) => {
                        res.json(e.message);
                    })
                }, 2000);
            });
        }, 2000)
});

router.get("/addminor", (req, res) => {
        setTimeout(() => {
            mongoXlsx.xlsx2MongoData(minors, minor_model, function (err, mongoData) {
                var mongoData = mongoData.filter(function (x) {
                    if (x["minor"] != null)
                        return x;
                });
                setTimeout(() => {
                    excelData.addMinor(mongoData).then((result) => {
                        if (result == "success") {
                            console.log(result);
                            res.sendStatus(200);
                        }
                    }).catch((e) => {
                        res.json(e.message);
                    })
                }, 2000);
            });
        }, 2000)
});



module.exports = router;
