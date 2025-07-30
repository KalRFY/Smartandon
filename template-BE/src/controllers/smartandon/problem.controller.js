/* eslint-disable no-console */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-await-in-loop */
const httpStatus = require('http-status');
const { object } = require('joi');
const fs = require('fs');
const path = require('path');
const { sequelize } = require('../../models');

const getProblem = async (req, res, next) => {
  try {
    const [problems, metadata] = await sequelize.query(`
      SELECT
        fid,
        fmc_id,
        freg,
        fbit,
        ferror_name,
        ferror_detail,
        fstart_time,
        fend_time,
        foperator,
        fshift,
        freal_prob,
        fav_categoty,
        froot_cause,
        fstep_repair,
        fpart_change,
        fpermanet_cm,
        fwhy_analisys,
        fpdf_report,
        fimage,
        fDescImage,
        keywords,
        fpermanet_cm_lama,
        fyokoten,
        fyokoten_pic,
        fyokoten_date,
        fiveWhyLhApprove,
        fiveWhyShApprove,
        fiveWhyShFeedback,
        fiveWhyLhFeedback,
        cmLhApprove,
        cmShApprove,
        cmShFeedback,
        cmLhFeedback,
        temporaryAction,
        cmDhApprove,
        cmDhFeedback,
        cmTlApprove,
        cmTlFeedback,
        fattachment,
        fjob_id,
        id_m_problem_member,
        why1_img,
        fstep_new,
        gapIlustrasi,
        why2_img,
        why12_img,
        why22_img,
        file_report,
        oCategory,
        qCategory,
        problemCategory
      FROM tb_error_log_2
      WHERE fid IS NOT NULL
      ORDER BY fid ASC
    `);
    res.status(httpStatus.OK).json(problems);
  } catch (error) {
    next(error);
  }
};

