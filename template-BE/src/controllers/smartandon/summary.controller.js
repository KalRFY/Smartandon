const httpStatus = require('http-status');
const { sequelize } = require('../../models');

const getLTBSummary = async (req, res, next) => {
  try {
    const raw = await sequelize.query(
      `SELECT 
     fid, fline, fmc_name, ferror_name, fstart_time, fdur,
     cmTlApprove, cmLhApprove, cmShApprove, cmDhApprove,
     cmTlFeedback, cmLhFeedback, cmShFeedback, cmDhFeedback
   FROM v_current_error_2
   WHERE (fline = 'ASSY LINE' AND fdur >= 15)
   OR (fline <> 'ASSY LINE' AND fdur >= 120)`,
      { type: sequelize.QueryTypes.SELECT }
    );

    const mapStatus = (approve, thresholdDays, feedbackField) => {
      if (approve === 1) return 'dotApprove';
      const daysSince = (d) =>
        (Date.now() - new Date(d).getTime()) / (1000 * 3600 * 24);
      if (daysSince(approve === 0 ? feedbackField.start : null) >= thresholdDays && !feedbackField.feedback)
        return 'dotDelay';
      if (feedbackField.feedback) return 'dotComment';
      return 'dot';
    };

    const data = raw.map(item => ({
      ...item,
      tlCheck: item.cmTlApprove === 1 ? 'dotApprove' : 'dot',
      lhCheck: item.cmLhApprove === 1 ? 'dotApprove' : 'dot',
      shCheck: item.cmShApprove === 1 ? 'dotApprove' : 'dot',
      dhCheck: +item.cmDhApprove === 1 ? 'dotApprove' : 'dot',
    }));

    res.status(httpStatus.OK).json({
      message: 'LTB Summary fetched successfully',
      data: {
        delayProblems: data,
        count: [0, 0, 0, 0],
        countFin: [0, 0, 0, 0],
      },
    });
  } catch (error) {
    next(error);
  }
  
};

module.exports = {
  getLTBSummary,
};