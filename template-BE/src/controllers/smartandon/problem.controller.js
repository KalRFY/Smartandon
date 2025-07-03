const httpStatus = require('http-status');
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
    console.log("===============================" + req + "===============================");
    console.log(req);
    let page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 100;
    let offset = (page - 1) * limit;

    const startDate = req.query.startDate;
    const finishDate = req.query.finishDate;
    const machineName = req.query.machineName;
    const line = req.query.line;
    const problem = req.query.problem;

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
    
    console.log("KONTOL");
    console.log(whereClause);

    // Query total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM v_current_error_2
      ${whereClause}
    `;
    const [countResult] = await sequelize.query(countQuery, { replacements });
    const total = countResult[0].total;

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
    const fid = req.params.fid;
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
      fid,
      machineName,
      lineName,
      problemDescription,
      uraianKejadian,
      uploadImage,
      standartImage,
      ilustrasiStandart,
      ilustrasiActual,
      actualImage,
      gapBetweenStandarAndActual,
      pilihFocusThemaMember,
      pilihTaskforce,
      operator,
      avCategory,
      shift,
      startDate,
      finishDate,
      durationMin,
      problemCategory,
      itemTemporaryAction,
      rootcauses5Why,
      tambahAnalysisTerjadi,
      whyImage,
      pilihO6,
      stepRepair,
      partChange,
      countermeasureKenapaTerjadi,
      yokoten,
      rootcause5WhyKenkaLama,
      tambahAnalisisLama,
      pilihQ6,
      whyLamaImage,
      countermeasureKenkaLama,
      attachmentMeeting,
      comments5Why,
      commentsCountermeasure,
      lastReportFile,
      uploadFile,
    } = req.body;

    if (!fid) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Problem ID (fid) is required' });
    }

    const updateFields = [];
    const replacements = { fid };

    if (machineName !== undefined) {
      updateFields.push('fmc_name = :machineName');
      replacements.machineName = machineName;
    }
    if (lineName !== undefined) {
      updateFields.push('fline = :lineName');
      replacements.lineName = lineName;
    }
    if (problemDescription !== undefined) {
      updateFields.push('ferror_name = :problemDescription');
      replacements.problemDescription = problemDescription;
    }
    if (uraianKejadian !== undefined) {
      updateFields.push('ferror_detail = :uraianKejadian');
      replacements.uraianKejadian = uraianKejadian;
    }
    if (uploadImage !== undefined) {
      updateFields.push('fupload_image = :uploadImage');
      replacements.uploadImage = uploadImage;
    }
    if (standartImage !== undefined) {
      updateFields.push('fstandart_image = :standartImage');
      replacements.standartImage = standartImage;
    }
    if (ilustrasiStandart !== undefined) {
      updateFields.push('filustrasi_standart = :ilustrasiStandart');
      replacements.ilustrasiStandart = ilustrasiStandart;
    }
    if (ilustrasiActual !== undefined) {
      updateFields.push('filustrasi_actual = :ilustrasiActual');
      replacements.ilustrasiActual = ilustrasiActual;
    }
    if (actualImage !== undefined) {
      updateFields.push('factual_image = :actualImage');
      replacements.actualImage = actualImage;
    }
    if (gapBetweenStandarAndActual !== undefined) {
      updateFields.push('fgap_between_standar_and_actual = :gapBetweenStandarAndActual');
      replacements.gapBetweenStandarAndActual = gapBetweenStandarAndActual;
    }
    if (pilihFocusThemaMember !== undefined) {
      updateFields.push('fpilih_focus_thema_member = :pilihFocusThemaMember');
      replacements.pilihFocusThemaMember = pilihFocusThemaMember;
    }
    if (pilihTaskforce !== undefined) {
      updateFields.push('fpilih_taskforce = :pilihTaskforce');
      replacements.pilihTaskforce = pilihTaskforce;
    }
    if (operator !== undefined) {
      updateFields.push('foperator = :operator');
      replacements.operator = operator;
    }
    if (avCategory !== undefined) {
      updateFields.push('fav_category = :avCategory');
      replacements.avCategory = avCategory;
    }
    if (shift !== undefined) {
      updateFields.push('fshift = :shift');
      replacements.shift = shift;
    }
    if (startDate !== undefined) {
      updateFields.push('fstart_time = :startDate');
      replacements.startDate = startDate;
    }
    if (finishDate !== undefined) {
      updateFields.push('fend_time = :finishDate');
      replacements.finishDate = finishDate;
    }
    if (durationMin !== undefined) {
      updateFields.push('fdur = :durationMin');
      replacements.durationMin = durationMin;
    }
    if (problemCategory !== undefined) {
      updateFields.push('fproblem_category = :problemCategory');
      replacements.problemCategory = problemCategory;
    }
    if (itemTemporaryAction !== undefined) {
      updateFields.push('ftemporary_action = :itemTemporaryAction');
      replacements.itemTemporaryAction = itemTemporaryAction;
    }
    if (rootcauses5Why !== undefined) {
      updateFields.push('frootcauses_5_why = :rootcauses5Why');
      replacements.rootcauses5Why = rootcauses5Why;
    }
    if (tambahAnalysisTerjadi !== undefined) {
      updateFields.push('ftambah_analysis_terjadi = :tambahAnalysisTerjadi');
      replacements.tambahAnalysisTerjadi = tambahAnalysisTerjadi;
    }
    if (whyImage !== undefined) {
      updateFields.push('fwhy_image = :whyImage');
      replacements.whyImage = whyImage;
    }
    if (pilihO6 !== undefined) {
      updateFields.push('fpilih_o6 = :pilihO6');
      replacements.pilihO6 = pilihO6;
    }
    if (stepRepair !== undefined) {
      updateFields.push('fstep_repair = :stepRepair');
      replacements.stepRepair = stepRepair;
    }
    if (partChange !== undefined) {
      updateFields.push('fpart_change = :partChange');
      replacements.partChange = partChange;
    }
    if (countermeasureKenapaTerjadi !== undefined) {
      updateFields.push('fcountermeasure_kenapa_terjadi = :countermeasureKenapaTerjadi');
      replacements.countermeasureKenapaTerjadi = countermeasureKenapaTerjadi;
    }
    if (yokoten !== undefined) {
      updateFields.push('fyokoten = :yokoten');
      replacements.yokoten = yokoten;
    }
    if (rootcause5WhyKenkaLama !== undefined) {
      updateFields.push('frootcause_5_why_kenka_lama = :rootcause5WhyKenkaLama');
      replacements.rootcause5WhyKenkaLama = rootcause5WhyKenkaLama;
    }
    if (tambahAnalisisLama !== undefined) {
      updateFields.push('ftambah_analisis_lama = :tambahAnalisisLama');
      replacements.tambahAnalisisLama = tambahAnalisisLama;
    }
    if (pilihQ6 !== undefined) {
      updateFields.push('fpilih_q6 = :pilihQ6');
      replacements.pilihQ6 = pilihQ6;
    }
    if (whyLamaImage !== undefined) {
      updateFields.push('fwhy_lama_image = :whyLamaImage');
      replacements.whyLamaImage = whyLamaImage;
    }
    if (countermeasureKenkaLama !== undefined) {
      updateFields.push('fcountermeasure_kenka_lama = :countermeasureKenkaLama');
      replacements.countermeasureKenkaLama = countermeasureKenkaLama;
    }
    if (attachmentMeeting !== undefined) {
      updateFields.push('fattachment_meeting = :attachmentMeeting');
      replacements.attachmentMeeting = attachmentMeeting;
    }
    if (comments5Why !== undefined) {
      updateFields.push('fcomments_5_why = :comments5Why');
      replacements.comments5Why = comments5Why;
    }
    if (commentsCountermeasure !== undefined) {
      updateFields.push('fcomments_countermeasure = :commentsCountermeasure');
      replacements.commentsCountermeasure = commentsCountermeasure;
    }
    if (lastReportFile !== undefined) {
      updateFields.push('flast_report_file = :lastReportFile');
      replacements.lastReportFile = lastReportFile;
    }
    if (uploadFile !== undefined) {
      updateFields.push('fupload_file = :uploadFile');
      replacements.uploadFile = uploadFile;
    }

    if (updateFields.length === 0) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'No fields to update' });
    }

    const updateQuery = `
      UPDATE tb_error_log_2
      SET ${updateFields.join(', ')}
      WHERE fid = :fid
    `;

    await sequelize.query(updateQuery, { replacements });

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
