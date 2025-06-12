const httpStatus = require('http-status');

const defaultController = async (req, res, next) => {
    return res.status(httpStatus.OK).json({
        message: 'Welcome to the Realtime Pareto Controller',
        status: httpStatus.OK,
    });
};

module.exports = {
    defaultController,
};