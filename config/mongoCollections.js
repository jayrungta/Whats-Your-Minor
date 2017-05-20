"use strict"
const dbConnection = require("./mongoConnection");

let getCollectionFn = (collection) => {
    let _col = undefined;

    return () => {
        if (!_col) {
            _col = dbConnection().then(db => {
                return db.collection(collection);
            });
        }

        return _col;
    }
}
module.exports = {
    courses: getCollectionFn("courses"),
    minors: getCollectionFn("minors"),
    majors: getCollectionFn("majors")
};