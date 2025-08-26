const path = require('path');
const fs = require('fs');
const { newMachineInput } = require('../../models');

const defaultController = (req, res, next) => {
  try {
    res.status(200).json({
      status: 'success',
      message: 'Dashboard API is working',
      data: {
        version: '1.0.0',
        endpoints: ['/dashboard', '/dashboard/metrics', '/dashboard/data', '/dashboard/machine-stop-input'],
      },
    });
  } catch (error) {
    next(error);
  }
};

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

const saveMachineStopInput = async (req, res, next) => {
  try {
    const { fid, errorID, machineName, lineName, problemDescription } = req.body;
    if (!machineName || !lineName || !problemDescription) {
      return res.status(400).json({ status: 'fail', message: 'Missing required fields' });
    }

    const newInput = await newMachineInput.create({
      fid,
      errorID,
      machineName,
      lineName,
      problemDescription,
    });

    res.status(201).json({ status: 'success', data: newInput });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardData,
  saveMachineStopInput,
  defaultController,
};
