const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getFollowups = async (req, res, next) => {
  try {
    const { start, finish, line, machine, shift, keyword } = req.query;

    let conditions = [];
    let replacements = {};

    if (start) {
      conditions.push('DATE(p.date_problem) >= :start');
      replacements.start = start;
    }
    if (finish) {
      conditions.push('DATE(p.date_problem) <= :finish');
      replacements.finish = finish;
    }
    if (line) {
      conditions.push('p.line = :line');
      replacements.line = line;
    }
    if (machine) {
      conditions.push('p.machine = :machine');
      replacements.machine = machine;
    }
    if (shift) {
      conditions.push('p.shift = :shift');
      replacements.shift = shift;
    }
    if (keyword) {
      conditions.push('(p.description LIKE :keyword OR c.description LIKE :keyword)');
      replacements.keyword = `%${keyword}%`;
    }

    const whereClause = conditions.length > 0 ? 'WHERE ' + conditions.join(' AND ') : '';

    const [rows] = await sequelize.query(
      `
      SELECT
        p.id            AS problem_id,
        p.line,
        p.machine,
        p.date_problem AS date,
        p.description  AS problem,
        TIMESTAMPDIFF(MINUTE, p.date_problem, c.due_date) AS duration,
        p.rootcause,
        c.description   AS countermeasure,
        c.due_date      AS dueDate,
        c.pic,
        c.status,
        c.kategori,
        c.schedule_month AS schedule
      FROM problems p
      LEFT JOIN countermeasures c ON c.problem_id = p.id
      ${whereClause}
      ORDER BY p.date_problem ASC
      `,
      { replacements }
    );

    const data = rows.map((r, idx) => ({
      no: idx + 1,
      line: r.line,
      machine: r.machine,
      date: r.date,
      problem: r.problem,
      duration: r.duration,
      rootcause: r.rootcause || '-',
      countermeasure: r.countermeasure || '-',
      dueDate: r.dueDate || '-',
      pic: r.pic || '-',
      status: r.status || 'NOT YET',
      reason_occurred: r.kategori === 'Cause of Occurrence' || r.status === 'NOT YET',
      reason_delayed: r.kategori === 'Cause of Delay',
      schedule: r.schedule ? r.schedule.split(',').map(Number) : [],
    }));

    res.status(httpStatus.OK).json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = { getFollowups };
