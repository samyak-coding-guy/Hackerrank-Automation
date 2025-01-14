const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx'); // Include XLSX for Excel operations

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://hackerrank.com', // Hackerrank base URL
    reporter: 'mochawesome', // Use Mochawesome for reports
    reporterOptions: {
      reportDir: 'cypress/reports', // Directory to save reports
      overwrite: false,
      html: true,
      json: true,
    },
    retries: {
      runMode: 2, // Retry failed tests in headless mode (Cypress run)
      openMode: 1, // Retry failed tests in interactive mode (Cypress open)
    },
    setupNodeEvents(on, config) {
      // Implement Node.js tasks for handling submissions and Excel conversion
      on('task', {
        collectSubmissions(submissions) {
          const filePath = path.resolve('cypress/fixtures/hackerrank_submissions.json');
          fs.writeFileSync(filePath, JSON.stringify(submissions, null, 2));
          console.log(`Submissions saved to ${filePath}`);
          return null;
        },
        convertToExcel({ data, filePath }) {
          try {
            const ws = XLSX.utils.json_to_sheet(data);
            const wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, 'Hackerrank Submissions');
            XLSX.writeFile(wb, filePath);
            console.log(`Excel file saved to ${filePath}`);
            return `Excel file saved to ${filePath}`;
          } catch (error) {
            console.error('Error creating Excel file:', error);
            throw error;
          }
        },
      });
    },
    testIsolation: false, // Disable test isolation for easier test flow
  },
});
