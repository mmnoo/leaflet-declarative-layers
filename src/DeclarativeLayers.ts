import * as dataTypes from './dataTypes';
// TODO karma complains if import from 'geoJson'. Figure out more elegant solution.
import * as geoJson from '../node_modules/@types/geojson/index';
import * as leafletTypes from '../node_modules/@types/leaflet/index';

export interface ILayerReference {
    [state: string]: dataTypes.ILeafletLayer;
}
type leafletTypesCopy = typeof leafletTypes;
export interface ILeafletWithLDL extends leafletTypesCopy {
    DeclarativeLayers?: any;

}

export class DeclarativeLayers {
    private layerReferences: ILayerReference = {}; // reference for removal from map

    constructor(
            private suppliedLeafletReference: ILeafletWithLDL,
            private map: leafletTypes.Map,
            layersMetadata?: dataTypes.ILayersMetadata,
        ) {
        this.map = map;
        this.suppliedLeafletReference = suppliedLeafletReference;

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
        if (this.shouldBeVisibleInitially(layerMetadata)) {
            this.map.addLayer(this.layerReferences[layerMetadata.id]);
        }
    }
    private addLayerToReferences = (id: string, layer: dataTypes.ILeafletLayer) => {
      this.layerReferences[id] = layer;
    }
    private shouldBeVisibleInitially = (layerMetadata: dataTypes.ILayerMetadata): boolean => {
        // if tagged as visible AND initialized
       return layerMetadata.visibleInitially && !!this.layerReferences[layerMetadata.id];
    }
    private initializeTileLayer = (layerMetadata: dataTypes.ITilesMetadata) => {
        const tileLayer: leafletTypes.TileLayer =
            new this.suppliedLeafletReference.TileLayer(layerMetadata.url, {zIndex: layerMetadata.zIndex});
        this.addLayerToReferences( layerMetadata.id,  tileLayer);
    }
    private initializeGeoJsonLayer = (layerMetadata: dataTypes.IGeoJsonMetadata) => {
        const options: leafletTypes.GeoJSONOptions = layerMetadata.options ? layerMetadata.options : {};
        const computedOptions: leafletTypes.GeoJSONOptions = {
            onEachFeature: (feature: geoJson.Feature, layer: leafletTypes.Layer): void => {
                if (options.onEachFeature) {
                    options.onEachFeature(feature, layer);
                }
                if (layerMetadata.generateFeaturePopupContent) {
                    const popupContent: leafletTypes.Content = layerMetadata.generateFeaturePopupContent(feature);
                    layer.bindPopup(popupContent);
                }
            },
        };

        const geoJsonLayer: leafletTypes.GeoJSON
        = new this.suppliedLeafletReference.GeoJSON(layerMetadata.data, computedOptions);
        this.addLayerToReferences( layerMetadata.id,  geoJsonLayer);
    }
}