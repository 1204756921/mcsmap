import { default as Color } from '../../Core/Color.js';
import Overlay from '../mcsBaseMap/Overlay.js';
import { defaultValue } from '../mcsUtil/defind';
/**
     * @constructor
     * @param {Object} options - 实体选项
     * @param {String} options.id - 点标签id
     * @param {String} options.name - 点标签名称
     *  @param {Color} options.color - 点标签颜色
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {Vector3[]} options.positions - 折线顶点坐标集合
     * @param {number} options.width - 线的宽度
     * @param {boolean} options.clampGround - 是否贴在地面上
     */
export default class Polyline extends Overlay {
    constructor(options) {
        super();
        this.positions = options.positions,
            this.id = defaultValue(options.id, null);
        this.name = options.name;
        this.show = defaultValue(options.show, true);
        this.color = defaultValue(options.color, Color.WHITE);
        this.width = defaultValue(options.width, 1);
        this.clampGround = defaultValue(options.clampGround, true);
        this.keyArry = ['id', 'name', 'show', 'positions', 'width', 'color', 'clampGround'];
        this.options = options;
    }
    addTo(map) {
        this.entity = {
            show: this.show,
            polyline: {
                positions: this.positions,
                clampToGround: this.clampGround,
                width: this.width,
                material: this.color,
            }
        };
        if (this.id && this.id != null) {
            this.entity.id = this.id;
        }
        for (let objKey of Object.keys(this.options)) {
            if (this.keyArry.indexOf(objKey) == -1) {
                this.entity[objKey] = this.options[objKey];
            }
        }
        this.map = map;
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
