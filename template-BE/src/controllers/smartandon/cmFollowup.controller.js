const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getFollowups = async (req, res, next) => {
  try {
    const { start, finish, line, machine, shift, keyword } = req.query;

    let whereClause = '';
    if (!keyword) {
      const conditions = [];
      if (start) conditions.push(`p.date_problem >= '${start}'`);
      if (finish) conditions.push(`p.date_problem <= '${finish}'`);
      if (line) conditions.push(`p.line = '${line}'`);
      if (machine) conditions.push(`p.machine = '${machine}'`);
      if (shift) conditions.push(`p.shift = '${shift}'`);
      if (conditions.length > 0) {
        whereClause = 'WHERE ' + conditions.join(' AND ');
      }
    }

    const [rows] = await sequelize.query(`
      SELECT
        p.id            AS problem_id,
        p.line,
        p.machine,
        p.date_problem,
        p.description   AS problem_desc,
        TIMESTAMPDIFF(MINUTE, p.date_problem, c.due_date) AS duration,
        p.rootcause,
        c.description   AS cm_desc,
        c.due_date,
        c.pic,
        c.status,
        c.kategori,
        c.schedule_month
      FROM problems p
      JOIN countermeasures c ON c.problem_id = p.id
      ${whereClause}
      ORDER BY p.date_problem ASC
    `);

    res.status(httpStatus.OK).json(rows);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getFollowups,
};
