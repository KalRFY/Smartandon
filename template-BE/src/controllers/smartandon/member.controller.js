const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getMember = async (req, res, next) => {
  try {
    const [members, metadata] = await sequelize.query(`
      SELECT
        fid,
        fname,
        fnoreg,
        farea,
        fline,
        fshift,
        frole,
        fwa_no,
        approval,
        fmt_id,
        fimage,
        line_nm
      FROM tb_mt_member
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(members);
  } catch (error) {
    next(error);
  }
  
};

module.exports = {
  getMember,
};