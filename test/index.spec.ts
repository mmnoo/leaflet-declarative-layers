import { Mock } from 'ts-mocks';
import { Map } from 'leaflet';
import { ILayersMetadata} from '../src/types';
import { DynamicLayers } from '../src/index';

describe('initialization', () => {
    it('adds enabled layers to the map', () => {
        const layers: ILayersMetadata = [{
            id: 'testId1',
            label: 'testLabel1',
            url: 'www.testUrl1.com',
            visible: true,
        },
        {
            id: 'testId2',
            label: 'testLabel2',
            url: 'www.testUrl2.com',
            visible: true,
        }];
        const MockMap = new Mock<Map>({addLayer: Mock.ANY_FUNC});
        const map = MockMap.Object;
        const dynamicLayers = new DynamicLayers(map, layers);
        expect(map.addLayer).toHaveBeenCalledTimes(2);
    });
});
