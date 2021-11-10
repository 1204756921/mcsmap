import ImageLayer from "../mcsBaseMap/ImageLayer";
import { defaultValue } from '../mcsUtil/defind';
import { default as WebMapServiceImageryProvider } from '../../Scene/WebMapServiceImageryProvider.js';
export default class WmsImageLayer extends ImageLayer {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.name = defaultValue(options.name, 'wmsMap');
        this.show = defaultValue(options.show, true);
        this.url = options.url;
        this.layers = options.layers;
        this.parameters = options.parameters;
        this.type = "WmsImageLayer";
    }
    set show(val) {
        this._show = val;
        this.layer.show = val;
    }
    get show() {
        return this._show;
    }
    addTo(map) {
        this.map = map;
        this.layer = this.map.imageryLayers.addImageryProvider(new WebMapServiceImageryProvider({
            url: this.url,
            layers: this.layers,
            parameters: this.parameters,
        }));
    }
    remove() {
        if (this.map) {
            this.map.imageryLayers.remove(this.layer);
        }
    }
}
