import { ILayersMetadata, ILayerMetadata, ITilesMetadata, ILeafletLayers} from './types';
import { Map } from 'leaflet';
import { TileLayer } from 'leaflet';

export class DynamicLayers {
    private map: Map;
    private layerReferences: {[state: string]: TileLayer} = {}; // reference for removal from map

    constructor(targetMap: Map, layersMetadata: ILayersMetadata) {
        this.map = targetMap;
        layersMetadata.forEach((layerMetadata) => {
            if (layerMetadata.hasOwnProperty('url')) {
                const tileLayerMetadata = layerMetadata as ITilesMetadata;
                this.addLayerToReferences( tileLayerMetadata.id, new TileLayer(tileLayerMetadata.url, {zIndex: 3}) );
            }
            if (this.shouldBeVisible(layerMetadata)) {
                this.map.addLayer(this.layerReferences[layerMetadata.id]);
            }
        });
    }

    private addLayerToReferences = (id: string, layer: ILeafletLayers) => {
      this.layerReferences[id] = layer;
   }
   private shouldBeVisible = (layerMetadata: ILayerMetadata): boolean => {
       return layerMetadata.visible;
   }
}
