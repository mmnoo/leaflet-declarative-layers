import {ILayersMetadata, ILeafletLayer, ILayerMetadata} from './dataTypes';
// TODO karma complains if import from '@types/leaflet'. Figure out more elegant solution.
import {Map as ILeafletMap} from '../node_modules/@types/leaflet/index';
import {ILeafletWithLDL, DeclarativeLayers} from './DeclarativeLayers';

declare const L: ILeafletWithLDL;
{
    // Leaflet plugins should be added to the global 'L' namespace
    if ( typeof L !== 'undefined') {
        let declarativeLayers: DeclarativeLayers;
        L.DeclarativeLayers = L.Class.extend({
            initialize: (map: ILeafletMap, layersMetadata: ILayersMetadata) => {
                declarativeLayers = new DeclarativeLayers(L, map, layersMetadata);
            },
            getLayerReferences: () => declarativeLayers.getLayerReferences(),
            addLayer: (layerMetadata: ILayerMetadata) => declarativeLayers.addLayer(layerMetadata),
            removeLayer: (layer: ILeafletLayer) => declarativeLayers.removeLayer(layer),
        });
    } else {
        const message: string =
         'The Leaflet reference is not available for the \
          Leaflet Environmental Layers plugin. Try reordering your script tags.';
        throw new Error(message);
    }
}
