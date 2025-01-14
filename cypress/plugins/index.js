const ExcelJS = require('exceljs');

const convertToExcel = async (data, filePath) => {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Submissions');

    // Add headers
    const headers = Object.keys(data[0]);
    sheet.addRow(headers);

    // Add data
    data.forEach((item) => {
        sheet.addRow(Object.values(item));
    });

    // Format the "time" column as time
    const timeColumnIndex = headers.indexOf('time') + 1; // +1 because columns are 1-indexed
    sheet.getColumn(timeColumnIndex).numFmt = '[hh]:mm:ss'; // Format for hh:mm:ss

    // Adjust the columns width for better readability
    sheet.getColumn(timeColumnIndex).width = 12; // You can adjust this width as needed
    sheet.getColumn(headers.indexOf('problem') + 1).width = 40; // Adjust 'problem' column
    sheet.getColumn(headers.indexOf('result') + 1).width = 20; // Adjust 'result' column

    // Save the file
    await workbook.xlsx.writeFile(filePath);
};

module.exports = convertToExcel;
