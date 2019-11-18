import * as leaflet from 'leaflet';
// TODO karma complains if import from 'geoJson'. Figure out more elegant solution.
import * as geojson from '../node_modules/@types/geojson/index';

export interface IBasicMetadata {
    label: string;
    visibleInitially: boolean;
    id: string;
    legend?: string; // path to legend image
}

export interface IImageMetadata extends IBasicMetadata {
    file: string;
    bounds: leaflet.LatLngBounds;
    zIndex?: number; // zIndex relative to other raster layers
}

export interface IGeoJsonMetadata  extends IBasicMetadata {
    data: geojson.GeoJsonObject;
    options?: leaflet.GeoJSONOptions;
    generateFeaturePopupContent?(feature: geojson.Feature): leaflet.Content;
}

export interface ITilesMetadata  extends IBasicMetadata {
    url: string;
    zIndex?: number; // zIndex relative to other raster layers
}

export type ILayerMetadata = ITilesMetadata | IGeoJsonMetadata | IImageMetadata;

export interface ILayersMetadata extends Array<ILayerMetadata> {}

export type ILeafletLayer = leaflet.TileLayer | leaflet.GeoJSON;

// Type Guards
export const isTilesType = (layer: any): layer is ITilesMetadata => {
    return layer.url !== undefined;
};
export const isGeoJsonType = (layer: any): layer is IGeoJsonMetadata => {
    return layer.data !== undefined;
};
