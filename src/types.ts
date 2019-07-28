import { LatLngBounds, TileLayer } from 'leaflet';

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

export interface IJsonMetadata  extends IBasicMetadata {
    file: string;
}

export interface ITilesMetadata  extends IBasicMetadata {
    url: string;
    zIndex?: number; // zIndex relative to other raster layers
}

export type ILayerMetadata = ITilesMetadata | IJsonMetadata | IImageMetadata;

export interface ILayersMetadata extends Array<ILayerMetadata> {}

export type ILeafletLayers = TileLayer;
