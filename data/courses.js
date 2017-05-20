"use strict"
const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const minors = mongoCollections.minors;
const majors = mongoCollections.majors;

let exportedMethods = {
    async findMajors(courseList) {
        if (!courseList)
            return Promise.reject("No data provided");

        let coursesCollection = await (courses());
        let majorList = {};

        let fn = (course, cb) => {
            coursesCollection.findOne({ "course_no": course }, { "major": 1 }).then((major) => {
                if (!majorList[major.major])
                    majorList[major.major] = new Array(course);
                else
                    majorList[major.major].push(course);
                cb();
            });
        };

        let tasks = courseList.map((course) => {
            return new Promise((resolve) => {
                fn(course, resolve);
            });
        });

        return Promise.all(tasks).then(() => {
            console.log(majorList);
            return majorList;
        });
    },

    async findMinorLeftInfo(minorCompleted) {
        if (!minorCompleted)
            return Promise.reject("No data provided");

        let minorsCollection = await (minors());
        let minorLeft = [];
         
        let fn = (minor, completed, cb) => {
            minorsCollection.findOne({ "minor": minor }, { "_id": 0 }).then((m) => {
                if (m){
                    //minorsInfo.push(m);
                    let required = m.requirements - completed.minorRequired;
                    let electives = m.electives - (completed.upper + completed.lower);
                    let upper,lower;
                    if(m.upper!=0)
                    upper = m.upper - completed.upper;
                    else
                    upper = 0;

                    if(m.lower!=0)
                    lower =  m.lower - completed.lower;
                    else
                    lower = 0;

                    let total = required + electives;

                    minorLeft.push({minor: minor, left: {required: required, electives: electives, upper: upper, lower: lower}, total: total});
                }
                cb(); 
            });
        };

        let tasks = minorCompleted.map((mc) => {
            return new Promise((resolve) => {
                fn(mc.minor, mc.completed, resolve);
            });
        });

        return Promise.all(tasks).then(() => {
            console.log(minorLeft);
            return minorLeft;
        });
    },

    async findCourseInfo(courseList) {
        if (!courseList)
            return Promise.reject("No data provided");

        let coursesCollection = await (courses());
        let courseInfo = [];

        let majorRequired = 0;
        let minorRequired = 0;
        let upper = 0;
        let lower = 0;

        let fn = (course, cb) => {
            coursesCollection.findOne({ "course_no": course }).then((c) => {
                if (c) {
                    if (c["major_requirement"] == "Yes")
                        majorRequired = majorRequired + 1;
                    if (c["minor_requirement"] == "Yes")
                        minorRequired = minorRequired + 1;
                    if (c["upper"] == "Yes")
                        upper = upper + 1;
                    if (c["lower"] == "Yes")
                        lower = lower + 1;
                }
                cb();
            });
        };

        let tasks = courseList.map((course) => {
            return new Promise((resolve) => {
                fn(course, resolve);
            });
        });

        return Promise.all(tasks).then(() => {
            let completed = {majorRequired: majorRequired , minorRequired: minorRequired, upper: upper, lower: lower};
            console.log(completed);
            return completed;
        });
    }
}

module.exports = exportedMethods;