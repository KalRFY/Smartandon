const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getFollowups = async (req, res, next) => {
  try {
    const { start, finish, line, machine, shift } = req.query;

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
      WHERE 1=1
        ${start    ? ` AND p.date_problem >= '${start}'`  : ''}
        ${finish   ? ` AND p.date_problem <= '${finish}'` : ''}
        ${line     ? ` AND p.line = '${line}'`            : ''}
        ${machine  ? ` AND p.machine = '${machine}'`      : ''}
        ${shift    ? ` AND p.shift = '${shift}'`          : ''}
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