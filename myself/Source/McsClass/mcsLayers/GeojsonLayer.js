import ProviderLayer from "../mcsBaseMap/ProviderLayer";
import { defaultValue } from '../mcsUtil/defind';
import { default as GeoJsonDataSource } from '../.././DataSources/GeoJsonDataSource.js';
/**
     * @constructor
     * @param {Object} options - 图层选项
     * @param {String} options.id - 图层id
     * @param {String} options.name - 图层显示名称
     * @param {Boolean} options.show - 图层是否显示
     * @param {Boolean} options.url - 数据地址
     */
export default class GeojsonLayer extends ProviderLayer {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.name = defaultValue(options.name, null);
        this._show = defaultValue(options.show, true);
        this.url = options.url;
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
        GeoJsonDataSource.load(this.url).then(datasource => {
            map.dataSources.add(datasource);
            this.layer = datasource;
            this.layer.show = this._show;
        });
    }
    remove() {
        if (this.map) {
            this.map.dataSources.remove(this.layer);
        }
    }
    flyTo() {
        if (this.map) {
            this.map.flyTo(this.layer);
        }
    }
}
