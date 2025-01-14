const { exec } = require('child_process');

console.log('Starting Cypress runner...');

// Use the browser's prompt function to get user input
const daysInput = prompt('Enter the number of previous days to filter submissions:');

if (daysInput !== null) {  // Ensure user didn't cancel the prompt
    console.log(`You entered: ${daysInput}`);

    const days = parseInt(daysInput, 10);
    if (isNaN(days) || days <= 0) {
        alert('Invalid input. Please enter a positive number.');
        throw new Error('Invalid input.');
    }

    console.log(`Proceeding with the last ${days} days.`);
    const testSpec = 'cypress/e2e/hackerrankTest.cy.js';

    exec(`npx cypress open --env days=${days}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error launching Cypress: ${err.message}`);
            return;
        }
        console.log(`Cypress output: ${stdout}`);
        console.error(`Cypress errors: ${stderr}`);
    });
} else {
    console.log('User canceled the prompt.');
}
