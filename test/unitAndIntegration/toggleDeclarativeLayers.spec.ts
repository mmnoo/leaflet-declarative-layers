import { Mock } from "ts-mocks";
import * as leaflet from "leaflet";
import * as dataTypes from "../../src/dataTypes";
import {
  DeclarativeLayers,
  ILayerReference,
} from "../../src/DeclarativeLayers";
import {
  FeatureCollection as geoJsonFeatureCollection,
  Feature as geoJsonFeature,
} from "../../node_modules/@types/geojson/index";
const geojsonFeatureCollection: geoJsonFeatureCollection = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: {
        popupContent: "18th & California Light Rail Stop",
      },
      geometry: {
        type: "Point",
        coordinates: [-104.98999178409576, 39.74683938093904],
      },
    },
    {
      type: "Feature",
      properties: {
        popupContent: "20th & Welton Light Rail Stop",
      },
      geometry: {
        type: "Point",
        coordinates: [-104.98689115047453, 39.747924136466565],
      },
    },
  ],
};
const layers: dataTypes.ILayersMetadata = [
  {
    id: "testTileLayer1",
    label: "testTileLayer1",
    url: "www.testTileLayer1url.com",
    visibleInitially: false,
  },
  {
    id: "testGeoJsonLayer1",
    label: "testGeoJsonLayer1",
    data: geojsonFeatureCollection,
    visibleInitially: false,
  },
  {
    id: "testImageOverlay1",
    label: "testImageOverlay1",
    visibleInitially: false,
    url: "url",
    bounds: [
      [40.712216, -74.22655],
      [40.773941, -74.12544],
    ],
  },
];

let map: leaflet.Map;
let MockMap: Mock<leaflet.Map>;
let declarativeLayers: DeclarativeLayers;
let testTileLayer1: leaflet.TileLayer;
let testGeoJsonLayer1: leaflet.GeoJSON;
let testImageOverlay: leaflet.ImageOverlay;

const initializateDeclarativeLayers = () => {
  declarativeLayers = new DeclarativeLayers(leaflet, map, layers);
  testTileLayer1 = declarativeLayers.getLayerReferences()
    .testTileLayer1 as leaflet.TileLayer;
  testGeoJsonLayer1 = declarativeLayers.getLayerReferences()
    .testGeoJsonLayer1 as leaflet.GeoJSON;
  testImageOverlay = declarativeLayers.getLayerReferences()
    .testImageOverlay1 as leaflet.ImageOverlay;
};
describe("toggling layers on and off with toggleLayer function", () => {
  let layersForToggling: dataTypes.ILeafletLayer[];
  beforeEach(() => {
    initializateDeclarativeLayers();
    layersForToggling = [testTileLayer1, testGeoJsonLayer1, testImageOverlay];
  });

  xit("toggles layers on", () => {
    MockMap = new Mock<leaflet.Map>({
      addLayer: Mock.ANY_FUNC,
      removeLayer: Mock.ANY_FUNC,
      hasLayer: () => {
        console.log("HERE");
        return false;
      },
    });
    map = MockMap.Object;
    layersForToggling.forEach((layer) => {
      declarativeLayers.toggleLayer(layer);
    });
    expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[0]);
    // expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[1]);
    // expect(map.addLayer).toHaveBeenCalledWith(layersForToggling[2]);
  });
  xit("toggles layers off", () => {
    (MockMap = new Mock<leaflet.Map>({
      addLayer: Mock.ANY_FUNC,
      removeLayer: Mock.ANY_FUNC,
      hasLayer: (layer) => true,
    })),
      (map = MockMap.Object);
    layersForToggling.forEach((layer) => {
      declarativeLayers.toggleLayer(layer);
    });
    expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[0]);
    //expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[1]);
    // expect(map.removeLayer).toHaveBeenCalledWith(layersForToggling[2]);
  });
});
