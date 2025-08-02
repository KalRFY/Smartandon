/* eslint-disable array-callback-return */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/order */
/* eslint-disable camelcase */
/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable eqeqeq */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable no-continue */
/* eslint-disable no-plusplus */

let XLSXPopulate;
try {
  XLSXPopulate = require('xlsx-populate');
} catch (error) {
  console.warn('xlsx-populate module not found, download service will be disabled.');
  XLSXPopulate = null;
}
const moment = require('moment/moment');
const { sequelize } = require('../models');
const fs = require("fs");
const ExcelJS = require("exceljs");


const filledColor = [];
const generateCellDuration = (sheet, duration, startColumn = 'AM', startRow = 17) => {
  const totalCell = duration / 10;

  const columnToIndex = (column) => {
    let sum = 0;
    for (let i = 0; i < column.length; i++) {
      sum *= 26;
      sum += column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }
    return sum;
  };

  const indexToColumn = (index) => {
    let column = '';
    while (index > 0) {
      const mod = (index - 1) % 26;
      column = String.fromCharCode(65 + mod) + column;
      index = Math.floor((index - 1) / 26);
    }
    return column;
  };

  const startColumnIndex = columnToIndex(startColumn);

  for (let i = 0; i < totalCell; i++) {
    if (i > 49) {
      break;
    }

    const currentColumnIndex = startColumnIndex + i;
    const currentColumn = indexToColumn(currentColumnIndex);

    if (filledColor.includes(`${currentColumn}${startRow}`)) {
      continue;
    }

    sheet
      .cell(`${currentColumn}${startRow}`)
      .style({
        fill: {
          type: 'pattern',
          pattern: 'darkDown',
          foreground: {
            rgb: '0000FF',
          },
          background: {
            theme: 3,
            tint: 0.4,
          },
        },
      });

    filledColor.push(`${currentColumn}${startRow}`);
  }
};

const flattenArray = (arr) => {
    const result = [];

    const recursiveFlatten = (obj) => {
        result.push({
            id: obj.id,
            isLeaf: obj.isLeaf,
            name: obj.name,
            pid: obj.pid,
        });
        if (obj.children && obj.children.length > 0) {
            obj.children.forEach((child) => recursiveFlatten(child));
        }
    }

    arr.forEach((item) => recursiveFlatten(item));
    return result;
}

const isNotEmpty = (input) => {
    console.log(input);
    if (input == "" || input == "null" || input == -1) {
        return false;
    } else {
        return true;
    }
}

const q6 = [{
        category: "Q1",
        description: "Diagnose / Cause Analysis",
    },
    {
        category: "Q2",
        description: "Spareparts",
    },
    {
        category: "Q3",
        description: "Tools",
    },
    {
        category: "Q4",
        description: "Maintenance Ability",
    },
    {
        category: "Q5",
        description: "Machine Setting",
    },
    {
        category: "Q6",
        description: "Machine Backup",
    },
];

