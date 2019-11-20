A leaflet plugin to abstract away some details of adding data layers to a Leaflet map. Users just need to describe their data with a json object rather than adding each layer with redundant imperative code. Access to map layer references are available, so a user may still access full Leaflet layer methods and features. This project is definitely a work-in-progress and open to contributions. 

## Project setup

```npm install```

### Lint, test, bundle (minification is a to do item still)

```npm run build```

### Bundle only
 
```npm run bundle```

### Run unit tests

```npm run test```

### Lints and fixes files

```npm run lint```

## Usage

### Add the script to your file:
```<script src="../dist/leafletDeclarativeLayers.js"></script>```

(For now, first, you may need to run ```npm run build``` to compile the ```leafletDeclarativeLayers.js``` script. Eventually we will make the library available by other conventional means.)

### Describe your data with a 'metadata' JSON object. Available properties described below in the Properties section.
```
// data to be added, in this case, geoJSON
const geojsonFeatureCollection = {
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            properties: {
                popupContent: '18th & California Light Rail Stop'
            },
            geometry: {
                type: 'Point',
                coordinates: [-115, 49.5]
            },
        },
    ],
};
// the 'metadata'. An array of JSON objects that describes the data to be added to the map.
const layerMetadata = [
    {
        id: 'tileLayer',
        label: 'Tile Layer Example',
        url: 'https://stamen-tiles.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}.png',
        visibleInitially: true,
    }, 
    {
        id: 'geoJsonLayer',
        label: 'GeoJSON Layer Example',
        data: geojsonFeatureCollection,
        visibleInitially: true,
        generateFeaturePopupContent: (feature) => {
        return feature.properties.popupContent;
        },

    }
];

```
### Initialize a Leaflet map, and then a new DeclarativeLayers instance
```// regular Leaflet set up. Initialize a map, add a basemap
const map = new L.Map('map', { zoom: 8, center: new L.LatLng(49.5, -115)});
const basemap = new L.TileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {minZoom: 8, maxZoom: 12});		
map.addLayer(basemap); 

// initialize leaflet-declarative-layers with a reference to the same Leaflet instance that the map is using, the map, and the metadata array
const declaredLayers = new leafletDeclarativeLayers.DeclarativeLayers(L, map, layerMetadata); 
```

### One can access any of the layer references by the id used in the metadata
```declaredLayers.getLayerReferences().tileLayer```
This means you can use it like you would any other Leaflet layer. For example:
```declaredLayers.getLayerReferences().tileLayer.redraw()```

## Methods
|Method|Description|
|---|---|
|getLayerReferences()| Returns an `Object` containing references to all of the Leaflet layers added via the `DeclarativeLayers` class. Individual layers will be accessible by their id as specified in the metadata. 
|addLayer(`{metadata}`)| Adds a single layer to the map. A single metadata object parameter is required.|
|removeLayer(`Leaflet layer reference`) | Removes a layer from the map. The required Leaflet layer reference parameter can be obtained from the `getLayerReference` method or via other Leaflet methods.  

## Metadata properties
### Tile Layers (documentation to come)
### Image Layers (dosumentation to come)
### GeoJson Layers (documentation to come)
