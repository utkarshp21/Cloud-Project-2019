'use strict';

const AWS = require('aws-sdk');
const mysql = require('mysql');
const config = require('./config.json');

const pool = mysql.createPool({
    host: config.dbhost,
    user: config.dbuser,
    password: config.dbpassword,
    database: config.dbdatabase,
    connectionLimit: 10,
});


module.exports.tagSurveillanceImages = async function (faceID, tag) {

    console.log(`Tagging for facId [${faceID}], with tag [${tag}] `);
    
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log("Error in connecting to db -" + err);
                reject(err);
            }
            else {
                console.log("Successfully connected to db");
                let sqlQuery = buildSqlQuery(faceID,tag);
                console.log(`SQL Query- ${sqlQuery}`);

                connection.query(sqlQuery, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("Error in fetching query results -" + error);
                        reject(error);
                    }
                    else {
                        console.log(`Successfully fetched ${results.length} results from db`);
                        let response_json = {
                            queryRespone: results,
                            result:{
                                tag:tag,
                                faceId:faceID,
                            }
                        };
                        resolve(response_json);
                    }
                });
                
            }
        });
    });
};

function buildSqlQuery(faceID,tag) {
    let sql = `update users_cc_proj SET user_name="${tag}" where user_id="${faceID}"`;
    return sql;
}
