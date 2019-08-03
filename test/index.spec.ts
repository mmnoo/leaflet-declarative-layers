import { Mock } from 'ts-mocks';
import { Map } from 'leaflet';
import { ILayersMetadata} from '../src/types';
import { DeclarativeLayers } from '../src/index';
const layers: ILayersMetadata = [{
    id: 'testId1',
    label: 'testLabel1',
    url: 'www.testUrl1.com',
    visible: true,
},
{
    id: 'testId3',
    label: 'testLabel3',
    url: 'www.testUrl3.com',
    visible: false,
}];
describe('initialization', () => {
    it('adds only visible layers to the map', () => {
        const MockMap = new Mock<Map>({addLayer: Mock.ANY_FUNC});
        const map = MockMap.Object;
        const declativeLayers = new DeclarativeLayers(map, layers);
        expect(map.addLayer).toHaveBeenCalledTimes(1);
    });
});