const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const mariadbSequelize = require('../../config/mariadb');

const getOEE = async (req, res, next) => {
  try {
    const oee = await mariadbSequelize.query(
      `
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
      ORDER BY DEV_NAME ASC
    `,
      { type: mariadbSequelize.QueryTypes.SELECT }
    );

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
      ORDER BY DEV_NAME ASC
    `);

    res.status(httpStatus.OK).json(oeeView);
  } catch (error) {
    next(error);
  }
};

const getOEETarget = async (req, res, next) => {
  try {
    const oeeTarget = await mariadbSequelize.query(
      `
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%TARGET%'
      ORDER BY DEV_NAME ASC
    `,
      { type: mariadbSequelize.QueryTypes.SELECT }
    );
    res.status(httpStatus.OK).json(oeeTarget);
  } catch (error) {
    next(error);
  }
};

const getOEEActual = async (req, res, next) => {
  try {
    const oeeActual = await mariadbSequelize.query(
      `
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%ACTUAL%'
      ORDER BY DEV_NAME ASC
    `,
      { type: mariadbSequelize.QueryTypes.SELECT }
    );
    res.status(httpStatus.OK).json(oeeActual);
  } catch (error) {
    next(error);
  }
};

const getOEEPlan = async (req, res, next) => {
  try {
    const oeePlan = await mariadbSequelize.query(
      `
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
      WHERE GROUP_NAME LIKE '%PROD%' AND TAG_NAME LIKE '%PLAN%'
      ORDER BY DEV_NAME ASC
    `,
      { type: mariadbSequelize.QueryTypes.SELECT }
    );
    res.status(httpStatus.OK).json(oeePlan);
  } catch (error) {
    next(error);
  }
};

const getOEESmartandon = async (req, res, next) => {
  try {
    const [oeeDataSmartandon, metadata] = await sequelize.query(`
      SELECT
        fid,
        fline,
        fplan,
        ftarget,
        factual,
        foee,
        fstop_com
      FROM v_prod
      WHERE fid IS NOT NULL
      ORDER BY fline ASC
    `);
    res.status(httpStatus.OK).json(oeeDataSmartandon);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOEE,
  getOEEView,
  getOEETarget,
  getOEEActual,
  getOEEPlan,
  getOEESmartandon,
};
