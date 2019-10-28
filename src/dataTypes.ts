import { LatLngBounds, TileLayer, GeoJSON} from 'leaflet';
// TODO karma complains if import from 'geoJson'. Figure out more elegant solution.
import { GeoJsonObject } from '../node_modules/@types/geojson/index';

export interface IBasicMetadata {
    label: string;
    visible: boolean;
    id: string;
    legend?: string; // path to legend image
}

export interface IImageMetadata extends IBasicMetadata {
    file: string;
    bounds: LatLngBounds;
    zIndex?: number; // zIndex relative to other raster layers
}

export interface IGeoJsonMetadata  extends IBasicMetadata {
    data: GeoJsonObject;
}

export interface ITilesMetadata  extends IBasicMetadata {
    url: string;
    zIndex?: number; // zIndex relative to other raster layers
}

export type ILayerMetadata = ITilesMetadata | IGeoJsonMetadata | IImageMetadata;

export interface ILayersMetadata extends Array<ILayerMetadata> {}

export type ILeafletLayers = TileLayer | GeoJSON;

// Type Guards
export const isTilesType = (layer: any): layer is ITilesMetadata => {
    return layer.url !== undefined;
};
export const isGeoJsonType = (layer: any): layer is IGeoJsonMetadata => {
    return layer.data !== undefined;
};
