'use strict';
const queryRDS = require('./rds_service');


module.exports.imageTagging = async (event, context) => {
 
  let { faceId, tag } = event;
  let timestamp = parseInt(Date.now()/1000, 10);
  let response = await queryRDS.tagSurveillanceImages(faceId, tag, timestamp);

  return {
    statusCode: 200,
    body: response,
  };

};
