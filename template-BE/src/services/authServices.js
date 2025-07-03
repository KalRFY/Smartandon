const { token } = require('morgan');
const { sequelize } = require('../models');
const { encryptPassword, comparePassword, generateLoginToken } = require('../utils/authUtils');

const registerService = async ({ name, noreg, phone, isAdmin }) => {
  const checkUserQuery = `SELECT name FROM qcc_m_users WHERE noreg = :noreg LIMIT 1`;
  const existingUser = await sequelize.query(checkUserQuery, {
    replacements: { noreg },
    type: sequelize.QueryTypes.SELECT,
  });
  if (existingUser.length > 0) {
    throw new Error('User with this Noreg already exists');
  }
  const first4Digit = phone.slice(0, 4);
  const password = `${first4Digit}`;

  const newId = (await getLastId()) + 1;
  const insertUserQuery = `INSERT INTO qcc_m_users (id, name, password, noreg, instance, is_admin) VALUES (:id, :name, :password, :noreg, :instance, :isAdmin)`;
  await sequelize.query(insertUserQuery, {
    replacements: { id: newId, name, password: encryptPassword(password), noreg, instance: null, isAdmin: isAdmin || 0 },
    type: sequelize.QueryTypes.INSERT,
  });
  return {
    name,
    noreg,
  };
};

const loginService = async ({ noreg, password }) => {
  const query = `SELECT id, name, noreg, password FROM qcc_m_users WHERE noreg = :noreg LIMIT 1`;
  const user = await sequelize.query(query, {
    replacements: { noreg },
    type: sequelize.QueryTypes.SELECT,
  });

  if (user.length === 0) {
    throw new Error('Invalid Noreg');
  }
  const isPasswordValid = comparePassword(password, user[0].password);
  if (!isPasswordValid) {
    throw new Error('Invalid password');
  }

  const jwtToken = generateLoginToken({
    id: user[0].id,
    noreg: user[0].noreg,
    name: user[0].name,
  });

  return {
    name: user[0].name,
    noreg: user[0].noreg,
    token: jwtToken,
  };
};

const getLastId = async () => {
  const query = `SELECT MAX(id) AS lastId FROM qcc_m_users`;
  const result = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT,
  });
  return result[0].lastId || 0;
};

module.exports = {
  registerService,
  loginService,
};