const getProblemView = async (req, res, next) => {
  try {
    console.log(`===============================${req}===============================`);
    console.log(req);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const offset = (page - 1) * limit;

    const { startDate } = req.query;
    const { finishDate } = req.query;
    const { machineName } = req.query;
    const { line } = req.query;
    const { problem } = req.query;
    const { problemCategory } = req.query;

    // Build where clause for date filtering
    let whereClause = 'WHERE fid IS NOT NULL';
    const replacements = {};

    if (startDate || finishDate) {
      if (startDate == finishDate) {
        whereClause += ` AND fstart_time LIKE '%${startDate}%'`;
        whereClause += ` AND fstart_time LIKE '%${finishDate}%'`;
      } else {
        if (startDate) {
          whereClause += ` AND fstart_time >= '${startDate}'`;
          replacements.startDate = startDate;
        }
        if (finishDate) {
          whereClause += ` AND fend_time <= '${finishDate}'`;
          replacements.finishDate = finishDate;
        }
      }
    }
    if (machineName) {
      whereClause += ` AND fmc_name LIKE '%${machineName}%'`;
    }
    if (line) {
      whereClause += ` AND line_id = ${line}`;
    }
    if (problem) {
      whereClause += ` AND ferror_name LIKE '%${problem}%'`;
    }

    if (problemCategory) {
      whereClause += ` AND (problemCategory = ${problemCategory}`;
      if (problemCategory == 3) {
        whereClause += ` 
          OR (
            ((fdur >= 120 AND fdur < 659) AND (line_id = 1 OR line_id = 2)) OR
            ((fdur >= 120 AND fdur < 359) AND (line_id IN (3,4,5,6))) OR
            (fdur >= 15 AND fdur < 179 AND line_id = 7)
          )
        `;
      } else if (problemCategory == 4) {
        whereClause += ` 
          OR (
          ((fdur >= 659) AND (line_id = 1 OR line_id = 2)) OR
          ((fdur >= 359) AND (line_id IN (3,4,5,6))) OR
          (fdur >= 179 AND line_id = 7)
        )
        `;
      }
      whereClause += `)`;
    }

    // if (problemCategory == 4) {
    //   whereClause += `
    //     OR (
    //       ((fdur >= 659) AND (line_id = 1 OR line_id = 2)) OR
    //       ((fdur >= 359) AND (line_id IN (3,4,5,6))) OR
    //       (fdur >= 179 AND line_id = 7)
    //     )
    //   `;
    //   whereClause += `)`;
    // }

    console.log('KONTOL');
    console.log(whereClause);

    // Query total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM v_current_error_2
      ${whereClause}
    `;
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const { total } = countResult[0];

    // Query paginated data
    const dataQuery = `
      SELECT
        fid,
        line_id,
        fline,
        fmc_name,
        fmaker,
        foperation_no,
        freg,
        fbit,
        ferror_name,
        ferror_detail,
        fstart_time,
        fend_time,
        fdur,
        foperator,
        fshift,
        freal_prob,
        fav_categoty,
        froot_cause,
        fstep_repair,
        fpart_change,
        fpermanet_cm,
        fwhy_analisys,
        fpdf_report,
        fimage,
        fDescImage,
        tmp,
        fpermanet_cm_lama,
        fyokoten,
        fyokoten_date,
        fyokoten_pic,
        fiveWhyLhApprove,
        fiveWhyShApprove,
        fiveWhyLhFeedback,
        fiveWhyShFeedback,
        cmLhApprove,
        cmShApprove,
        cmLhFeedback,
        cmShFeedback,
        temporaryAction,
        cmDhApprove,
        cmDhFeedback,
        cmTlApprove,
        cmTlFeedback,
        fattachment,
        id_m_problem_member,
        id_member_thema,
        fname_theme_member,
        fimage_member,
        why1_img,
        fstep_new,
        gapIlustrasi,
        why2_img,
        why12_img,
        why22_img,
        oCategory,
        qCategory,
        problemCategory,
        file_report
      FROM v_current_error_2
      ${whereClause}
      ORDER BY fid ASC
      LIMIT :limit OFFSET :offset
    `;
    replacements.limit = limit;
    replacements.offset = offset;

    const [problemsView] = await sequelize.query(dataQuery, {
      replacements,
    });

    res.status(httpStatus.OK).json({
      total,
      page,
      limit,
      data: problemsView,
    });
  } catch (error) {
    next(error);
  }
};

const getProblemById = async (req, res, next) => {
  try {
    const { fid } = req.params;
    const query = `
      SELECT
        fid,
        line_id,
        fline,
        fmc_name,
        fmaker,
        foperation_no,
        freg,
        fbit,
        ferror_name,
        ferror_detail,
        fstart_time,
        fend_time,
        fdur,
        foperator,
        fshift,
        freal_prob,
        fav_categoty,
        froot_cause,
        fstep_repair,
        fpart_change,
        fpermanet_cm,
        fwhy_analisys,
        fpdf_report,
        fimage,
        fDescImage,
        tmp,
        fpermanet_cm_lama,
        fyokoten,
        fyokoten_date,
        fyokoten_pic,
        fiveWhyLhApprove,
        fiveWhyShApprove,
        fiveWhyLhFeedback,
        fiveWhyShFeedback,
        cmLhApprove,
        cmShApprove,
        cmLhFeedback,
        cmShFeedback,
        temporaryAction,
        cmDhApprove,
        cmDhFeedback,
        cmTlApprove,
        cmTlFeedback,
        fattachment,
        id_m_problem_member,
        id_member_thema,
        fname_theme_member,
        fimage_member,
        why1_img,
        fstep_new,
        gapIlustrasi,
        why2_img,
        why12_img,
        why22_img,
        oCategory,
        qCategory,
        problemCategory,
        file_report
      FROM v_current_error_2
      WHERE fid = :fid
      LIMIT 1
    `;
    const [result] = await sequelize.query(query, {
      replacements: { fid },
    });
    if (result.length === 0) {
      return res.status(httpStatus.NOT_FOUND).json({ message: 'Problem not found' });
    }
    res.status(httpStatus.OK).json(result[0]);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const {
      machineName,
      lineName,
      problemDescription,
      operator,
      fid,
      maker,
      operationNo,
      avCategory,
      shift,
      startDate,
      finishDate,
      durationMin,
      problemCategory,
      itemTemporaryAction,
      rootcauses5Why,
      stepRepair,
      partChange,
      countermeasureKenapaTerjadi,
      yokoten,
      rootcause5WhyKenapaLama,
      tambahAnalisisLama,
      tambahAnalysisTerjadi,
      whyImage,
      whyLamaImage,
      comments5WhySH,
      comments5WhyLH,
      commentsCountermeasure,
      attachmentMeeting,
      file_report,
      uploadFile,
      actualImage,
      uploadImage,
      ilustrasiActual,
      ilustrasiStandart,
      standartImage,
      gapBetweenStandarAndActual,
      uraianKejadian,
      agreeTerms,
      countermeasureKenapaLama,
      pilihFocusThemaMember,
      pilihTaskforce,
      pilihO6,
      pilihQ6,
      comments5Why,
      lastReportFile,
      oCategory,
      qCategory,
    } = req.body;
    console.log('UPDATE PROBLEM BODY:', req.body);

    if (!fid) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Problem ID (fid) is required' });
    }

    const updateFields = [];
    const replacements = {
      machineName,
      lineName,
      problemDescription,
      operator,
      fid,
      maker,
      operationNo,
      avCategory,
      shift,
      startDate,
      finishDate,
      durationMin,
      problemCategory,
      itemTemporaryAction,
      rootcauses5Why,
      stepRepair,
      partChange,
      countermeasureKenapaTerjadi,
      yokoten,
      rootcause5WhyKenapaLama,
      tambahAnalisisLama,
      tambahAnalysisTerjadi,
      whyImage,
      whyLamaImage,
      comments5WhySH,
      comments5WhyLH,
      commentsCountermeasure,
      attachmentMeeting,
      file_report,
      uploadFile,
      actualImage,
      uploadImage,
      ilustrasiActual,
      ilustrasiStandart,
      standartImage,
      gapBetweenStandarAndActual,
      uraianKejadian,
      agreeTerms,
      countermeasureKenapaLama,
      pilihFocusThemaMember,
      pilihTaskforce,
      pilihO6,
      pilihQ6,
      oCategory,
      qCategory,
      comments5Why,
      lastReportFile,
    };

    // if (machineName !== undefined) {
    //   updateFields.push('fmc_name = :machineName');
    //   replacements.machineName = machineName;
    // }
    // if (lineName !== undefined) {
    //   updateFields.push('fline = :lineName');
    //   replacements.lineName = lineName;
    // }
    // if (problemDescription !== undefined) {
    //   updateFields.push('ferror_name = :problemDescription');
    //   replacements.problemDescription = problemDescription;
    // }
    // if (uraianKejadian !== undefined) {
    //   updateFields.push('ferror_detail = :uraianKejadian');
    //   replacements.uraianKejadian = uraianKejadian;
    // }
    // if (uploadImage !== undefined) {
    //   updateFields.push('fupload_image = :uploadImage');
    //   replacements.uploadImage = uploadImage;
    // }
    // if (standartImage !== undefined) {
    //   updateFields.push('fstandart_image = :standartImage');
    //   replacements.standartImage = standartImage;
    // }
    // if (ilustrasiStandart !== undefined) {
    //   updateFields.push('filustrasi_standart = :ilustrasiStandart');
    //   replacements.ilustrasiStandart = ilustrasiStandart;
    // }
    // if (ilustrasiActual !== undefined) {
    //   updateFields.push('filustrasi_actual = :ilustrasiActual');
    //   replacements.ilustrasiActual = ilustrasiActual;
    // }
    // if (actualImage !== undefined) {
    //   updateFields.push('factual_image = :actualImage');
    //   replacements.actualImage = actualImage;
    // }
    // if (gapBetweenStandarAndActual !== undefined) {
    //   updateFields.push('fgap_between_standar_and_actual = :gapBetweenStandarAndActual');
    //   replacements.gapBetweenStandarAndActual = gapBetweenStandarAndActual;
    // }
    // if (pilihFocusThemaMember !== undefined) {
    //   updateFields.push('fpilih_focus_thema_member = :pilihFocusThemaMember');
    //   replacements.pilihFocusThemaMember = pilihFocusThemaMember;
    // }
    // if (pilihTaskforce !== undefined) {
    //   updateFields.push('fpilih_taskforce = :pilihTaskforce');
    //   replacements.pilihTaskforce = pilihTaskforce;
    // }
    // if (operator !== undefined) {
    //   updateFields.push('foperator = :operator');
    //   replacements.operator = operator;
    // }
    // if (avCategory !== undefined) {
    //   updateFields.push('fav_category = :avCategory');
    //   replacements.avCategory = avCategory;
    // }
    // if (shift !== undefined) {
    //   updateFields.push('fshift = :shift');
    //   replacements.shift = shift;
    // }
    // if (startDate !== undefined) {
    //   updateFields.push('fstart_time = :startDate');
    //   replacements.startDate = startDate;
    // }
    // if (finishDate !== undefined) {
    //   updateFields.push('fend_time = :finishDate');
    //   replacements.finishDate = finishDate;
    // }
    // if (durationMin !== undefined) {
    //   updateFields.push('fdur = :durationMin');
    //   replacements.durationMin = durationMin;
    // }
    // if (problemCategory !== undefined) {
    //   updateFields.push('fproblem_category = :problemCategory');
    //   replacements.problemCategory = problemCategory;
    // }
    // if (itemTemporaryAction !== undefined) {
    //   updateFields.push('ftemporary_action = :itemTemporaryAction');
    //   replacements.itemTemporaryAction = itemTemporaryAction;
    // }
    // if (rootcauses5Why !== undefined) {
    //   updateFields.push('frootcauses_5_why = :rootcauses5Why');
    //   replacements.rootcauses5Why = rootcauses5Why;
    // }
    // if (tambahAnalysisTerjadi !== undefined) {
    //   updateFields.push('ftambah_analysis_terjadi = :tambahAnalysisTerjadi');
    //   replacements.tambahAnalysisTerjadi = tambahAnalysisTerjadi;
    // }
    // if (whyImage !== undefined) {
    //   updateFields.push('fwhy_image = :whyImage');
    //   replacements.whyImage = whyImage;
    // }
    // if (pilihO6 !== undefined) {
    //   updateFields.push('fpilih_o6 = :pilihO6');
    //   replacements.pilihO6 = pilihO6;
    // }
    // if (stepRepair !== undefined) {
    //   updateFields.push('fstep_repair = :stepRepair');
    //   replacements.stepRepair = stepRepair;
    // }
    // if (partChange !== undefined) {
    //   updateFields.push('fpart_change = :partChange');
    //   replacements.partChange = partChange;
    // }
    // if (countermeasureKenapaTerjadi !== undefined) {
    //   updateFields.push('fcountermeasure_kenapa_terjadi = :countermeasureKenapaTerjadi');
    //   replacements.countermeasureKenapaTerjadi = countermeasureKenapaTerjadi;
    // }
    // if (yokoten !== undefined) {
    //   updateFields.push('fyokoten = :yokoten');
    //   replacements.yokoten = yokoten;
    // }
    // if (rootcause5WhyKenapaLama !== undefined) {
    //   updateFields.push('frootcause_5_why_kenka_lama = :rootcause5WhyKenapaLama');
    //   replacements.rootcause5WhyKenkaLama = rootcause5WhyKenapaLama;
    // }
    // if (tambahAnalisisLama !== undefined) {
    //   updateFields.push('ftambah_analisis_lama = :tambahAnalisisLama');
    //   replacements.tambahAnalisisLama = tambahAnalisisLama;
    // }
    // if (pilihQ6 !== undefined) {
    //   updateFields.push('fpilih_q6 = :pilihQ6');
    //   replacements.pilihQ6 = pilihQ6;
    // }
    // if (whyLamaImage !== undefined) {
    //   updateFields.push('fwhy_lama_image = :whyLamaImage');
    //   replacements.whyLamaImage = whyLamaImage;
    // }
    // if (countermeasureKenapaLama !== undefined) {
    //   updateFields.push('fcountermeasure_kenka_lama = :countermeasureKenapaLama');
    //   replacements.countermeasureKenkaLama = countermeasureKenapaLama;
    // }
    // if (attachmentMeeting !== undefined) {
    //   updateFields.push('fattachment_meeting = :attachmentMeeting');
    //   replacements.attachmentMeeting = attachmentMeeting;
    // }
    // if (comments5Why !== undefined) {
    //   updateFields.push('fcomments_5_why = :comments5Why');
    //   replacements.comments5Why = comments5Why;
    // }
    // if (commentsCountermeasure !== undefined) {
    //   updateFields.push('fcomments_countermeasure = :commentsCountermeasure');
    //   replacements.commentsCountermeasure = commentsCountermeasure;
    // }
    // if (lastReportFile !== undefined) {
    //   updateFields.push('flast_report_file = :lastReportFile');
    //   replacements.lastReportFile = lastReportFile;
    // }
    // if (uploadFile !== undefined) {
    //   updateFields.push('fupload_file = :uploadFile');
    //   replacements.uploadFile = uploadFile;
    // }

    // if (updateFields.length === 0) {
    //   return res.status(httpStatus.BAD_REQUEST).json({ message: 'No fields to update' });
    // }

    if (req.files) {
      console.log('Files uploaded:', req.files);
      if (req.files.actualImage) {
        const fileObj = req.files.actualImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.actualImage = newPath;
      }
      if (req.files.uploadImage) {
        const fileObj = req.files.uploadImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.uploadImage = newPath;
      }
      if (req.files.standartImage) {
        const fileObj = req.files.standartImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.standartImage = newPath;
      }
      if (req.files.whyImage) {
        const fileObj = req.files.whyImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.whyImage = newPath;
      }
      if (req.files.whyLamaImage) {
        const fileObj = req.files.whyLamaImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.whyLamaImage = newPath;
      }
      if (req.files.uploadFile) {
        const fileObj = req.files.uploadFile[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.uploadFile = newPath;
      }
      if (req.files.attachmentMeeting) {
        const fileObj = req.files.attachmentMeeting[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = fileObj.path + ext;
        fs.renameSync(fileObj.path, newPath);
        replacements.attachmentMeeting = newPath;
      }
    }

    console.log('Replacements:', replacements);

    const updateQuery = `
      UPDATE tb_error_log_2 t1
      JOIN tb_mc t2 ON t1.fmc_id = t2.fid
      LEFT JOIN m_problem_member mpm ON t1.fid = mpm.id_m_problem
      LEFT JOIN tb_mt_member tmm ON tmm.fid = mpm.id_m_member
      SET 
        t1.fmc_id = t2.fid,
        t1.ferror_name = :problemDescription,
        t1.foperator = :operator,
        t1.fiveWhyShFeedback = :comments5WhySH,
        t1.fiveWhyLhFeedback = :comments5WhyLH,
        t1.temporaryAction = :itemTemporaryAction,
        t1.fpart_change = :partChange,
        t1.oCategory = :oCategory,
        t1.qCategory = :qCategory,
        t1.fyokoten = :yokoten,
        t1.problemCategory = :problemCategory,
        t1.why1_img = :whyImage,
        t1.why2_img = :whyLamaImage
      WHERE t1.fid = :fid;
    `;
    await sequelize.query(updateQuery, { replacements });

    const tbUraianData = {
      general: replacements.uploadImage,
      actual: replacements.actualImage,
      standard: replacements.standartImage,
    };

    for (const key of Object.keys(tbUraianData)) {
      if (tbUraianData[key]) {
        const updateUraianQuery = `
          UPDATE tb_r_uraian t1
          SET t1.ilustration = :ilustration_${key}
          WHERE t1.error_id = :fid AND t1.type_uraian = :type_uraian_${key}
        `;
        const uraianReplacements = {
          fid: replacements.fid,
          [`type_uraian_${key}`]: key,
          [`ilustration_${key}`]: tbUraianData[key],
        };
        await sequelize.query(updateUraianQuery, { replacements: uraianReplacements });
      }
    }

    res.status(httpStatus.OK).json({ status: 'success', message: 'Problem updated successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProblem,
  getProblemView,
  getProblemById,
  updateProblem,
};
