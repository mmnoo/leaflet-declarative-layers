import { Mock } from 'ts-mocks'
import * as leaflet from 'leaflet'
import * as dataTypes from '../../src/dataTypes'
import { DeclarativeLayers, ILayerReference } from '../../src/DeclarativeLayers'
import {
  FeatureCollection as geoJsonFeatureCollection,
  Feature as geoJsonFeature,
} from '../../node_modules/@types/geojson/index'
const geojsonFeatureCollection: geoJsonFeatureCollection = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {
        popupContent: '18th & California Light Rail Stop',
      },
      geometry: {
        type: 'Point',
        coordinates: [-104.98999178409576, 39.74683938093904],
      },
    },
    {
      type: 'Feature',
      properties: {
        popupContent: '20th & Welton Light Rail Stop',
      },
      geometry: {
        type: 'Point',
        coordinates: [-104.98689115047453, 39.747924136466565],
      },
    },
  ],
}
const layers: dataTypes.ILayersMetadata = [
  {
    id: 'testTileLayer1',
    label: 'testTileLayer1',
    url: 'www.testTileLayer1url.com',
    visibleInitially: false,
  },
  {
    id: 'testGeoJsonLayer1',
    label: 'testGeoJsonLayer1',
    data: geojsonFeatureCollection,
    visibleInitially: false,
  },
  {
    id: 'testImageOverlay1',
    label: 'testImageOverlay1',
    visibleInitially: false,
    url: 'url',
    bounds: [
      [40.712216, -74.22655],
      [40.773941, -74.12544],
    ],
  },
]

let declarativeLayers: DeclarativeLayers
let testTileLayer1: leaflet.TileLayer
let testGeoJsonLayer1: leaflet.GeoJSON
let testImageOverlay: leaflet.ImageOverlay

const initializateDeclarativeLayers = (mockMap) => {
  declarativeLayers = new DeclarativeLayers(leaflet, mockMap, layers)
  testTileLayer1 = declarativeLayers.getLayerReferences()
    .testTileLayer1 as leaflet.TileLayer
  testGeoJsonLayer1 = declarativeLayers.getLayerReferences()
    .testGeoJsonLayer1 as leaflet.GeoJSON
  testImageOverlay = declarativeLayers.getLayerReferences()
    .testImageOverlay1 as leaflet.ImageOverlay
}
describe('toggling layers on and off with toggleLayer function', () => {
  let layersForToggling: dataTypes.ILeafletLayer[]

  it('toggles layers on', () => {
    const MockMap = new Mock<leaflet.Map>({
      addLayer: Mock.ANY_FUNC,
      removeLayer: Mock.ANY_FUNC,
      hasLayer: () => {
        return false
      },
    })
    const map = MockMap.Object

    initializateDeclarativeLayers(map)
    layersForToggling = [testTileLayer1, testGeoJsonLayer1, testImageOverlay]
    expect(map.addLayer).toHaveBeenCalledTimes(0) // because visibleInitially set to false

    layersForToggling.forEach((layer) => {
      declarativeLayers.toggleLayer(layer)
    })

    expect(map.addLayer).toHaveBeenCalledTimes(3)
    expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[0])
    expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[1])
    expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[2])
  })
  it('foodfsps', () => {
    const MockMap = new Mock<leaflet.Map>({
      addLayer: Mock.ANY_FUNC,
      removeLayer: Mock.ANY_FUNC,
      hasLayer: () => {
        return true // the map pretends the layer exists already (Prob a less fragile way to do this, but I picked this WIP test up after 6 months and just want to get it done)
      },
    })
    const map = MockMap.Object

    initializateDeclarativeLayers(map)
    layersForToggling = [testTileLayer1, testGeoJsonLayer1, testImageOverlay]
    expect(map.removeLayer).toHaveBeenCalledTimes(0)

    layersForToggling.forEach((layer) => {
      declarativeLayers.toggleLayer(layer)
    })

    expect(map.removeLayer).toHaveBeenCalledTimes(3)

    expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[0])
    expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[1])
    expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[2])
  })
})
