import * as leaflet from 'leaflet'
// TODO karma complains if import from 'geoJson'. Figure out more elegant solution.
import * as geojson from '../node_modules/@types/geojson/index'

export interface IBasicMetadata {
  label: string
  visibleInitially?: boolean
  id: string
  legend?: string // path to legend image
}

export interface IImageOverlayMetadata extends IBasicMetadata {
  url: string
  bounds: leaflet.LatLngBoundsExpression
  options?: leaflet.ImageOverlayOptions
}

export interface IGeoJsonMetadata extends IBasicMetadata {
  data: geojson.GeoJsonObject
  options?: leaflet.GeoJSONOptions
  generateFeaturePopupContent?(feature: geojson.Feature): leaflet.Content
}

export interface ITilesMetadata extends IBasicMetadata {
  url: string
  options?: leaflet.TileLayerOptions
}

export type ILayerMetadata =
  | ITilesMetadata
  | IGeoJsonMetadata
  | IImageOverlayMetadata

export interface ILayersMetadata extends Array<ILayerMetadata> {}

export type ILeafletLayer =
  | leaflet.TileLayer
  | leaflet.GeoJSON
  | leaflet.ImageOverlay

// Type Guards
export const isTilesType = (layer: any): layer is ITilesMetadata => {
  return layer.url !== undefined && layer.bounds === undefined
}
export const isGeoJsonType = (layer: any): layer is IGeoJsonMetadata => {
  return layer.data !== undefined
}
export const isImageOverlayType = (
  layer: any,
): layer is IImageOverlayMetadata => {
  return layer.bounds !== undefined && layer.url !== undefined
}
