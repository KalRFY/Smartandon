const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getMachine = async (req, res, next) => {
  try {
    const [machines, metadata] = await sequelize.query(`
      SELECT fid, line_id, fline, fmc_name, fmaker, idx_pos, fsn, fweight, fdate, fop_desc, fcell, fpost,
             isNotifTl, isNotifGl, isNotifSh, isNotifDph, isNotifDdh, created_by, created_at, updated_by, updated_at,
             is_deleted, foperation_no, ftype
      FROM tb_mc
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(machines);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMachine,
};