const generatedStepRepairCellDuration = async (res, problemData, uraianData, fullPath) => {
  const workbook = await XLSXPopulate.fromFileAsync(fullPath);
  const sheet = workbook.sheet(0);
  const startTime = moment(problemData.fstart_time);
  const endTime = moment(problemData.fend_time);

  sheet.cell('F12').value(startTime.format('DD'));
  sheet.cell('H12').value(startTime.format('MM'));
  sheet.cell('J12').value(startTime.format('MM'));
  sheet.cell('L12').value(problemData.fshift == 'r' ? 'RED' : 'WHITE');
  sheet.cell('M12').value(startTime.format('HH:mm:ss'));
  sheet.cell('O12').value(endTime.format('HH:mm:ss'));
  sheet.cell('Q12').value(`${problemData.fdur}`);
  sheet.cell('S11').value(problemData.ferror_name);
  sheet.cell('BO10').value(problemData.fline);
  sheet.cell('BO11').value(problemData.fmc_name);
  sheet.cell('CH11').value(problemData.foperator);
  sheet.cell('CY11').value(problemData.fid);

  sheet.cell('C31').value(uraianData.length ? uraianData[0].desc_nm : '');
  sheet.cell('L17').value(uraianData.length >= 1 && !uraianData[1].desc_nm ? '<no-description>' : uraianData[1].desc_nm);
  sheet.cell('L27').value(uraianData.length >= 2 && !uraianData[2].desc_nm ? '<no-description>' : uraianData[2].desc_nm);

  const jsonStepRepair = JSON.parse(problemData.fstep_new);
  if (jsonStepRepair.length > 0) {
    let no = 1;
    let idxAct = 0;
    const idxOffsetStd = 10;
    let initialDurationIdx = 17;
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    for (let i = 17; i < 17 + 6; i++) {
      const element = jsonStepRepair[idxAct];
      sheet.cell(`W${i}`).value(no);
      sheet.cell(`X${i}`).value(element.stepDesc);
      sheet.cell(`AI${i}`).value(element.actualTime);
      sheet.cell(`CK${i}`).value(element.quick6);

      sheet.cell(`W${i + idxOffsetStd}`).value(no);
      sheet.cell(`X${i + idxOffsetStd}`).value(element.stepDesc);
      sheet.cell(`AI${i + idxOffsetStd}`).value(element.idealTime);
      sheet.cell(`CK${i + idxOffsetStd}`).value(element.quick6);

      generateCellDuration(sheet, element.actualTime, 'AM', i);
      generateCellDuration(sheet, element.idealTime, 'AM', i + idxOffsetStd);

      idxAct++;
      no++;
      initialDurationIdx++;
    }

    const groupedSteps = jsonStepRepair.reduce((acc, step) => {
      if (!acc[step.quick6]) {
        acc[step.quick6] = [];
      }
      acc[step.quick6].push(step);
      return acc;
    }, {});

    const groupsWithHighestGap = Object.keys(groupedSteps).map((key) => {
      const group = groupedSteps[key];
      const highestGap = Math.max(...group.map((step) => step.actualTime - step.idealTime));
      return { quick6: key, steps: group, highestGap };
    });

    const sortedStep = groupsWithHighestGap.sort((a, b) => b.highestGap - a.highestGap);

    if (sortedStep.length > 0) {
      const findHigh = q6.find((item) => item.category === sortedStep[0].quick6);

      if (findHigh) {
        sheet.cell('CN24').value(`${findHigh.category} = ${findHigh.description}`);
      }
    }
  }

    const dataAnalysisQuery = `SELECT * FROM o_analisys WHERE id_problem = :fid`;
    const dataAnalysis = await sequelize.query(dataAnalysisQuery, {
        replacements: { fid: problemData.fid },
        type: sequelize.QueryTypes.SELECT,
    });
  console.log(dataAnalysis);

  const whyTerjadi =
    dataAnalysis.length && dataAnalysis[0].json_string != '' ? await JSON.parse(dataAnalysis[0].json_string) : [];

  const whyLama =
    dataAnalysis.length > 1 ? (dataAnalysis[1].json_string != '' ? await JSON.parse(dataAnalysis[1].json_string) : []) : [];

  const containerWhyCols = ['E36', 'E39', 'E42', 'E45', 'E48'];
  const flattenTerjadi = flattenArray(whyTerjadi);
  flattenTerjadi.map((item, i) => {
    if (containerWhyCols[i]) {
      sheet.cell(containerWhyCols[i]).value(item.name);
    }
  });

  const containerLamaCols = ['W36', 'W38', 'E40', 'E42', 'E44'];
  const flattenLama = flattenArray(whyLama);
  flattenLama.map((item, i) => {
    if (containerLamaCols[i]) {
      sheet.cell(containerLamaCols[i]).value(item.name);
    }
  });

  const cm_lama = isNotEmpty(problemData.fpermanet_cm_lama) ? JSON.parse(problemData.fpermanet_cm_lama) : [];
  const cm_terjadi = isNotEmpty(problemData.fpermanet_cm) ? JSON.parse(problemData.fpermanet_cm) : [];

  const countermeasure = cm_terjadi && cm_lama ? cm_terjadi.concat(cm_lama).splice(0, 5) : null;
  console.log('countermeasure');
  console.log(countermeasure);

  {
    const containerCmColNo = ['W47', 'W48', 'W49', 'W50'];
    const containerCmColDesc = ['X47', 'X48', 'X49', 'X50'];
    const containerCmColCat = ['AL47', 'AL48', 'AL49', 'AL50'];
    const containerCmColPic = ['AY47', 'AY48', 'AY49', 'AY50'];
    const containerCmColDate = ['BO47', 'BO48', 'BO49', 'BO50'];
    const containerCmColJudg = ['BX47', 'BX48', 'BX49', 'BX50'];
    if (countermeasure.length > 0) {
      countermeasure.map((item, i) => {
        sheet.cell(containerCmColNo[i]).value(i + 1);
        sheet.cell(containerCmColDesc[i]).value(item.cmDesc);
        sheet.cell(containerCmColCat[i]).value(item.cmCategory);
        sheet.cell(containerCmColPic[i]).value(item.pic);
        sheet.cell(containerCmColDate[i]).value(item.datePlan);
        sheet.cell(containerCmColJudg[i]).value(item.judg ? 'OK' : 'Not Yet');
      });
    }
  }
  const containerYokoColMc = ['CD47', 'CD49'];
  const containerYokoColPic = ['CO47', 'CO49'];
  const containerYokoColDate = ['DD47', 'DD49'];
  const containerYokoColJudg = ['DJ47', 'CJ49'];
  const yokoten = isNotEmpty(problemData.fyokoten) ? JSON.parse(problemData.fyokoten) : [];

  console.log(yokoten);

  if (yokoten.length > 0) {
    yokoten.map((item, i) => {
      sheet.cell(containerYokoColMc[i]).value(item.machine);
      sheet.cell(containerYokoColPic[i]).value(item.pic);
      sheet.cell(containerYokoColDate[i]).value(item.datePlan);
      sheet.cell(containerYokoColJudg[i]).value(item.judg ? 'OK' : 'Not Yet');
    });
  }

  let dirFile = `./reports/ltb/${problemData.fid}_${problemData.ferror_name}`;
  if (dirFile.includes(':')) {
    dirFile = dirFile.replace(new RegExp(':', 'g'), '_');
  }

  if (!fs.existsSync(dirFile)) {
    fs.mkdirSync(dirFile);
  }

  let r = `${dirFile}/${problemData.ferror_name}.xlsx`;
  if (r.includes(':')) {
    r = r.replace(new RegExp(':', 'g'), '_');
  }

  await workbook.toFileAsync(r);
  return r;
};

