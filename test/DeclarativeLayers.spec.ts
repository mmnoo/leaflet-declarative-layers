import { Mock } from 'ts-mocks';
import * as leaflet from 'leaflet';
import * as dataTypes from '../src/dataTypes';
import { DeclarativeLayers, ILayerReference } from '../src/DeclarativeLayers';
import {_} from 'lodash';
import {
    FeatureCollection as geoJsonFeatureCollection,
    Feature as geoJsonFeature,
} from '../node_modules/@types/geojson/index';
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
    zIndex: 3,
},
{
    id: 'testTileLayer2',
    label: 'testTileLayer2',
    url: 'www.testTileLayer1Url.com',
    visibleInitially: false,
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
            it('passes the zIndex parameter', () => {
                expect(testTileLayer1.options.zIndex).toEqual((layers[0] as dataTypes.ITilesMetadata).zIndex);
                expect(testTileLayer2.options.zIndex).toBe((layers[1] as dataTypes.ITilesMetadata).zIndex);
            });
        });
        describe('GeoJson layers', () => {
            it('should load GeoJson Layers', () => {
                expect(map.addLayer).toHaveBeenCalledWith(declarativeLayers.getLayerReferences().testGeoJsonLayer1);
            });
        });
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
    describe('adding  and removing layers after initialization', () => {
        let newGeoJsonMetadataVisible: dataTypes.ILayerMetadata;
        let newGeoJsonMetadataInvisible: dataTypes.ILayerMetadata;
        let newTileLayerVisible: dataTypes.ILayerMetadata;
        let newTileLayerInvisible: dataTypes.ILayerMetadata;
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
                zIndex: 9,
            };
            newTileLayerInvisible = {
                id: 'testNewTileLayerInvisible',
                label: 'testNewTileLayerInvisible',
                url: 'www.testNewTileLayerInvisibleUrl.com',
                visibleInitially: false,
            };
            testAddLayerReference = declarativeLayers.addLayer(newGeoJsonMetadataVisible);
            declarativeLayers.addLayer(newGeoJsonMetadataInvisible);
            declarativeLayers.addLayer(newTileLayerVisible);
            declarativeLayers.addLayer(newTileLayerInvisible);
            layerReferences = declarativeLayers.getLayerReferences();
        });
        describe('adding layers to the map and references post inititialization', () => {
            it('should add a new layer to the references regardless of if it tagged as visible', () => {
                expect(layerReferences.testNewGeoJsonLayerVisible).toBeDefined();
                expect(layerReferences.testNewGeoJsonLayerInvisible).toBeDefined();
                expect(layerReferences.testNewTileLayerVisible).toBeDefined();
                expect(layerReferences.testNewTileLayerInvisible).toBeDefined();
            });
            it('should add the new visible layers to the existing layers on the map', () => {
                expect(map.addLayer).toHaveBeenCalledWith(layerReferences.testNewGeoJsonLayerVisible);
                expect(map.addLayer).toHaveBeenCalledWith(layerReferences.testNewTileLayerVisible);
            });
            it('should NOT add a new layer with a false visible property to the map', () => {
                expect(map.addLayer).not.toHaveBeenCalledWith(layerReferences.testNewGeoJsonLayerInvisible);
                expect(map.addLayer).not.toHaveBeenCalledWith(layerReferences.testNewTileLayerInvisible);
            });
            it('should return a reference to the added layer', () => {
                expect(_.isEqual(testAddLayerReference, layerReferences.testNewGeoJsonLayerVisible)).toBeTruthy();
            });
            describe('including layer properties', () => {
                it('should include zindex in added tile layers', () => {
                    expect((layerReferences.testNewTileLayerVisible as leaflet.TileLayer).options.zIndex)
                    .toEqual((newTileLayerVisible as dataTypes.ITilesMetadata).zIndex);
                    expect((layerReferences.testNewTileLayerInvisible as leaflet.TileLayer).options.zIndex)
                    .toEqual((newTileLayerInvisible as dataTypes.ITilesMetadata).zIndex);
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
