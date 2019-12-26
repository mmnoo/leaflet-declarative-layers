import * as dataTypes from './dataTypes';
// TODO karma complains if import from 'geoJson'. Figure out more elegant solution.
import * as geoJson from '../node_modules/@types/geojson/index';
import * as leafletTypes from '../node_modules/@types/leaflet/index';
import {defaultBooleanToTrue} from './utilities';

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
    public toggleLayer = (layer: dataTypes.ILeafletLayer): void => {
        if (this.map.hasLayer(layer)) {
            this.removeLayer(layer);
        } else {
            this.map.addLayer(layer);
        }
    }
    private initializeLayer = (layerMetadata: dataTypes.ILayerMetadata): void => {
        const layer: dataTypes.ILeafletLayer = this.createLeafletLayer(layerMetadata);
        this.addLayerToReferences(layerMetadata.id, layer);
        if (this.shouldBeVisibleInitially(layerMetadata)) {
            this.map.addLayer(this.layerReferences[layerMetadata.id]);
        }
    }
    private createLeafletLayer = (layerMetadata: dataTypes.ILayerMetadata): dataTypes.ILeafletLayer => {
        if (dataTypes.isTilesType(layerMetadata)) {
            return this.initializeTileLayer(layerMetadata as dataTypes.ITilesMetadata);
        } else if (dataTypes.isGeoJsonType(layerMetadata)) {
            return this.initializeGeoJsonLayer(layerMetadata as dataTypes.IGeoJsonMetadata);
        } else if (dataTypes.isImageOverlayType(layerMetadata)) {
            return this.initializeImageOverlayLayer(layerMetadata as dataTypes.IImageOverlayMetadata);
        } else {
            throw new Error(`the data type for ${layerMetadata!.id} isnt currently supported`);
        }
    }
    private addLayerToReferences = (id: string, layer: dataTypes.ILeafletLayer) => {
      this.layerReferences[id] = layer;
    }
    private shouldBeVisibleInitially = ({visibleInitially, id}: dataTypes.ILayerMetadata): boolean => {
        // if tagged as visible AND initialized
       return defaultBooleanToTrue(visibleInitially) && !!this.layerReferences[id];
    }
    private initializeTileLayer = (layerMetadata: dataTypes.ITilesMetadata) => {
        return new this.suppliedLeafletReference.TileLayer(layerMetadata.url, layerMetadata.options);
    }
    private initializeImageOverlayLayer = (layerMetadata: dataTypes.IImageOverlayMetadata) => {
        return new this.suppliedLeafletReference.ImageOverlay
        (layerMetadata.url, layerMetadata.bounds, layerMetadata.options);
    }
    private initializeGeoJsonLayer = (layerMetadata: dataTypes.IGeoJsonMetadata) => {
        const options: leafletTypes.GeoJSONOptions = layerMetadata.options ? layerMetadata.options : {};
        const onEachFeatureOptions: leafletTypes.GeoJSONOptions = {
            onEachFeature: (feature: geoJson.Feature, layer: leafletTypes.GeoJSON): void => {
                if (options.onEachFeature) {
                    options.onEachFeature(feature, layer);
                }
                if (layerMetadata.generateFeaturePopupContent) {
                    const popupContent: leafletTypes.Content = layerMetadata.generateFeaturePopupContent(feature);
                    layer.bindPopup(popupContent);
                }
            },
        };
        const mergedOptions: leafletTypes.GeoJSONOptions = {...options, ...onEachFeatureOptions};
        return new this.suppliedLeafletReference.GeoJSON(layerMetadata.data, mergedOptions);
    }
}
