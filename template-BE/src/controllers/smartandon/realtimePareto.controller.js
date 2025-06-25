/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
const httpStatus = require('http-status');
const { get } = require('../../routes/smartandon/realtimePareto');

const defaultController = async (req, res, next) => {
  return res.status(httpStatus.OK).json({
    message: 'Welcome to the Realtime Pareto Controller',
    status: httpStatus.OK,
  });
};

const getAvCategoryController = async (req, res, next) => {
  try {
    const avCategory = [
        { value: "MESIN", label: "MESIN" },
        { value: "DIES", label: "DIES" },
        { value: "TOOL", label: "TOOL" },
        { value: "COOLANT", label: "COOLANT" },
        { value: "PRODUKSI", label: "PIC PRODUKSI" },
        { value: "PROBLEM TPM", label: "PROBLEM TPM" },
        { value: "PROBLEM PREDICTIVE", label: "PROBLEM PREDICTIVE" },
        // { value: "TOOL CHANGE", label: "TOOL CHANGE" },
        // { value: "FUTAI", label: "FUTAI" },
        // { value: "POWER/ANGIN", label: "POWER/ANGIN" },
        // { value: "NES", label: "NES" },
        // { value: "PALLETE", label: "PALLETE" },
        // { value: "OTHER", label: "OTHER" },
    ];
    return res.status(httpStatus.OK).json({
        message: 'AV Categories fetched successfully',
        status: httpStatus.OK,
        data: avCategory,
    });
  } catch (err) {
    next(err);
  }
};

