import { default as Color } from '../../Core/Color.js';
import HeightType from '../code/HeightType.js';
import { default as PolygonGraphics } from '../../DataSources/PolygonGraphics.js';
import Overlay from '../mcsBaseMap/Overlay.js';
import { defaultValue } from '../mcsUtil/defind';
/**
     * @constructor
     * @param {Object} options - 实体选项
     * @param {String} options.id - 多边形id
     * @param {String} options.name - 多边形名称
     *  @param {Color} options.color - 多边形颜色
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {Vector3[]} options.positions - 多边形顶点坐标集合
     * @param {HeightType} options.heightType - 高度模式
     * @param {boolean} options.outline - 是否显示轮廓（默认false）
     * @param {Number} options.outlineWidth - 标签轮廓宽度
     * @param {Color} options.outlineColor - 标签轮廓颜色
     */
export default class Polygon extends Overlay {
    constructor(options) {
        super();
        this.positions = options.positions,
            this.id = defaultValue(options.id, null);
        this.show = defaultValue(options.show, true),
            this.name = options.name,
            this.color = defaultValue(options.color, Color.WHITE),
            this.heightType = defaultValue(options.heightType, HeightType.NONE),
            this.outline = defaultValue(options.outline, true);
        this.outlineColor = defaultValue(options.outlineColor, Color.TRANSPARENT);
        this.outlineWidth = defaultValue(options.outlineWidth, 0);
        this.keyArry = ['id', 'name', 'show', 'positions', 'color', 'heightType', 'outline', 'outlineColor', 'outlineWidth'];
        this.options = options;
    }
    addTo(map) {
        this.map = map;
        this.entity = {
            hierarchy: new PolygonGraphics({
                hierarchy: this.positions,
                material: this.color,
                outline: this.outline,
                outlineColor: this.outlineColor,
                outlineWidth: this.outlineWidth,
                heightReference: this.heightType
            }),
            show: this.show
        };
        if (this.id && this.id != null) {
            this.entity.id = this.id;
        }
        for (let objKey of Object.keys(this.options)) {
            if (this.keyArry.indexOf(objKey) == -1) {
                this.entity[objKey] = this.options[objKey];
            }
        }
        let enti = this.map.entities.add(this.entity);
        this.id = enti.id;
        return enti;
    }
    remove() {
        if (this.map) {
            this.map.entities.remove(this.entity);
        }
    }
    flyTo() {
        if (this.map) {
            this.map.flyTo(this.entity);
        }
    }
}
