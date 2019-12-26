import {ILayersMetadata, ILeafletLayer, ILayerMetadata} from './dataTypes';
// TODO karma complains if import from '@types/leaflet'. Figure out more elegant solution.
import {Map as ILeafletMap} from '../node_modules/@types/leaflet/index';
import {ILeafletWithLDL, DeclarativeLayers} from './DeclarativeLayers';

declare const L: ILeafletWithLDL;
declare const define: any;
declare const exports: any;
declare const module: any;
declare const require: any;

// UMD pattern to support module sustems like AMD and CommonJS as reccommended by Leaflet
(((factory, window) => {

    // define an AMD module that relies on 'leaflet'
    if (typeof define === 'function' && define.amd) {
        define(['leaflet'], factory);

    // define a Common JS module that relies on 'leaflet'
    } else if (typeof exports === 'object') {
        module.exports = factory(require('leaflet'));
    }

    // attach your leaflet-declarative-layers to the global 'L' variable
    if (typeof window !== 'undefined' && window.L) {
        const leafletInstance = window.L as ILeafletWithLDL;
        leafletInstance.DeclarativeLayers = leafletInstance.Class.extend(factory(L));
    } else {
        const message: string =
         `The Leaflet reference is not available for the\
 Leaflet Environmental Layers plugin. Try reordering your script tags.`;
        throw new Error(message);
    }
})((leaflet: ILeafletWithLDL) => {
    let declarativeLayersInstance: DeclarativeLayers;
    const leafletDeclarativeLayersPlugin = {
        initialize: (map: ILeafletMap, layersMetadata: ILayersMetadata) => {
            declarativeLayersInstance = new DeclarativeLayers(L, map, layersMetadata);
        },
        getLayerReferences: () => declarativeLayersInstance.getLayerReferences(),
        addLayer: (layerMetadata: ILayerMetadata) => declarativeLayersInstance.addLayer(layerMetadata),
        removeLayer: (layer: ILeafletLayer) => declarativeLayersInstance.removeLayer(layer),
        toggleLayer: (layer: ILeafletLayer) => declarativeLayersInstance.toggleLayer(layer),
    };
    return leafletDeclarativeLayersPlugin;
}, window));
