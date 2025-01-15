import { hackerrankTestSuite } from './hackerrankTest.cy.js';
const formatTimeToHHMMSS = require('./utils/formatTime');

describe('Hackerrank Submissions Scraper with Days Filter and Pagination', () => {

    // Fetch the number of days from environment variables
    const days = Cypress.env('days');

    if (!days || isNaN(days) || days <= 0) {
        throw new Error('Invalid or missing "days" environment variable.');
    }

    const submissions = [];
    let shouldStopPagination = false; // Flag to indicate when to stop pagination

    const scrapePage = () => {
        cy.get('table tbody tr').each(($row) => {
            const cols = $row.find('td');
    
            // Parse the time column and filter submissions
            const timeText = cols.eq(2).text().trim(); // Assuming the Time column is the 3rd column
            const timeMatch = timeText.match(/^(\d+)\s+days?$/); // Regex to extract the number of days
            const daysAgo = timeMatch ? parseInt(timeMatch[1], 10) : null;

            if (daysAgo !== null && daysAgo <= days) {
                const submission = {
                    problem: cols.eq(0).text().trim(),
                    language: cols.eq(1).text().trim(),
                    time: formatTimeToHHMMSS(timeText), // Format the time column
                    result: cols.eq(3).text().trim(),
                    score: parseFloat(cols.eq(4).text().trim()), // Convert score to a number
                };
                submissions.push(submission);
            } else if (daysAgo !== null && daysAgo > days) {
                // If any row exceeds the input limit, set the flag to stop pagination
                shouldStopPagination = true;
            }
        }).then(() => {
            // Check for the "Next >" button and navigate if available
            if (shouldStopPagination) {
                cy.log('Reached submissions outside the input limit. Stopping pagination.');
                finalizeScraping();
                return;
            }

            cy.get('li.pagination-item').then(($items) => {
                const nextButton = $items.find('a.pagination-button[aria-label^="Next page"]');
                if (nextButton && !nextButton.closest('li').hasClass('disabled')) {
                    cy.wrap(nextButton).click({ force: true });
                    cy.wait(2000); // Wait for the next page to load
                    scrapePage(); // Recursively scrape the next page
                } else {
                    cy.log('No more pages to scrape.');
                    finalizeScraping();
                }
            });
        });
    };

    const finalizeScraping = () => {
        // Write the submissions to a JSON file
        cy.writeFile('hackerrank_Submissions_Filtered.json', submissions);

        // Convert the data to Excel
        cy.task('convertToExcel', {
            data: submissions,
            filePath: 'cypress/reports/hackerrank_Submissions.xlsx',
        }).then((message) => {
            cy.log(`Excel generation result: ${message}`);
        });
    };

    it('Logs in, scrapes all pages, and filters submissions for time <= specified days', () => {
        // Login to Hackerrank
        hackerrankTestSuite();

        // Ensure the dashboard or another valid page loads
        cy.url().then((url) => {
            if (!url.includes('dashboard')) {
                cy.url().should('include', 'hackerrank.com');
            }
        });

        // Navigate to Submissions page
        cy.visit('https://hackerrank.com/submissions/');
        cy.wait(5000); // Wait for submissions to load

        // Start scraping from the first page
        scrapePage();
    });
});
