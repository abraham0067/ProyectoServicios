describe('Prueba local', () => {

    it('Test', () => {
        //cy.visit('https://www.google.com')
        cy.visit('https://192.168.100.7:8010')
        cy.get('#mat-input-0').clear().type('admin')
        cy.get('.mat-raised-button').click()
        cy.get('h1').should('contain', 'About')
    });

});

