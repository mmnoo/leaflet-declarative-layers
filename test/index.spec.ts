import { Mock } from 'ts-mocks';
import { Map, TileLayer } from 'leaflet';
import { ILayersMetadata, ITilesMetadata, ILayerMetadata, ILeafletLayer} from '../src/dataTypes';
import { DeclarativeLayers, ILayerReference } from '../src/index';
import { Feature } from '../node_modules/@types/geojson';
import {_} from 'lodash';
const geojsonFeature: Feature = {
    type: 'Feature',
    properties: {},
    geometry: {
        type: 'Point',
        coordinates: [-104.99404, 39.75621],
    },
};
const layers: ILayersMetadata = [{
    id: 'testTileLayer1',
    label: 'testTileLayer1',
    url: 'www.testTileLayer1url.com',
    visible: true,
    zIndex: 3,
},
{
    id: 'testTileLayer2',
    label: 'testTileLayer2',
    url: 'www.testTileLayer1Url.com',
    visible: false,
},
{
    id: 'testGeoJsonLayer1',
    label: 'testGeoJsonLayer1',
    visible: true,
    data: geojsonFeature,
}];
let map: Map;
let MockMap: Mock<Map>;
let declarativeLayers: DeclarativeLayers;
let testTileLayer1: TileLayer;
let testTileLayer2: TileLayer;

const initializateDeclarativeLayers = () => {
    MockMap = new Mock<Map>({
        addLayer: Mock.ANY_FUNC,
        removeLayer: Mock.ANY_FUNC,
    });
    map = MockMap.Object;
    declarativeLayers = new DeclarativeLayers(map, layers);
    testTileLayer1 = declarativeLayers.getLayerReferences().testTileLayer1 as TileLayer;
    testTileLayer2 = declarativeLayers.getLayerReferences().testTileLayer2 as TileLayer;
};
describe('declarative layers', () => {
    beforeEach(() => {
        initializateDeclarativeLayers();
    });
    describe('initialization', () => {
        it('adds only visible layers to the map', () => {
            const visibleItems = layers.filter((layer) => layer.visible);
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
                expect(testTileLayer1.options.zIndex).toEqual((layers[0] as ITilesMetadata).zIndex);
                expect(testTileLayer2.options.zIndex).toBe((layers[1] as ITilesMetadata).zIndex);
            });
        });
        describe('GeoJson layers', () => {
            it('should load GeoJson Layers', () => {
                expect(map.addLayer).toHaveBeenCalledWith(declarativeLayers.getLayerReferences().testGeoJsonLayer1);
            });
        });
    });
    describe('adding  and removing layers after initialization', () => {
        let newGeoJsonMetadataVisible: ILayerMetadata;
        let newGeoJsonMetadataInvisible: ILayerMetadata;
        let newTileLayerVisible: ILayerMetadata;
        let newTileLayerInvisible: ILayerMetadata;
        const newGeojsonFeatureVisible: Feature = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-104.99404, 39.75621],
            },
        };
        const newGeojsonFeatureInvisible: Feature = {
            type: 'Feature',
            properties: {},
            geometry: {
                type: 'Point',
                coordinates: [-104.99404, 39.1],
            },
        };
        let layerReferences: ILayerReference;
        let testAddLayerReference: ILeafletLayer;
        beforeEach(() => {
            newGeoJsonMetadataVisible = {
                id: 'testNewGeoJsonLayerVisible',
                label: 'testNewGeoJsonLayerVisible',
                visible: true,
                data: newGeojsonFeatureVisible,
            };
            newGeoJsonMetadataInvisible = {
                id: 'testNewGeoJsonLayerInvisible',
                label: 'testNewGeoJsonLayerInvisible',
                visible: false,
                data: newGeojsonFeatureInvisible,
            };
            newTileLayerVisible = {
                id: 'testNewTileLayerVisible',
                label: 'testNewTileLayerVisible',
                url: 'www.testNewTileLayerVisibleUrl.com',
                visible: true,
                zIndex: 9,
            };
            newTileLayerInvisible = {
                id: 'testNewTileLayerInvisible',
                label: 'testNewTileLayerInvisible',
                url: 'www.testNewTileLayerInvisibleUrl.com',
                visible: false,
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
                    expect((layerReferences.testNewTileLayerVisible as TileLayer).options.zIndex)
                    .toEqual((newTileLayerVisible as ITilesMetadata).zIndex);
                    expect((layerReferences.testNewTileLayerInvisible as TileLayer).options.zIndex)
                    .toEqual((newTileLayerInvisible as ITilesMetadata).zIndex);
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
