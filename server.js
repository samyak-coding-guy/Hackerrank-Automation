const express = require('express');
const { exec } = require('child_process');
const app = express();
const port = 3000;

app.get('/run-cypress', (req, res) => {
    const days = req.query.days;

    if (!days || isNaN(days) || days <= 0) {
        return res.status(400).send({ error: 'Invalid days parameter.' });
    }

    console.log(`Running Cypress with days: ${days}`);

    // Run Cypress in headed mode (visual mode with UI visible)
    exec(`npx cypress open --env days=${days}`, (err, stdout, stderr) => {
        if (err) {
            return res.status(500).send({ error: err.message });
        }

        console.log(stdout);
        console.error(stderr);
        res.send({ message: 'Cypress test run complete.' });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
