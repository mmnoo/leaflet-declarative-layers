export interface BasicMetadata {
    label: string;
    selected: boolean;
    id: string;
    legend?: string; // path to legend image
}

export interface Coordinate {
    0: number;
    1: number;
}

export interface Bounds {
    0: Coordinate;
    1: Coordinate;
}

export interface RasterMetadata extends BasicMetadata {
    file: string;
    bounds: Bounds;
}

export interface JsonMetadata  extends BasicMetadata {
    file: string;
}

export interface TilesMetadata  extends BasicMetadata {
    url: string;
}

export interface MapMetadata {
    0: [RasterMetadata | JsonMetadata | TilesMetadata];
}
