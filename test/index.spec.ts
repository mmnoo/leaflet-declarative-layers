import { Mock } from 'ts-mocks';
import { Map, Layer, TileLayer } from 'leaflet';
import { ILayersMetadata, ITilesMetadata, ILeafletLayers} from '../src/dataTypes';
import { DeclarativeLayers } from '../src/index';
import { Feature } from '../node_modules/@types/geojson';
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
        it('exposes references to added layers', () => {
           expect( Object.keys(declarativeLayers.getLayerReferences()).length).toEqual(layers.length);
           expect(declarativeLayers.getLayerReferences().testTileLayer1).toBeDefined();
           expect(declarativeLayers.getLayerReferences().testTileLayer2).toBeDefined();
           expect(declarativeLayers.getLayerReferences().testGeoJsonLayer1).toBeDefined();
        });
    });
    describe('addingLayers', () => {
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
});
