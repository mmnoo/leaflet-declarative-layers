import { Mock } from 'ts-mocks';
import * as leaflet from 'leaflet';
import * as dataTypes from '../../src/dataTypes';
import { DeclarativeLayers, ILayerReference } from '../../src/DeclarativeLayers';
import {_} from 'lodash';
import {
    FeatureCollection as geoJsonFeatureCollection,
    Feature as geoJsonFeature,
} from '../../node_modules/@types/geojson/index';
let testingOnEach: number;
const fakeFeatureClick = (e: leaflet.LeafletEvent) => {
    map.flyTo(new leaflet.LatLng(-104.98999178409576, 39.74683938093904));
};
const geojsonFeatureCollection: geoJsonFeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                popupContent: '18th & California Light Rail Stop',
            },
            geometry: {
                type: 'Point',
                coordinates: [-104.98999178409576, 39.74683938093904],
            },
        }, {
            type: 'Feature',
            properties: {
                popupContent: '20th & Welton Light Rail Stop',
            },
            geometry: {
                type: 'Point',
                coordinates: [-104.98689115047453, 39.747924136466565],
            },
        },
    ],
};
const layers: dataTypes.ILayersMetadata = [{
    id: 'testTileLayer1',
    label: 'testTileLayer1',
    url: 'www.testTileLayer1url.com',
    visibleInitially: true,
    options: {
        zIndex: 3,
    },
},
{
    id: 'testTileLayer2',
    label: 'testTileLayer2',
    url: 'www.testTileLayer1Url.com',
    visibleInitially: false,
    options: {
        maxZoom: 2,
    },
},
{
    id: 'testGeoJsonLayer1',
    label: 'testGeoJsonLayer1',
    visibleInitially: true,
    data: geojsonFeatureCollection,
    options: {onEachFeature: (feature, layer) => {
        testingOnEach += 1;
    }},
    generateFeaturePopupContent: (feature) => {
        return feature.properties.popupContent;
    },
},
{
    id: 'testImageOverlay1',
    label: 'testImageOverlay1',
    visibleInitially: true,
    url: 'url',
    bounds: [[40.712216, -74.22655], [40.773941, -74.12544]],
    options: {attribution: 'I\'m a test image overlay!'}
}];
let map: leaflet.Map;
let MockMap: Mock<leaflet.Map>;
let declarativeLayers: DeclarativeLayers;
let testTileLayer1: leaflet.TileLayer;
let testTileLayer2: leaflet.TileLayer;
let geoJsonLayer: leaflet.GeoJSON;

