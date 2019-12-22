describe('adding layers during LDL initialization', () => {
    beforeEach(() => {
        cy.visit('/demo/initialize.html')
    })
    describe('basic setup', () => {
        it('contains a map element', () => {
            cy.get('#map');
        });
    })
    describe('initializing layers', () => {
        it('contains the test tile layer', ()=> {
            cy.get('.test-tile-layer');
        });
        it('contains the testGeoJSON layer', () => {
            cy.get('.test-geojson-icon');
        })
        it('contains an image overlay layer', () => {
            cy.get('.test-image-overlay');
        });
    });
    describe('geojson customized features', () => {
        describe('clicking a datapoint marker', () => {
            it('opens a popup', () => {
                cy.get('.leaflet-popup-content').should('not.exist');
                cy.get('.test-geojson-icon').click({
                    multiple: true,
                    force: true, // without this, it passes on linux but fails on mac
                });
                cy.get('.leaflet-popup-content');
            });
        })
        
    });
});