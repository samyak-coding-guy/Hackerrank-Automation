export const hackerrankTestSuite = () => {
        // Your test code here, e.g., logging into hackerrank
        cy.visit('https://hackerrank.com/');
        cy.get('.header-hamburger_container').click();
        cy.get('#menu-item-15112').click();
        cy.get('a[href="/login/"]').click(); 

        cy.get('body').then(($body) => {
            if ($body.find('input[name="username"]').length > 0) {
                cy.log('Not logged in. Logging in now...');
                cy.get('input[name="username"]').type('jsamyak995@gmail.com');
                cy.get('input[name="password"]').type('Samyak@123');
                cy.get('button[type="submit"]').click();
            } else {
                // User is already logged in
                cy.log('Already logged in.');
            }
     });
};
