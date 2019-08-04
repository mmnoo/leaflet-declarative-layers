import { ILayersMetadata, ILayerMetadata, ITilesMetadata, ILeafletLayers} from './types';
import { Map } from 'leaflet';
import { TileLayer } from 'leaflet';

export interface ILayerReference {
    [state: string]: TileLayer;
}

export class DeclarativeLayers {
    private map: Map;
    private layerReferences: ILayerReference = {}; // reference for removal from map

    constructor(targetMap: Map, layersMetadata: ILayersMetadata) {
        this.map = targetMap;
        layersMetadata.forEach((layerMetadata) => {
            this.initializeLayer(layerMetadata);
        });
    }

    public getLayerReferences = () => {
        return this.layerReferences;
    }

    private initializeLayer = (layerMetadata: ILayerMetadata): void => {
        if (layerMetadata.hasOwnProperty('url')) {
            this.initializeTileLayer(layerMetadata as ITilesMetadata);
        }
        if (this.shouldBeVisible(layerMetadata)) {
            this.map.addLayer(this.layerReferences[layerMetadata.id]);
        }
    }
    private addLayerToReferences = (id: string, layer: ILeafletLayers) => {
      this.layerReferences[id] = layer;
    }
    private shouldBeVisible = (layerMetadata: ILayerMetadata): boolean => {
       return layerMetadata.visible;
    }
    private initializeTileLayer = (tileLayerMetadata: ITilesMetadata) => {
        const tileLayer: TileLayer = new TileLayer(tileLayerMetadata.url, {zIndex: tileLayerMetadata.zIndex});
        this.addLayerToReferences( tileLayerMetadata.id,  tileLayer);
    }
}
