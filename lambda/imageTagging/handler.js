'use strict';
const queryRDS = require('./queryRDS');


module.exports.imageTagging = async (event, context) => {

  let response = await queryRDS.tagSurveillanceImages();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
