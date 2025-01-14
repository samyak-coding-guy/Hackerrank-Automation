const readline = require('readline');
const { exec } = require('child_process');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.question('Enter the number of previous days to filter submissions: ', (daysInput) => {
    const days = parseInt(daysInput, 10);

    if (isNaN(days) || days <= 0) {
        console.error('Invalid input. Please enter a positive number.');
        rl.close();
        process.exit(1);
    }

    console.log(`Running Cypress with days: ${days}`);
    
    // Run Cypress with the days environment variable
    exec(`npx cypress open --env days=${days}`, (err, stdout, stderr) => {
        if (err) {
            console.error(`Error launching Cypress: ${err.message}`);
            rl.close();
            return;
        }
        console.log(stdout);
        rl.close();
    });
});
