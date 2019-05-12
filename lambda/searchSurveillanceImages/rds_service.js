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
    
    if (!from_date) {
        from_date = 1;
    }
    let sql = `select * from admin.images_cc_proj a inner join admin.users_cc_proj b 
                ON a.user_id = b.user_id where inserted_time > ${from_date}`;
    if (to_date) {
        sql += ` and inserted_time < ${to_date}`;    
    }
    if (user_name){
        sql += ` and s3_path in (select s3_path from admin.images_cc_proj where user_id in
        (select user_id from admin.users_cc_proj where user_name LIKE "%${user_name}%"))`; 
    }
    sql += ` order by inserted_time`; 
    console.log("Returning query - " + sql);                
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
    let response_arr = [];
    for (let s3_path in response_json) { 
        let item = response_json[s3_path];
        let obj = {'s3_path' : s3_path, 'timestamp' : item['timestamp'], 
        'bounding_box' :  item['bounding_box']};
        response_arr.push(obj);
    }
    response_arr.sort((a,b) => (a.timestamp > b.timestamp) ? -1 : ((b.timestamp > a.timestamp) ? 1 : 0)); 
    return response_arr;
}