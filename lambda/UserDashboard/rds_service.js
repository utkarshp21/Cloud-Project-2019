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
                // console.log(sql);
                connection.query(sql, function (error, results, fields) {
                    connection.release();
                    if (error) {
                        console.log("Error in fetching query results -" + error);
                        reject(error);
                    }
                    else {
                        console.log(`Successfully fetched ${results.length} results from db`);
                        // console.log(results);
                        let json = {};
                        results.forEach(function(item) {
                            let s3_path = item.s3_path;
                            let bounding_box = item.bounding_box;
                            bounding_box = bounding_box.split(",");
                            let width = bounding_box[0];
                            let height = bounding_box[1];
                            let left = bounding_box[2];
                            let top = bounding_box[3];
                            let user_name = item.user_name;
                            let user_id = item.user_id;
                            let timestamp = item.inserted_time;
                            let tagged = item.tagged;
                            let userDetail = {"userId" : user_id, "tagged" : tagged, "width" : width,
                                'height' : height, 'left' : left, 'top' : top, 'userName' : user_name};
                            if (!(s3_path in json)){
                                json[s3_path] = {'timestamp' : timestamp ,'bounding_box' :[] };
                            }
                            let userDetails = json[s3_path].bounding_box;
                            userDetails.push(userDetail); 
                            
                        });
                        
                        resolve(json);
                    }
                });
            }
        });
    });
};

