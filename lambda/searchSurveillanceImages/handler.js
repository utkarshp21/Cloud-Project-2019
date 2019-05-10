'use strict';

const queryRDS = require('./rds_service');

module.exports.searchImages = async (event, context) => {

  let from_date = event["fromDate"];
  let to_date = event["toDate"];
  let user_name = event["userName"];
  let response = await queryRDS.getSurveillanceImages(from_date, to_date, user_name);

  return {
    statusCode: 200,
    body: response
  };


};