const initializateDeclarativeLayers = () => {
    MockMap = new Mock<leaflet.Map>({
        addLayer: Mock.ANY_FUNC,
        removeLayer: Mock.ANY_FUNC,
        flyTo: Mock.ANY_FUNC,
    });
    map = MockMap.Object;
    declarativeLayers = new DeclarativeLayers(leaflet, map, layers);
    testTileLayer1 = declarativeLayers.getLayerReferences().testTileLayer1 as leaflet.TileLayer;
    testTileLayer2 = declarativeLayers.getLayerReferences().testTileLayer2 as leaflet.TileLayer;
    geoJsonLayer = declarativeLayers.getLayerReferences().testGeoJsonLayer1 as leaflet.GeoJSON;
};
describe('declarative layers', () => {
    beforeEach((done) => {
        testingOnEach = 0;
        spyOn(leaflet.Layer.prototype, 'bindPopup');
        initializateDeclarativeLayers();
        done();
    });
    describe('initialization', () => {
        it('adds only visible layers to the map', () => {
            const visibleItems = layers.filter((layerItem) => layerItem.visibleInitially);
            expect(map.addLayer).toHaveBeenCalledTimes(visibleItems.length);
        });
    });
    describe('access to layers refrences', () => {
        it('exposes references to added layers (visible or not)', () => {
           expect( Object.keys(declarativeLayers.getLayerReferences()).length).toEqual(layers.length);
           expect(declarativeLayers.getLayerReferences().testTileLayer1).toBeDefined();
           expect(declarativeLayers.getLayerReferences().testTileLayer2).toBeDefined();
           expect(declarativeLayers.getLayerReferences().testGeoJsonLayer1).toBeDefined();
           expect(declarativeLayers.getLayerReferences().testImageOverlay1).toBeDefined();
        });
    });
    describe('adding layers initially', () => {
        it('shouldnt be called with undefined values', () => {
            expect(map.addLayer).not.toHaveBeenCalledWith(undefined);
        });
        describe('tile layers', () => {
            it('loads tile layers', () => {
               expect(map.addLayer).toHaveBeenCalledWith(testTileLayer1);
            });
            it('passes the tile layer options', () => {
                expect(testTileLayer1.options.zIndex).toEqual((layers[0] as dataTypes.ITilesMetadata).options.zIndex);
                expect(testTileLayer2.options.maxZoom).toBe((layers[1] as dataTypes.ITilesMetadata).options.maxZoom);
            });
        });
        describe('GeoJson layers', () => {
            it('should load GeoJson Layers', () => {
                expect(map.addLayer).toHaveBeenCalledWith(declarativeLayers.getLayerReferences().testGeoJsonLayer1);
            });
            // TODO add test for options
            describe('popups', () => {
                const geoJsonMetadataWithPopup = layers[2] as dataTypes.IGeoJsonMetadata;
                it('should bind popups to a layer', () => {
                    expect(geoJsonLayer.bindPopup)
                    .toHaveBeenCalledWith(geojsonFeatureCollection.features[0].properties.popupContent);
                });
                it('shouldnt interfere with other options using onEachFeature', () => {
                   expect(testingOnEach).toEqual(2);
                });
            });
        });
        describe('ImageOverlay Layers', () => {
            it ('should load image overlays', () => {
                expect(map.addLayer).toHaveBeenCalledWith(declarativeLayers.getLayerReferences().testImageOverlay1);
            });
            it ('should pass image overlay options to Leaflet', () => {
                expect(declarativeLayers.getLayerReferences().testImageOverlay1.options.attribution)
                .toEqual(layers[3].options.attribution);
            });
        });
    });
    describe('adding  and removing layers after initialization', () => {
        let newGeoJsonMetadataVisible: dataTypes.ILayerMetadata;
        let newGeoJsonMetadataInvisible: dataTypes.ILayerMetadata;
        let newTileLayerVisible: dataTypes.ILayerMetadata;
        let newTileLayerInvisible: dataTypes.ILayerMetadata;
        let newImageOverlay: dataTypes.ILayerMetadata;
        const newGeojsonFeatureVisible: geoJsonFeature = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-104.99404, 39.75621],
            },
        };
        const newGeojsonFeatureInvisible: geoJsonFeature = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-104.99404, 39.1],
            },
        };
        let layerReferences: ILayerReference;
        let testAddLayerReference: dataTypes.ILeafletLayer;
        beforeEach(() => {
            newGeoJsonMetadataVisible = {
                id: 'testNewGeoJsonLayerVisible',
                label: 'testNewGeoJsonLayerVisible',
                visibleInitially: true,
                data: newGeojsonFeatureVisible,
                options: { attribution: 'fjdskl' },
            };
            newGeoJsonMetadataInvisible = {
                id: 'testNewGeoJsonLayerInvisible',
                label: 'testNewGeoJsonLayerInvisible',
                visibleInitially: false,
                data: newGeojsonFeatureInvisible,
            };
            newTileLayerVisible = {
                id: 'testNewTileLayerVisible',
                label: 'testNewTileLayerVisible',
                url: 'www.testNewTileLayerVisibleUrl.com',
                visibleInitially: true,
                options: {
                    zIndex: 9,
                },
            };
            newTileLayerInvisible = {
                id: 'testNewTileLayerInvisible',
                label: 'testNewTileLayerInvisible',
                url: 'www.testNewTileLayerInvisibleUrl.com',
                visibleInitially: false,
                options: { maxZoom: 3},
            };
            newImageOverlay = {
                id: 'testNewImageOverlay1',
                label: 'testNewImageOverlay1',
                visibleInitially: true,
                url: 'url',
                bounds: [[40.712216, -74.22655], [40.773941, -74.12544]],
                options: {attribution: 'I\'m a test image overlay!'},
            };
            testAddLayerReference = declarativeLayers.addLayer(newGeoJsonMetadataVisible);
            declarativeLayers.addLayer(newGeoJsonMetadataInvisible);
            declarativeLayers.addLayer(newTileLayerVisible);
            declarativeLayers.addLayer(newTileLayerInvisible);
            declarativeLayers.addLayer(newImageOverlay);
            layerReferences = declarativeLayers.getLayerReferences();
        });
        describe('adding layers to the map and references post inititialization', () => {
            it('should add a new layer to the references regardless of if it tagged as visible', () => {
                expect(layerReferences.testNewGeoJsonLayerVisible).toBeDefined();
                expect(layerReferences.testNewGeoJsonLayerInvisible).toBeDefined();
                expect(layerReferences.testNewTileLayerVisible).toBeDefined();
                expect(layerReferences.testNewTileLayerInvisible).toBeDefined();
                expect(layerReferences.testNewImageOverlay1).toBeDefined();
            });
            it('should add the new visible layers to the existing layers on the map', () => {
                expect(map.addLayer).toHaveBeenCalledWith(layerReferences.testNewGeoJsonLayerVisible);
                expect(map.addLayer).toHaveBeenCalledWith(layerReferences.testNewTileLayerVisible);
                expect(map.addLayer).toHaveBeenCalledWith(layerReferences.testNewImageOverlay1);
            });
            it('should NOT add a new layer with a false visible property to the map', () => {
                expect(map.addLayer).not.toHaveBeenCalledWith(layerReferences.testNewGeoJsonLayerInvisible);
                expect(map.addLayer).not.toHaveBeenCalledWith(layerReferences.testNewTileLayerInvisible);
            });
            it('the addLayer function should return a reference to the added layer', () => {
                expect(_.isEqual(testAddLayerReference, layerReferences.testNewGeoJsonLayerVisible)).toBeTruthy();
            });
            describe('including layer options', () => {
                it('should pass on tileLayer options to the Leaflet layer', () => {
                    expect((layerReferences.testNewTileLayerVisible as leaflet.TileLayer).options.zIndex)
                     .toEqual((newTileLayerVisible as dataTypes.ITilesMetadata).options.zIndex);
                    expect((layerReferences.testNewTileLayerInvisible as leaflet.TileLayer).options.maxZoom)
                    .toEqual((newTileLayerInvisible as dataTypes.ITilesMetadata).options.maxZoom);
                });
                it('should pass on GeoJSON options to the Leaflet layer', () => {
                    expect(layerReferences.testNewGeoJsonLayerVisible.options.attribution)
                    .toEqual(newGeoJsonMetadataVisible.options.attribution);
                });
                // TODO explicit test for info win not conflicting with options
                it ('should pass image overlay options to Leaflet', () => {
                    expect(declarativeLayers.getLayerReferences().testImageOverlay1.options.attribution)
                    .toEqual(layers[3].options.attribution);
                });
            });
        });
        describe('removing layers from the map post inititialization', () => {
            beforeEach(() => {
                declarativeLayers.removeLayer(layerReferences.testNewGeoJsonLayerVisible);

            });
            it('should remove a layer from the map', () => {
                expect(map.removeLayer).toHaveBeenCalledWith(layerReferences.testNewGeoJsonLayerVisible);
            });
            it('the layer should still be available in the layer references', () => {
                expect(layerReferences.testNewGeoJsonLayerVisible).toBeDefined();
            });
        });
    });
});
