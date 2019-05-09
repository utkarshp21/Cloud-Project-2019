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


module.exports.getSurveillanceImages = async function (from_date, to_date, user_name) {
    
    console.log(`Fetching results for user[${user_name}], from[${from_date}], to[${to_date}]`);
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err){
                console.log("Error in connecting to db -" + err);
                reject(err);
            }    
            else{
                console.log("Successfully connected to db");
                let sql_query = build_sql_query(from_date, to_date, user_name);
                connection.query(sql_query, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("Error in fetching query results -" + error);
                        reject(error);
                    }
                    else {
                        console.log(`Successfully fetched ${results.length} results from db`);
                        let response_json = build_response(results);
                        resolve(response_json);
                    }
                });
            }
        });
    });
};

function build_sql_query(from_date, to_date, user_name){
    let sql = `select * from admin.images_cc_proj a inner join admin.users_cc_proj b 
                ON a.user_id = b.user_id`;
                if (from_date) {
                    sql += ` and inserted_time > ${from_date}`;
                }
                if (to_date) {
                    sql += ` and inserted_time < ${to_date}`;
                }
                if (user_name){
                    sql += ` or user_name = "${user_name}"`; 
                }
                sql += `order by inserted_time`; 
    return sql;
}

function build_response(results){
    let response_json = {};
    results.forEach(function(item) {
        let s3_path = item.s3_path;
        let bounding_box = item.bounding_box.split(",");
        let userDetail = {"userId" : item.user_id, 
                        "tagged" : item.tagged,
                        "width" : bounding_box[0],
                        "height" : bounding_box[1], 
                        "left" : bounding_box[2], 
                        "top" : bounding_box[3], 
                        "userName" : item.user_name,
                    };
        if (!(s3_path in response_json)){
            response_json[s3_path] = {'timestamp' : item.inserted_time ,'bounding_box' :[] };
        }
        let userDetails = response_json[s3_path].bounding_box;
        userDetails.push(userDetail); 
    });
    return response_json;
}