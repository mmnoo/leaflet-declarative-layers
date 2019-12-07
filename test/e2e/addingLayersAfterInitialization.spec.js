describe('adding layers after initializing LDL', () => {
    beforeEach(() => {
        cy.visit('/demo/addRemoveDataAfterInitialization.html')
    })
    describe('basic setup', () => {
        it('contains a map element', () => {
            cy.get('#map');
        });
    })
    describe('adding layers with button click', () => {
        it('contains the test tile layer', ()=> {
            cy.get('#addVisibleTile').click();
            cy.get('.test-visible-tile-layer');
        });
        it('contains the testGeoJSON layer', () => {
            cy.get('#addGeoJson').click();
            cy.get('.test-geojson-icon');
        })
        it('contains an image overlay layer', () => {
            cy.get('#addImageOverlay').click();
            cy.get('.test-image-overlay');
        });
        it('doesnt contain a invisible added layer', () => {
            cy.get('#addInvisibleTile').click();
            cy.get('.test-invisible-tile-layer').should('not.exist')
        })
        it('doesnt contain a layer that has been removed', () => {
            cy.get('#addVisibleTile').click();
            cy.get('.test-visible-tile-layer');
            cy.get('#removeVisibleTile').click();
            cy.get('.test-visible-tile-layer').should('not.exist');
        });
    });
    describe('geojson customized features', () => {
        describe('clicking a datapoint marker', () => {
            it('opens a popup', () => {
                cy.get('.leaflet-popup-content').should('not.exist');
                cy.get('#addGeoJson').click();
                cy.get('.test-geojson-icon').click({multiple: true});
                cy.get('.leaflet-popup-content');
            });
        })
        
    });
});