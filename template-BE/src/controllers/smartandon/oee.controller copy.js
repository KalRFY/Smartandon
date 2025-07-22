const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const mariadbSequelize = require('../../config/mariadb');

const getOEE = async (req, res, next) => {
  try {
    const oee = await mariadbSequelize.query(`
      SELECT
        CLIENT_HDL,
        DEV_NAME,
        GROUP_NAME,
        TAG_NAME,
        REG_VALUE,
        TR_TIME,
        CONNECT_STAT,
        ADDRESS
      FROM t_reg_status_lp
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%OEE%'
      ORDER BY GROUP_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oee);
  } catch (error) {
    next(error);
  }
};

const getOEEView = async (req, res, next) => {
  try {
    const [oeeView, metadata] = await mariadbSequelize.query(`
      SELECT
        ID,
        CLIENT_HDL,
        DEV_NAME,
        GROUP_NAME,
        TAG_NAME,
        REG_VALUE,
        TR_TIME,
        CONNECT_STAT,
        ADDRESS
      FROM t_reg_status_lp
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%OEE%'
      ORDER BY GROUP_NAME ASC
    `);
    res.status(httpStatus.OK).json(oeeView);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOEE,
  getOEEView
};
