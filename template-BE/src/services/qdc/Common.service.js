const httpStatus = require('http-status');
const { Gauge } = require('../../models');
const ApiError = require('../../utils/ApiError');

module.exports = (sequelize, Sequelize) => {
  class CommonService {

    /**
     * Get Line
     */
    static searchLine = async () => {
      return new Promise(async (resolve, reject) => {
        await sequelize.query(
          "qdc_common_line_data",
          Sequelize.QueryTypes.SELECT
        )
          .then(result => resolve(result))
          .catch(error => reject(error));
      });
    };

    static fetchColorDash = async () => {
      return new Promise(async (resolve, reject) => {
        await sequelize.query(
          "SELECT * FROM v_color_dash",
          Sequelize.QueryTypes.SELECT
        )
          .then(result => resolve(result))
          .catch(error => reject(error));
      });
    };

    static fetchDelayProblemCm = async () => {
      return new Promise(async (resolve, reject) => {
        await sequelize.query(
          "SELECT * FROM v_current_error_2 WHERE fdur >= 120",
          Sequelize.QueryTypes.SELECT
        )
          .then(result => resolve([result]))
          .catch(error => reject(error));
      });
    };
  }

  return CommonService;
};