// const productionLines = [
//   {
//     title: 'LPDC Line',
//     panelId: 'PANELLP',
//     minQuantity: 60,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'fix die r', quantity: 103 },
//             { name: 'Temperature', quantity: 80 },
//             { name: 'Pasir ter', quantity: 65 },
//             { name: 'shaft cyl', quantity: 60 },
//             { name: 'Work basa', quantity: 57 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Pasir ter', quantity: 3 },
//             { name: 'binder ti', quantity: 2 },
//             { name: 'Work basa', quantity: 2 },
//             { name: 'Lower tie', quantity: 1 },
//             { name: 'Feeding h', quantity: 1 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IKDM-003', quantity: 118 },
//             { name: 'IKCM-004', quantity: 104 },
//             { name: 'IKDM-004', quantity: 90 },
//             { name: 'IKMC-001', quantity: 77 },
//             { name: 'IKDM-002', quantity: 70 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IKDM-004', quantity: 4 },
//             { name: 'IKDM-003', quantity: 4 },
//             { name: 'IKMC-001', quantity: 3 },
//             { name: 'IKCM-005', quantity: 3 },
//             { name: 'IKCM-001', quantity: 3 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'HPDC Line',
//     panelId: 'PANELDC',
//     minQuantity: 30,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'Enterance', quantity: 58 },
//             { name: 'Hing Pin', quantity: 30 },
//             { name: 'Kabel Rob', quantity: 17 },
//             { name: 'Work OK T', quantity: 15 },
//             { name: 'Robot Sed', quantity: 15 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Enterance', quantity: 1 },
//             { name: 'Enterance', quantity: 1 },
//             { name: 'collision', quantity: 1 },
//             { name: 'Work OK T', quantity: 1 },
//             { name: 'Part Pass', quantity: 1 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IKFH-101', quantity: 89 },
//             { name: 'IKZV-003', quantity: 33 },
//             { name: 'IKZV-004', quantity: 25 },
//             { name: 'IKZV-0006', quantity: 15 },
//             { name: 'IKDM-102', quantity: 15 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IKFH-101', quantity: 4 },
//             { name: 'IKZV-003', quantity: 2 },
//             { name: 'IKZV-004', quantity: 2 },
//             { name: 'IKFH-102', quantity: 1 },
//             { name: 'IKZV-0006', quantity: 1 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'CAM SHAFT Line',
//     panelId: 'PANELCAM',
//     minQuantity: 50,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'Alarm 447', quantity: 94 },
//             { name: 'Part shor', quantity: 39 },
//             { name: 'Tykma tid', quantity: 22 },
//             { name: 'Area sens', quantity: 10 },
//             { name: 'Start fau', quantity: 10 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Part shor', quantity: 2 },
//             { name: 'Spindle n', quantity: 1 },
//             { name: 'Area sens', quantity: 1 },
//             { name: 'Spindle u', quantity: 1 },
//             { name: 'Grinding', quantity: 1 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IMGR-0009', quantity: 95 },
//             { name: 'IMGR-0016', quantity: 48 },
//             { name: 'IMGR-0011', quantity: 38 },
//             { name: 'RAW MATER', quantity: 21 },
//             { name: 'IMSP-0110', quantity: 20 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IMSP-0110', quantity: 2 },
//             { name: 'IMGR-0011', quantity: 2 },
//             { name: 'IMMM-0019', quantity: 2 },
//             { name: 'IMAT-0016', quantity: 2 },
//             { name: 'IMMM-0020', quantity: 1 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'CYLINDER HEAD Line',
//     panelId: 'PANELCH',
//     minQuantity: 60,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'Touch sen', quantity: 105 },
//             { name: 'Touch sen', quantity: 39 },
//             { name: 'Valve gui', quantity: 30 },
//             { name: 'Overload', quantity: 30 },
//             { name: 'Jig fault', quantity: 22 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Touch sen', quantity: 5 },
//             { name: 'A2ax: V R', quantity: 3 },
//             { name: 'Touch sen', quantity: 3 },
//             { name: 'Dual chec', quantity: 2 },
//             { name: 'Jig fault', quantity: 2 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IMSP-0014', quantity: 105 },
//             { name: 'Loader fi', quantity: 96 },
//             { name: 'IMAT-0001', quantity: 60 },
//             { name: 'IMSP-0035', quantity: 30 },
//             { name: 'IMSP-0026', quantity: 26 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IMSP-0014', quantity: 5 },
//             { name: 'IMSP-0026', quantity: 4 },
//             { name: 'IMSP-0035', quantity: 2 },
//             { name: 'IMAT-0001', quantity: 2 },
//             { name: 'IMSP-0052', quantity: 2 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'CYLINDER BLOCK Line',
//     panelId: 'PANELCB',
//     minQuantity: 40,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'Touch sen', quantity: 73 },
//             { name: 'Lifter ri', quantity: 65 },
//             { name: 'CC det UL', quantity: 30 },
//             { name: 'Low air p', quantity: 25 },
//             { name: '3st Fr Io', quantity: 15 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Lifter ri', quantity: 3 },
//             { name: 'Low air p', quantity: 2 },
//             { name: 'CC det UL', quantity: 2 },
//             { name: 'Touch sen', quantity: 2 },
//             { name: 'ZM execes', quantity: 2 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IMSP-0056', quantity: 75 },
//             { name: 'IMSP-0080', quantity: 50 },
//             { name: 'IMWB-0011', quantity: 32 },
//             { name: 'IMTS-0007', quantity: 20 },
//             { name: 'IMZK-0003', quantity: 15 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IMWB-0011', quantity: 3 },
//             { name: 'IMSP-0079', quantity: 2 },
//             { name: 'IMSP-0056', quantity: 2 },
//             { name: 'IMTS-0007', quantity: 2 },
//             { name: 'IMMM-0027', quantity: 2 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'CRANK SHAFT Line',
//     panelId: 'PANELCR',
//     minQuantity: 15,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'Servo X f', quantity: 30 },
//             { name: 'Error 24', quantity: 30 },
//             { name: 'Clamp cla', quantity: 20 },
//             { name: 'Spindle u', quantity: 20 },
//             { name: 'Diameter', quantity: 20 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Tool chan', quantity: 2 },
//             { name: 'Clamp cla', quantity: 1 },
//             { name: 'Longitudi', quantity: 1 },
//             { name: 'Servo X f', quantity: 1 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IMLP-0002', quantity: 75 },
//             { name: 'IMGR-0006', quantity: 50 },
//             { name: 'AUTO LOAD', quantity: 50 },
//             { name: 'IMWB-0018', quantity: 30 },
//             { name: 'IMSP-0096', quantity: 20 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IMGR-0006', quantity: 4 },
//             { name: 'AUTO LOAD', quantity: 3 },
//             { name: 'IMCK-0001', quantity: 3 },
//             { name: 'RAW MATER', quantity: 2 },
//             { name: 'IMCK-0002', quantity: 2 },
//           ],
//         },
//       },
//     },
//   },
//   {
//     title: 'ASSY LINE',
//     panelId: 'PANELASSY',
//     minQuantity: 5,
//     category: {
//       problems: {
//         duration: {
//           items: [
//             { name: 'PLC link', quantity: 10 },
//             { name: 'Loader En', quantity: 9 },
//             { name: 'Cycle tim', quantity: 8 },
//             { name: 'Plc bater', quantity: 5 },
//             { name: 'Water lea', quantity: 5 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'Cycle tim', quantity: 2 },
//             { name: 'PLC link', quantity: 2 },
//             { name: 'Loader En', quantity: 2 },
//             { name: 'Plc bater', quantity: 1 },
//             { name: 'Water kea', quantity: 1 },
//           ],
//         },
//       },
//       machines: {
//         duration: {
//           items: [
//             { name: 'IMCK 5-1-', quantity: 15 },
//             { name: 'Loader', quantity: 13 },
//             { name: 'Not Runne', quantity: 10 },
//             { name: 'IMTS-0038', quantity: 10 },
//             { name: 'IMTS-0028', quantity: 10 },
//           ],
//         },
//         frequency: {
//           items: [
//             { name: 'IMCK 5-1-', quantity: 3 },
//             { name: 'Loader', quantity: 3 },
//             { name: 'IMCK 5-2-', quantity: 2 },
//             { name: 'IMAT-0011', quantity: 2 },
//             { name: 'IMTS-0028', quantity: 2 },
//           ],
//         },
//       },
//     },
//   },
// ]

const getRealtimeParetoController = async (req, res, next) => {
  const { 
    avCategory,
    group,
    order,
    fline,
    startDate,
    endDate
  } = req.query;
  const q = `SELECT ${group}, ${order} AS fdur FROM v_current_error_2 WHERE ${avCategory}fstart_time between '${startDate}' AND '${endDate}' ${fline} GROUP BY ${group} ORDER BY fdur desc LIMIT 5`;
  console.log('Generated Query:', q);

  
  return res.status(httpStatus.OK).json({
    message: 'Realtime Pareto data fetched successfully',
    status: httpStatus.OK,
    data: "test",
  });
}

module.exports = {
    defaultController,
    getAvCategoryController,
    getRealtimeParetoController
};
