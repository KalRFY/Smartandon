const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getProblem = async (req, res, next) => {
  try {
    const [problems, metadata] = await sequelize.query(`
      SELECT fid, line_id, fline, fmc_name, fmaker, idx_pos, fsn, fweight, fdate, fop_desc, fcell, fpost,
             isNotifTl, isNotifGl, isNotifSh, isNotifDph, isNotifDdh, created_by, created_at, updated_by, updated_at,
             is_deleted, foperation_no, ftype
      FROM tb_mc
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(problems);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblem,
};
