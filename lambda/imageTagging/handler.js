'use strict';
const queryRDS = require('./rds_service');


module.exports.imageTagging = async (event, context) => {
 
  let { faceId, tag } = event;

  let response = await queryRDS.tagSurveillanceImages(faceId, tag);

  return {
    statusCode: 200,
    body: response,
  };

};
