"use strict"
const mongoCollections = require("../config/mongoCollections");
const courses = mongoCollections.courses;
const majors = mongoCollections.majors;
const minors = mongoCollections.minors;

let exportedMethods = {

   async addCourse(data) {
        if (!data)
            return Promise.reject("No data provided");

        let coursesCollection = await(courses());
        let removeResult = await coursesCollection.remove({"major": data[0].major});

        if (removeResult.result.ok == 1) {
            let writeResult = await coursesCollection.insert(data);
            if (writeResult.nInserted == 0) {
                return "Could not execute the command";
            }
            else {
                return "success";
            }
        }
        else
            return "Could not execute the delete command";

        // return courses().then((coursesCollection) => {
        //     return coursesCollection.insert(data).then((WriteResult) => {
        //         if (WriteResult.nInserted == 0) {
        //             return Promise.reject("Could not execute the command");
        //         }
        //         else {
        //             //console.log(`Post saved with id ${newInsertInformation.insertedId}`);
        //             return Promise.resolve("success");
        //         }
        //     });
        // });
    },

    async addMajor(data) {
        if (!data)
            return Promise.reject("No data provided");

        let majorsCollection = await (majors());
        let removeResult = await majorsCollection.remove({});

        if (removeResult.result.ok == 1) {
            let writeResult = await majorsCollection.insert(data);
            if (writeResult.nInserted == 0) {
                return "Could not execute the command";
            }
            else {
                return "success";
            }
        }
        else
            return "Could not execute the delete command";

        // return majors().then((majorsCollection) => {
        //     return majorsCollection.insert(data).then((WriteResult) => {
        //         if (WriteResult.nInserted == 0) {
        //             return Promise.reject("Could not execute the command");
        //         }
        //         else {
        //             //console.log(`Post saved with id ${newInsertInformation.insertedId}`);
        //             return Promise.resolve("success");
        //         }
        //     });
        // });
    },

    async addMinor(data) {
        if (!data)
            return Promise.reject("No data provided");

        let minorsCollection = await (minors());
        let removeResult = await minorsCollection.remove({});

        if (removeResult.result.ok == 1) {
            let writeResult = await minorsCollection.insert(data);
            if (writeResult.nInserted == 0) {
                return "Could not execute the command";
            }
            else {
                return "success";
            }
        }
        else
            return "Could not execute the delete command";

        // return minors().then((minorsCollection) => {
        //     return minorsCollection.insert(data).then((WriteResult) => {
        //         if (WriteResult.nInserted == 0) {
        //             return Promise.reject("Could not execute the command");
        //         }
        //         else {
        //             //console.log(`Post saved with id ${newInsertInformation.insertedId}`);
        //             return Promise.resolve("success");
        //         }
        //     });
        // });
    },
    printAll() {
        return courses().then((coursesCollection) => {
            return coursesCollection.find().toArray().then((result) => {
                if (!result) {
                    return Promise.reject("Could not execute the command");
                }
                else {
                    return Promise.resolve(result);
                }
            });
        });
    }
}

module.exports = exportedMethods;