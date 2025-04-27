const path = require('path');
const fs = require('fs');

const getDashboardData = (req, res, next) => {
  try {
    const dataPath = path.resolve(__dirname, '../../data/dashboardData');
    const rawData = fs.readFileSync(dataPath);
    const data = JSON.parse(rawData);
    res.json(data);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
};