const mappedImageFile = async (res, problemData, uraianData, generatedExcelPath) => {
    const workbook = new ExcelJS.Workbook();
    const wb = await workbook.xlsx.readFile(generatedExcelPath);
    const worksheet = wb.worksheets[0];

    if (
        uraianData.length >= 1 &&
        uraianData[0].ilustration &&
        uraianData[0].ilustration != "" &&
        uraianData[0].ilustration != "null" &&
        fs.existsSync(uraianData[0].ilustration)
    ) {
        const chartImageIdGeneral = workbook.addImage({
            filename: uraianData[0].ilustration,
            extension: "jpeg",
        });
        const column = "C";
        const row = 21;
        const colIndex = worksheet.getColumn(column).number;
        worksheet.addImage(chartImageIdGeneral, {
            tl: {col: colIndex, row: row},
            ext: {width: 280, height: 180},
        });
    }

    if (
        uraianData.length >= 2 &&
        uraianData[1].ilustration &&
        uraianData[1].ilustration != "" &&
        uraianData[1].ilustration != "null" &&
        fs.existsSync(uraianData[1].ilustration)
    ) {
        const chartImageIdStd = workbook.addImage({
            filename: uraianData[1].ilustration,
            extension: "jpeg",
        });
        const P17 = worksheet.getCell("P17");
        const col2 = "P";
        const row2 = 17;
        const colIndex2 = worksheet.getColumn(col2).number;
        worksheet.addImage(chartImageIdStd, {
            tl: {col: colIndex2, row: row2},
            ext: {width: 200, height: 150},
        });
    }
    if (
        uraianData.length >= 3 &&
        uraianData[2].ilustration &&
        uraianData[2].ilustration != "" &&
        uraianData[2].ilustration != "null" &&
        fs.existsSync(uraianData[2].ilustration)
    ) {
        const chartImageIdAct = workbook.addImage({
            filename: uraianData[2].ilustration ?? 'tidak ada gambar',
            extension: "jpeg",
        });

        const P27 = worksheet.getCell("P27");
        const col3 = "P";
        const row3 = 27;
        const colIndex3 = worksheet.getColumn(col3).number;

        worksheet.addImage(chartImageIdAct, {
            tl: {col: colIndex3, row: row3},
            ext: {width: 200, height: 150},
        });

        const why1_img = problemData.why1_img;

        if (isNotEmpty(why1_img) && fs.existsSync(why1_img)) {
            let col1 = "M";
            let row1 = 36;
            let colIndex1 = worksheet.getColumn(col1).number;
            let imageSave = workbook.addImage({
                filename: why1_img ?? 'tidak ada gambar',
                extension: "jpeg",
            });

            worksheet.addImage(imageSave, {
                tl: {col: colIndex1, row: row1},
                ext: {width: 250, height: 200},
            });
        }

        const why12_img = problemData.why12_img;
        const why22_img = problemData.why22_img;

        if (isNotEmpty(why1_img) && fs.existsSync(why1_img)) {
            let col1 = "M";
            let row1 = 36;
            let colIndex1 = worksheet.getColumn(col1).number;
            let imageSave = workbook.addImage({
                filename: why1_img ?? 'tidak ada gambar',
                extension: "jpeg",
            });
            worksheet.addImage(imageSave, {
                tl: {col: colIndex1, row: row1},
                ext: {width: 250, height: 200},
            });
        }

        if (isNotEmpty(why12_img) && fs.existsSync(why12_img)) {
            let col1 = "AM";
            let row1 = 36;
            let colIndex1 = worksheet.getColumn(col1).number;
            let imageSave = workbook.addImage({
                filename: why12_img,
                extension: "jpeg",
            });

            worksheet.addImage(imageSave, {
                tl: {col: colIndex1, row: row1},
                ext: {width: 250, height: 200},
            });
        }

        if (isNotEmpty(why22_img) && fs.existsSync(why22_img)) {
            let col1 = "BR";
            let row1 = 36;
            let colIndex1 = worksheet.getColumn(col1).number;
            let imageSave = workbook.addImage({
                filename: why22_img ?? 'tidak ada gambar',
                extension: "jpeg",
            });
            worksheet.addImage(imageSave, {
                tl: {col: colIndex1, row: row1},
                ext: {width: 250, height: 200},
            });
        }
    }

    await workbook.xlsx.writeFile(generatedExcelPath);
    res.download(generatedExcelPath);
}

module.exports = {
    generatedStepRepairCellDuration,
    mappedImageFile
};
