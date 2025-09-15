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
    const search = JSON.parse(req.query.search || '{}');
    console.log('[BE Debug] Received search params:', search);
    const page = parseInt(search.page) || 1;
    const limit = parseInt(search.limit) || 100;
    const offset = (page - 1) * limit;

    const { startDate } = search;
    const { finishDate } = search;
    const { machineName } = search;
    const { line } = search;
    const { problem } = search;
    const { problemCategory } = search;
    const { limitView } = search;

    console.log('Limit View:', limitView);
    console.log('Limit:', limit);

    let limitClause = `LIMIT ${limit} OFFSET ${offset}`;
    if (limitView == 0) {
      limitClause = ``;
      console.log('Iyaaaaa');
    }
    console.log('Limit Clauseee:', limitClause);

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

    if (limitView == 0) {
      whereClause += ` AND fend_time IS NULL`;
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
      ${limitClause}
    `;
    




    console.log('Problem View Query:', dataQuery);
    console.log('Problem View');

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
        file_report,
        fpermanet_cm as countermeasureKenapaTerjadi,
        fpermanet_cm_lama as countermeasureKenapaLama
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

    const query2 = `
      SELECT
        tb.type_uraian as typeUraian,
        tb.ilustration as ilustration
      FROM tb_r_uraian tb
      WHERE tb.error_id = :fid
    `

    const query3 = `
      SELECT
        tb.type_uraian as typeUraian,
        tb.desc_nm as desc_nm
      FROM tb_r_uraian tb
      WHERE tb.error_id = :fid
    `

    const queryAnalysis = `
      SELECT
        o.analisys_category as analisys_category,
        o.json_string as json_string
      FROM o_analisys o
      WHERE o.id_problem = :fid
    `

    const querySpareparts = `
      SELECT
        problemId,
        sparepart_category,
        material_number,
        uom,
        mrp,
        rop,
        rov,
        lead_time,
        sparepart_nm,
        sparepart_id,
        uuid,
        price,
        vendor,
        replacement_material_number,
        quantity
      FROM tb_sparepart
      WHERE problemId = :fid
    `

    const [uraianResult] = await sequelize.query(query2, {
      replacements: { fid },
    });

    const [descResult] = await sequelize.query(query3, {
      replacements: { fid },
    });

    const [analysis] = await sequelize.query(queryAnalysis, {
      replacements: { fid },
    });

    const [sparepartsResult] = await sequelize.query(querySpareparts, {
      replacements: { fid },
    });

    const finalResult = {
      ...result[0],
      uraianResult: uraianResult.reduce((acc, item) => {
        acc[item.typeUraian] = item.ilustration;
        return acc;
      }, {}),
      descResult: descResult.reduce((desc, item) => {
        desc[item.typeUraian] = item.desc_nm;
        return desc;
      }, {}),
      analysis: analysis.reduce((analisis, item) => {
        analisis[item.analisys_category] = item.json_string;
        return analisis;
      }, {}),
      sparepartsResult: sparepartsResult.reduce((sparepart, item) => {
        sparepart[item.sparepart_category] = item.sparepart_nm;
        sparepart[item.sparepart_category] = item.sparepart_id;
        sparepart[item.sparepart_category] = item.quantity;
        return sparepart;
      }, {}),
    }
    console.log('Final Result:', finalResult);

    res.status(httpStatus.OK).json(finalResult);
  } catch (error) {
    next(error);
  }
};

const updateProblem = async (req, res, next) => {
  try {
    const {
      machineName,
      line,
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
    console.log('Problems from body:', problemDescription);

    if (!fid) {
      return res.status(httpStatus.BAD_REQUEST).json({ message: 'Problem ID (fid) is required' });
    }

    // const updateFields = [];
    const replacements = {
      machineName,
      line,
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

    const cmKenapaLama = countermeasureKenapaLama || [];
    console.log('Is array cmKenapaLama:', Array.isArray(cmKenapaLama));
    const cmKenapaTerjadi = countermeasureKenapaTerjadi || [];
    console.log('Is array cmKenapaTerjadi:', Array.isArray(cmKenapaTerjadi));
    console.log('Countermeasure Kenapa Lama:', cmKenapaLama);
    console.log('Countermeasure Kenapa Terjadi:', cmKenapaTerjadi);

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

    replacements.countermeasureKenapaTerjadi =
      typeof countermeasureKenapaTerjadi === 'object'
        ? JSON.stringify(countermeasureKenapaTerjadi)
        : countermeasureKenapaTerjadi;

    replacements.countermeasureKenapaLama =
      typeof countermeasureKenapaLama === 'object' ? JSON.stringify(countermeasureKenapaLama) : countermeasureKenapaLama;

    console.log('Replacements:', replacements);

    const updateFields = [
      't1.ferror_name = :problemDescription',
      't1.foperator = :operator',
      't1.fiveWhyShFeedback = :comments5WhySH',
      't1.fiveWhyLhFeedback = :comments5WhyLH',
      't1.temporaryAction = :itemTemporaryAction',
      't1.fpart_change = :partChange',
      't1.oCategory = :oCategory',
      't1.qCategory = :qCategory',
      't1.fyokoten = :yokoten',
      't1.problemCategory = :problemCategory',
      't1.why1_img = :whyImage',
      't1.why2_img = :whyLamaImage',
      't1.fpermanet_cm = :countermeasureKenapaTerjadi',
      't1.fpermanet_cm_lama = :countermeasureKenapaLama',
      't1.fstep_repair = :stepRepair',
      't1.fstart_time = :startDate',
      't1.fend_time = :finishDate',
    ];

    let updateField = 't1.fmc_id = t2.fid';

    if (machineName && machineName !== '' && Number.isInteger(Number(machineName))) {
      updateField += `, t1.fmc_id = :machineName`;
    }
    if (problemDescription) {
      updateField += `, t1.ferror_name = :problemDescription`;
    }
    if (operator) {
      updateField += `, t1.foperator = :operator`;
    }
    if (gapBetweenStandarAndActual) {  
      updateField += `, t1.gapIlustrasi = :gapBetweenStandarAndActual`;
    }
    if (avCategory) {
      updateField += `, t1.fav_categoty = :avCategory`;
    }
    if (shift) {
      updateField += `, t1.fshift = :shift`;
    }
    if (startDate) {
      // Convert to WIB timezone if needed
      const startDateWIB = new Date(startDate);
      startDateWIB.setHours(startDateWIB.getHours() + 7); // Adjust to WIB
      updateField += `, t1.fstart_time = :startDate`;
      replacements.startDate = startDateWIB.toISOString().slice(0, 19).replace('T', ' ');
    }
    if (finishDate) {
      // Convert to WIB timezone if needed
      const finishDateWIB = new Date(finishDate);
      finishDateWIB.setHours(finishDateWIB.getHours() + 7); // Adjust to WIB
      updateField += `, t1.fend_time = :finishDate`;
      replacements.finishDate = finishDateWIB.toISOString().slice(0, 19).replace('T', ' ');
    }
    if (problemCategory) {
      updateField += `, t1.problemCategory = :problemCategory`;
    }
    if (itemTemporaryAction) {
      updateField += `, t1.temporaryAction = :itemTemporaryAction`;
    }
    if (whyImage) {
      updateField += `, t1.why1_img = :whyImage`;
    }
    if (oCategory) {
      updateField += `, t1.oCategory = :oCategory`;
    }
    if (stepRepair) {
      updateField += `, t1.fstep_repair = :stepRepair`;
    }
    if (partChange) {
      updateField += `, t1.fpart_change = :partChange`;
    }
    // if (countermeasureKenapaTerjadi) {
    //   updateField += `, t1.fpermanet_cm = :countermeasureKenapaTerjadi`;
    // }
    if (yokoten) {
      updateField += `, t1.fyokoten = :yokoten`;
    }
    if (qCategory) {
      updateField += `, t1.qCategory = :qCategory`;
    }
    if (whyLamaImage) {
      updateField += `, t1.why2_img = :whyLamaImage`;
    }
    if (countermeasureKenapaLama) {
      updateField += `, t1.fpermanet_cm_lama = :countermeasureKenapaLama`;
    }
    // if (attachmentMeeting) {
    //   updateField += `, t1.fpermanet_cm_lama = :attachmentMeeting`;
    // }
    if (req.files) {
      console.log('Files uploaded:', req.files);
      if (req.files.actualImage) {
        const fileObj = req.files.actualImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        console.log('New path for actualImage:', newPath);
        fs.renameSync(fileObj.path, newPath);
        replacements.actualImage = newPath;
      }
      if (req.files.uploadImage) {
        const fileObj = req.files.uploadImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        
        fs.renameSync(fileObj.path, newPath);
        replacements.uploadImage = newPath;
      }
      if (req.files.standartImage) {
        const fileObj = req.files.standartImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        console.log('New path for standartImage:', newPath);
        fs.renameSync(fileObj.path, newPath);
        replacements.standartImage = newPath;
      }
      if (req.files.whyImage) {
        const fileObj = req.files.whyImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          updateField += `, t1.why1_img = '${newPath}'`;
        }
      }
      if (req.files.whyLamaImage) {
        const fileObj = req.files.whyLamaImage[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          updateField += `, t1.why2_img = '${newPath}'`;
        }
      }
      if (req.files.uploadFile) {
        const fileObj = req.files.uploadFile[0];
        const ext = path.extname(fileObj.originalname);
        const reportsUploadDir = path.join(__dirname, `../../../reports/uploads/${fid}_${problemDescription}`);
        if (!fs.existsSync(reportsUploadDir)) {
          fs.mkdirSync(reportsUploadDir, { recursive: true });
        }
        const newPath = `./reports/uploads/${fid}_${problemDescription}/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        if (newPath) {
          replacements.uploadFile = newPath;
          updateField += `, t1.file_report = :uploadFile`;
        }
        console.log('New path for uploadFile:', newPath);
        console.log('File upload completed:', fileObj.uploadFile);
      }
      if (req.files.attachmentMeeting) {
        const fileObj = req.files.attachmentMeeting[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        replacements.attachmentMeeting = newPath;
        updateField += `, t1.fattachment_meeting = :attachmentMeeting`;
      }
      if (req.files.file_report) {
        const fileObj = req.files.file_report[0];
        const ext = path.extname(fileObj.originalname);
        const newPath = `./upload/${path.basename(fileObj.path)}${ext}`;
        fs.renameSync(fileObj.path, newPath);
        replacements.file_report = newPath;
        updateField += `, t1.ffile_report = :file_report`;
      }
    }
    
    // countermeasureKenapaTerjadi =
    // typeof countermeasureKenapaTerjadi === 'object'
    // ? JSON.stringify(countermeasureKenapaTerjadi)
    // : countermeasureKenapaTerjadi;
    
    // countermeasureKenapaLama =
    // typeof countermeasureKenapaLama === 'object' ? JSON.stringify(countermeasureKenapaLama) : countermeasureKenapaLama;

    if (countermeasureKenapaTerjadi) {
      updateField += `, t1.fpermanet_cm = :countermeasureKenapaTerjadi`;
    }
    if (countermeasureKenapaLama) {
      updateField += `, t1.fpermanet_cm_lama = :countermeasureKenapaLama`;
    }
    
    console.log('Replacements:', replacements);
    const updateQuery = `
      UPDATE tb_error_log_2 t1
      JOIN tb_mc t2 ON t1.fmc_id = t2.fid
      LEFT JOIN m_problem_member mpm ON t1.fid = mpm.id_m_problem
      LEFT JOIN tb_mt_member tmm ON tmm.fid = mpm.id_m_member
      SET ${updateField}
      WHERE t1.fid = :fid;
    `;
    await sequelize.query(updateQuery, { replacements });

    console.log('Update Query:', updateQuery);

    const uraianKeys = ['general', 'standard', 'actual'];
    const analysisKeys = ['TERJADI', 'LAMA'];
    // const sparepartsKeys = ['1', '2', '3'];

    const uraianData = {
      general: {
        type_uraian: 'general',
        ilustration: replacements.uploadImage || null,
        desc_nm: replacements.uraianKejadian || null
      },
      standard: {
        type_uraian: 'standard',
        ilustration: replacements.standartImage || null,
        desc_nm: replacements.ilustrasiStandart || null
      },
      actual: {
        type_uraian: 'actual',
        ilustration: replacements.actualImage || null,
        desc_nm: replacements.ilustrasiActual || null
      }
    };

    const analysisData = {
      TERJADI: {
        analisys_category: 'TERJADI',
        json_string: replacements.tambahAnalysisTerjadi ? (typeof replacements.tambahAnalysisTerjadi === 'string' ? replacements.tambahAnalysisTerjadi : JSON.stringify(replacements.tambahAnalysisTerjadi)) : '[]'
      },
      LAMA: {
        analisys_category: 'LAMA',
        json_string: replacements.tambahAnalisisLama ? (typeof replacements.tambahAnalisisLama === 'string' ? replacements.tambahAnalisisLama : JSON.stringify(replacements.tambahAnalisisLama)) : '[]'
      },
    };

    // const sparepartsData = {
    //   1: {
    //     sparepart_category: 1,
    //     json_string: replacements.sparepartMengganti
    //   },
    //   2: {
    //     sparepart_category: 2,
    //     json_string: replacements.sparepartMenambahkan
    //   },
    //   3: {
    //     sparepart_category: 3,
    //     json_string: replacements.sparepartModifikasi
    //   },
    // };

    // Process each uraian type
    for (const key of uraianKeys) {
      const item = uraianData[key];
      
      // Always process even if data is null to ensure consistency
      const checkQuery = `
        SELECT COUNT(*) as count FROM tb_r_uraian 
        WHERE error_id = :fid AND type_uraian = :type_uraian
      `;
      
      const [checkResult] = await sequelize.query(checkQuery, { 
        replacements: { 
          fid: replacements.fid, 
          type_uraian: item.type_uraian 
        } 
      });

      if (checkResult[0].count === 0) {
        // Insert new record
        const insertQuery = `
          INSERT INTO tb_r_uraian (error_id, type_uraian, ilustration, desc_nm)
          VALUES (:fid, :type_uraian, :ilustration, :desc_nm)
        `;
        await sequelize.query(insertQuery, { 
          replacements: {
            fid: replacements.fid,
            type_uraian: item.type_uraian,
            ilustration: item.ilustration,
            desc_nm: item.desc_nm
          }
        });
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE tb_r_uraian 
          SET ilustration = :ilustration, desc_nm = :desc_nm
          WHERE error_id = :fid AND type_uraian = :type_uraian
        `;
        await sequelize.query(updateQuery, { 
          replacements: {
            fid: replacements.fid,
            type_uraian: item.type_uraian,
            ilustration: item.ilustration,
            desc_nm: item.desc_nm
          }
        });
      }
    };

    for (const key of analysisKeys) {
      const item = analysisData[key];
      
      // Always process even if data is null to ensure consistency
      const checkQuery = `
        SELECT COUNT(*) as count FROM o_analisys 
        WHERE id_problem = :fid AND analisys_category = :analisys_category
      `;
      
      const [checkResult] = await sequelize.query(checkQuery, { 
        replacements: { 
          fid: replacements.fid, 
          analisys_category: item.analisys_category 
        } 
      });

      if (checkResult[0].count === 0) {
        // Insert new record
        const insertQuery = `
          INSERT INTO o_analisys (id_problem, analisys_category, json_string)
          VALUES (:fid, :analisys_category, :json_string)
        `;
        await sequelize.query(insertQuery, { 
          replacements: {
            fid: replacements.fid,
            analisys_category: item.analisys_category,
            json_string: item.json_string || '[]',
          }
        });
      } else {
        // Update existing record
        const updateQuery = `
          UPDATE o_analisys 
          SET json_string = :json_string
          WHERE id_problem = :fid AND analisys_category = :analisys_category
        `;
        await sequelize.query(updateQuery, { 
          replacements: {
            fid: replacements.fid,
            analisys_category: item.analisys_category,
            json_string: item.json_string || '[]',
          }
        });
      }
    };

    // for (const key of sparepartsKeys) {
    //   const item = sparepartsData[key];
      
    //   // Always process even if data is null to ensure consistency
    //   const checkQuery = `
    //     SELECT COUNT(*) as count FROM tb_sparepart 
    //     WHERE problemId = :fid AND sparepart_category = :sparepart_category
    //   `;
      
    //   const [checkResult] = await sequelize.query(checkQuery, { 
    //     replacements: { 
    //       fid: replacements.fid, 
    //       sparepart_category: item.sparepart_category 
    //     } 
    //   });

    //   if (checkResult[0].count === 0) {
    //     // Insert new record
    //     const insertQuery = `
    //       INSERT INTO tb_sparepart (problemId, sparepart_category, sparepart_id, sparepart_nm, quantity)
    //       VALUES (:fid, :sparepart_category, :sparepart_id, :sparepart_nm, :quantity)
    //     `;
    //     await sequelize.query(insertQuery, { 
    //       replacements: {
    //         fid: replacements.fid,
    //         sparepart_category: item.sparepart_category,
    //         sparepart_id: item.sparepart_id,
    //         sparepart_nm: item.sparepart_nm,
    //         quantity: item.quantity,
    //       }
    //     });
    //   } else {
    //     // Update existing record
    //     const updateQuery = `
    //       UPDATE o_analisys 
    //       SET sparepart_id = :sparepart_id, sparepart_nm = :sparepart_nm, quantity = :quantity
    //       WHERE problemId = :fid AND sparepart_category = :sparepart_category
    //     `;
    //     await sequelize.query(updateQuery, { 
    //       replacements: {
    //         fid: replacements.fid,
    //         sparepart_category: item.sparepart_category,
    //         sparepart_id: item.sparepart_id,
    //         sparepart_nm: item.sparepart_nm,
    //         quantity: item.quantity,
    //       }
    //     });
    //   }
    // };

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
