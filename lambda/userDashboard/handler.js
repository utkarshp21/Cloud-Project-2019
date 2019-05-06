const queryRDS = require('./queryRDS');

module.exports.dashboard = async (event, context, callback) => {

  let response = await queryRDS.getSurveillanceImages();

  return {
    statusCode: 200,
    body: response
  };
 
};
