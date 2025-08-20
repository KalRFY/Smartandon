const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const postgresqlSequelize = require('../../config/postgresqldb');

const getSpareparts = async (req, res, next) => {
  try {
    const [spareparts] = await postgresqlSequelize.query(`
      SELECT
        material_number,
        sparepart_nm,
        uom,
        mrp,
        rop,
        rov,
        lead_time,
        sparepart_id,
        uuid,
        created_by,
        changed_dt,
        changed_by,
        created_dt,
        stock,
        price,
        vendor,
        status,
        replacement_material_number
      FROM tb_m_spareparts
      WHERE sparepart_id IS NOT NULL
      ORDER BY sparepart_id ASC
    `);

    console.log("Sparepart count:", spareparts.length);
    res.status(httpStatus.OK).json({
      success: true,
      data: spareparts,
      count: spareparts.length
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpareparts,
};