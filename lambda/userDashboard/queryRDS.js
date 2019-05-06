'use strict';

const https = require('https');
const AWS = require('aws-sdk')


let mysql = require('mysql');
let config = require('./config.json');

let pool = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbdatabase,
    connectionLimit: 10,
});


module.exports.getSurveillanceImages = async function () {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            reject(err);
            connection.query('SELECT Name from Employee3 where EmpID=1', function (error, results, fields) {

                connection.release();

                if (error) {
                    reject(error)
                }
                else {
                    resolve(results[0])
                };
            });
        });
    });
};

