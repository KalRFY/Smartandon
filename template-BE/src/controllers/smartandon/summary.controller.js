const { sequelize, Sequelize } = require('../../models');
const CommonService = require('../../services/qdc/Common.service')(sequelize, Sequelize);

exports.getLTBSummary = async (req, res, next) => {
  try {
    const delayedNested = await CommonService.fetchDelayProblemCm();
    const delayed = Array.isArray(delayedNested[0])
      ? delayedNested[0]
      : delayedNested;

    res.json({
      message: 'LTB Summary fetched successfully',
      data: {
        delayProblems: delayed,
        count: [0, 0, 0, 0],
        countFin: [0, 0, 0, 0]
      }
    });
  } catch (err) {
    next(err);
  }
};