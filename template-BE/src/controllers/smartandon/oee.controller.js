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
      ORDER BY DEV_NAME ASC
    `, { type: mariadbSequelize.QueryTypes.SELECT });

    // Placeholder data for OEE per line
    const placeholderOee = [
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'LPDC',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'HPDC',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'CAM SHAFT',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'CYLINDER HEAD',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'CYLINDER BLOCK',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'CRANK SHAFT',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'ASSY LINE',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
    ];

    if (!oee || oee.length === 0) {
      return res.status(httpStatus.OK).json(placeholderOee);
    }

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

    // Placeholder data for cumulative OEE
    const placeholderCumulativeOee = [
      {
        ID: 0,
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'Line 1',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        ID: 1,
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'Line 2',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
      {
        ID: 2,
        CLIENT_HDL: 'placeholder',
        DEV_NAME: 'Line 3',
        GROUP_NAME: 'PROD',
        TAG_NAME: 'OEE',
        REG_VALUE: 0,
        TR_TIME: null,
        CONNECT_STAT: 0,
        ADDRESS: 'N/A',
      },
    ];

    if (!oeeView || oeeView.length === 0) {
      return res.status(httpStatus.OK).json(placeholderCumulativeOee);
    }

    res.status(httpStatus.OK).json(oeeView);
  } catch (error) {
    next(error);
  }
};

const getOEETarget = async (req, res, next) => {
  try {
    const oeeTarget = await mariadbSequelize.query(`
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
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeeTarget);
  } catch (error) {
    next(error);
  }
};

const getOEEActual = async (req, res, next) => {
  try {
    const oeeActual = await mariadbSequelize.query(`
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
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeeActual);
  } catch (error) {
    next(error);
  }
};

const getOEEPlan = async (req, res, next) => {
  try {
    const oeePlan = await mariadbSequelize.query(`
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
    `, { type: mariadbSequelize.QueryTypes.SELECT });
    res.status(httpStatus.OK).json(oeePlan);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getOEE,
  getOEEView,
  getOEETarget,
  getOEEActual,
  getOEEPlan
};
