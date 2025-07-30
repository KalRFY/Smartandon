/* eslint-disable no-console */
const fs = require('fs');
const stream = require('stream');
const path = require('path');
const httpStatus = require('http-status');
const { sequelize } = require('../../models');
const { generatedStepRepairCellDuration, mappedImageFile } = require('../../services/downloadService');

exports.downloadReport = async (req, res, next) => {
  try {
    const { fid, problem } = req.query;

    if (!fid || !problem) {
      console.error('Missing fid or problem parameter');
      return res.status(httpStatus.BAD_REQUEST).send('Missing fid or problem parameter');
    }

    // Query database for file_report path
    const query = `SELECT file_report FROM tb_error_log_2 WHERE fid = :fid LIMIT 1`;
    const [result] = await sequelize.query(query, {
      replacements: { fid },
    });

    if (result.length > 0 && result[0].file_report) {
      let filePath = result[0].file_report;
      filePath = path.normalize(filePath);
      if (fs.existsSync(filePath)) {
        console.log(`Serving uploaded report file: ${filePath}`);
        return res.download(filePath);
      }
      console.error(`Uploaded report file not found on server: ${filePath}`);
      return res.status(httpStatus.NOT_FOUND).send('Uploaded report file not found on server');
    }
    console.warn(`No file_report entry found in database for fid: ${fid}`);

    // Fallback: serve latest file in folder
    const targetDir = path.join(__dirname, '../../../reports/Uploads', `${fid}_${problem}`);

    console.log(`Hasil Dir: ${targetDir}`);

    if (!fs.existsSync(targetDir)) {
      console.error(`Report folder not found: ${targetDir}`);
      return res.status(httpStatus.NOT_FOUND).send('Report folder not found');
    }

    // Read files in the target directory
    const files = fs
      .readdirSync(targetDir)
      .filter((file) => file.endsWith('.xlsx'))
      .map((file) => ({
        name: file,
        time: fs.statSync(path.join(targetDir, file)).mtime.getTime(),
      }))
      .sort((a, b) => b.time - a.time);

    if (files.length === 0) {
      console.error(`No report files found in folder: ${targetDir}`);
      return res.status(httpStatus.NOT_FOUND).send('No report files found');
    }

    const latestFile = files[0].name;
    const filePath = path.join(targetDir, latestFile);

    console.log(`Serving latest report file from folder: ${filePath}`);
    res.download(filePath, latestFile);
  } catch (error) {
    console.error('Error downloading report:', error);
    next(error);
  }
};

exports.downloadTemplate = async (req, res, next) => {
  const { fid } = req.query;
  try {
    const vCurrentError2DataQuery = `SELECT * FROM v_current_error_2 WHERE fid = :fid`;
    const vCurrentError2Data = await sequelize.query(vCurrentError2DataQuery, {
      replacements: { fid },
      type: sequelize.QueryTypes.SELECT,
    });

    const tbRUraianDataQuery = `SELECT * FROM tb_r_uraian WHERE error_id = :fid`;
    const tbRUraianData = await sequelize.query(tbRUraianDataQuery, {
      replacements: { fid },
      type: sequelize.QueryTypes.SELECT,
    });

    const problemData = vCurrentError2Data[0] || {};
    const generatedExcelPath = await generatedStepRepairCellDuration(
      res,
      problemData,
      tbRUraianData,
      './reports/template/draft_ltb.xlsx'
    );
    await mappedImageFile(res, problemData, tbRUraianData, generatedExcelPath);
  } catch (error) {
    console.log(error);
    res.send('File Belum Lengkap! <a href="https:smartandonsys.web.app/problemHistory">Back</a>');
  }
};

exports.getImageController = async (req, res) => {
  const pathImage = `${req.query.path}`;
  const folderPath = path.dirname(pathImage);

  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  if (!fs.existsSync(pathImage)) {
    return res.status(404).send('File not found');
  }

  const r = fs.createReadStream(pathImage);
  const ps = new stream.PassThrough();

  stream.pipeline(r, ps, (err) => {
    if (err) {
      console.error(err);
      return res.sendStatus(400);
    }
  });

  ps.pipe(res);
};
