import { Mock } from 'ts-mocks';
import { Map, Layer, TileLayer } from 'leaflet';
import { ILayersMetadata, ITilesMetadata} from '../src/types';
import { DeclarativeLayers } from '../src/index';
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
}];
let map: Map;
let MockMap: Mock<Map>;
let declativeLayers: DeclarativeLayers;

const initializateDeclarativeLayers = () => {
    MockMap = new Mock<Map>({
        addLayer: Mock.ANY_FUNC,
    });
    map = MockMap.Object;
    declativeLayers = new DeclarativeLayers(map, layers);
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
           expect( Object.keys(declativeLayers.getLayerReferences()).length).toEqual(layers.length);
        });
    });
    describe('tile layers', () => {
        it('loads tile layers', () => {
           expect(map.addLayer).toHaveBeenCalledWith(declativeLayers.getLayerReferences().testTileLayer1);
        });
        it('passes the zIndex parameter', () => {
            expect(declativeLayers.getLayerReferences().testTileLayer1.options.zIndex)
            .toEqual((layers[0] as ITilesMetadata).zIndex);
            expect(declativeLayers.getLayerReferences().testTileLayer2.options.zIndex)
            .toBe((layers[1] as ITilesMetadata).zIndex);

        });
    });
});
