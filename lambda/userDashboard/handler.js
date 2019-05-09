const queryRDS = require('./rds_service');

module.exports.dashboard = async (event, context, callback) => {
  
  let from_date = 1557152591;
  let to_date = 1557152595;
  let user_name = "Benedict";
  let response = await queryRDS.getSurveillanceImages(from_date, to_date, user_name);
  // console.log(response);
  return {
    statusCode: 200,
    body: response
  };
 
};
