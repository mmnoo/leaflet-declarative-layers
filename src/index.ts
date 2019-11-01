import * as dataTypes from './dataTypes';
import { Map, TileLayer, GeoJSON } from 'leaflet';

export interface ILayerReference {
    [state: string]: dataTypes.ILeafletLayer;
}

export class DeclarativeLayers {
    private map: Map;
    private layerReferences: ILayerReference = {}; // reference for removal from map

    constructor(targetMap: Map, layersMetadata?: dataTypes.ILayersMetadata) {
        this.map = targetMap;
        if (layersMetadata) {
            layersMetadata.forEach((layerMetadata) => {
                this.initializeLayer(layerMetadata);
            });
        }
    }
    public getLayerReferences = () => {
        return this.layerReferences;
    }

    public addLayer = (layerMetadata: dataTypes.ILayerMetadata): dataTypes.ILeafletLayer => {
        this.initializeLayer(layerMetadata);
        return this.layerReferences[layerMetadata.id];
    }
    public removeLayer = (layer: dataTypes.ILeafletLayer): void => {
        this.map.removeLayer(layer);
    }
    private initializeLayer = (layerMetadata: dataTypes.ILayerMetadata): void => {
        if (dataTypes.isTilesType(layerMetadata)) {
            this.initializeTileLayer(layerMetadata as dataTypes.ITilesMetadata);
        } else if (dataTypes.isGeoJsonType(layerMetadata)) {
            this.initializeGeoJsonLayer(layerMetadata as dataTypes.IGeoJsonMetadata);
        }
        if (this.shouldBeVisible(layerMetadata)) {
            this.map.addLayer(this.layerReferences[layerMetadata.id]);
        }
    }
    private addLayerToReferences = (id: string, layer: dataTypes.ILeafletLayer) => {
      this.layerReferences[id] = layer;
    }
    private shouldBeVisible = (layerMetadata: dataTypes.ILayerMetadata): boolean => {
        // if tagged as visible AND initialized
       return layerMetadata.visible && !!this.layerReferences[layerMetadata.id];
    }
    private initializeTileLayer = (layerMetadata: dataTypes.ITilesMetadata) => {
        const tileLayer: TileLayer = new TileLayer(layerMetadata.url, {zIndex: layerMetadata.zIndex});
        this.addLayerToReferences( layerMetadata.id,  tileLayer);
    }
    private initializeGeoJsonLayer = (layerMetadata: dataTypes.IGeoJsonMetadata) => {
        const geoJsonLayer: GeoJSON = new GeoJSON(layerMetadata.data, {});
        this.addLayerToReferences( layerMetadata.id,  geoJsonLayer);
    }
}
