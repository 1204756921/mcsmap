import ProviderLayer from "../mcsBaseMap/ProviderLayer";
import { default as Cesium3DTileset } from '../.././Scene/Cesium3DTileset.js';
import { defaultValue } from '../mcsUtil/defind';
import { default as Cartographic } from '../.././Core/Cartographic.js';
import { default as Cartesian3 } from '../../Core/Cartesian3.js';
import { default as Matrix4 } from '../.././Core/Matrix4.js';
/**
   * @constructor
   * @param {Object} options - 图层选项
   * @param {String} options.id - 图层id
   * @param {String} options.name - 图层显示名称
   * @param {Boolean} options.show - 图层是否显示
   * @param {Boolean} options.url - 数据地址
   * @param {number} options.height - 偏移高度
   */
export default class TilesetLayer extends ProviderLayer {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.name = defaultValue(options.name, 'TilesetLayer');
        this._show = defaultValue(options.show, true);
        this.url = options.url;
        this.height = defaultValue(options.height, 0);
        this.type = 'TilesetLayer';
        this.layer = new Cesium3DTileset({
            url: this.url
        });
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
        let that = this;
        this.layer.show = this._show;
        this.layer.readyPromise.then((tileset) => {
            this.map.scene.primitives.add(tileset);
            var cartographic = Cartographic.fromCartesian(tileset.boundingSphere.center);
            var surface = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0.0);
            var offset = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, that.height);
            var translation = Cartesian3.subtract(offset, surface, new Cartesian3());
            tileset.modelMatrix = Matrix4.fromTranslation(translation);
        });
    }
    remove() {
        if (this.map) {
            this.map.scene.primitives.remove(this.layer);
        }
    }
    flyTo() {
        if (this.map) {
            this.map.flyTo(this.layer);
        }
    }
}
