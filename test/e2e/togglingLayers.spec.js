describe('adding layers after initializing LDL', () => {
    beforeEach(() => {
        cy.visit('/demo/togglingLayers.html')
    })
    describe('basic setup', () => {
        it('contains a map element', () => {
            cy.get('#map');
        });
    })
    describe('toggling layers with button clicks', () => {
        it('adds the test tile layer on first click', ()=> {
            cy.get('#toggleTile').click();
            cy.get('.test-tile-layer');
        });
        it('removes the test tile layer on second click', ()=> {
            cy.get('#toggleTile').click();
            cy.get('#toggleTile').click();
            cy.get('.test-tile-layer').should('not.exist');
        });
        it('adds the test tile layer on third click', ()=> {
            cy.get('#toggleTile').click();
            cy.get('#toggleTile').click();
            cy.get('#toggleTile').click();

            cy.get('.test-tile-layer');
        });

        it('adds the testGeoJSON layer on first click', () => {
            cy.get('#toggleGeoJson').click();
            cy.get('.test-geojson-icon');
        })
        it('removes the testGeoJSON layer on second click', ()=> {
            cy.get('#toggleGeoJson').click();
            cy.get('#toggleGeoJson').click();

            cy.get('.test-geojson-icon').should('not.exist');
        });
        it('adds the testGeoJSON on third click', ()=> {
            cy.get('#toggleGeoJson').click();
            cy.get('#toggleGeoJson').click();
            cy.get('#toggleGeoJson').click();

            cy.get('.test-geojson-icon');
        });


        it('adds the image overlay layer on the first click', () => {
            cy.get('#toggleImageOverlay').click();
            cy.get('.test-image-overlay');
        });
        it('removes the image overlay layer on second click', ()=> {
            cy.get('#toggleImageOverlay').click();
            cy.get('#toggleImageOverlay').click();

            cy.get('.test-image-overlay').should('not.exist');
        });
        it('adds the image overlay layer on third click', ()=> {
            cy.get('#toggleImageOverlay').click();
            cy.get('#toggleImageOverlay').click();
            cy.get('#toggleImageOverlay').click();

            cy.get('.test-image-overlay');
        });
      
    });
});
