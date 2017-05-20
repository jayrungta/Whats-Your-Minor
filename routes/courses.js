"use strict"
const express = require('express');
const router = express.Router();
const data = require("../data");
const coursesData = data.courses;

router.get("/", (req, res) => {
    res.json("nothing here");
});

router.get("/minor", async (req, res) => {
    let courseList = ["01-220-301", "04-189-101", "01-790-102"];

    let minorList = await coursesData.findMajors(courseList);
    if (!minorList)
        res.json(500);
    else {
        // let minors = [];
        // for(var k in minorList) minors.push(k);
        // let minorsInfo = await coursesData.findMinorsInfo(minors);
        // if(!minorsInfo)
        // res.json(500);
        // else{

        // }
        let minors = [];
        for(var k in minorList) minors.push(k);

        let minorCompleted = [];
        let fn = (minor, courses, cb) => {
           coursesData.findCourseInfo(courses).then((c) => {
                if (c)
                    minorCompleted.push({minor: minor, completed: c});
                cb();
            });
        };

        let tasks = minors.map((minor) => {
            return new Promise((resolve) => {
                fn(minor, minorList[minor], resolve);
            });
        });

        return Promise.all(tasks).then(() => {
           return coursesData.findMinorLeftInfo(minorCompleted).then((minorLeft)=>{
               let doableMinors = [];
                minorLeft.forEach(function(m) {
                    if(m.total <= 5)
                    doableMinors.push(m);              
                }, this);
                res.json(doableMinors);
           });
        });
    }
});

module.exports = router;
