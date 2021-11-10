import { default as Color } from '../../Core/Color.js';
import { defaultValue } from '../mcsUtil/defind';
import HeightType from '../code/HeightType.js';
import { default as Cartesian3 } from '../../Core/Cartesian3.js';
import Overlay from '../mcsBaseMap/Overlay.js';
/**
     * @constructor
     * @param {Object} options - 实体选项
     * @param {String} options.id - 点标签id
     * @param {String} options.name - 点标签名称
     *  @param {Color} options.color - 点标签颜色
     * @param {Number} options.outlineWidth - 标签轮廓宽度 默认0
     * @param {Color} options.outlineColor - 标签轮廓颜色
     * @param {number} options.pixelSize - 标签大小 默认 1
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {Vector3} options.position - 标签位置[x,y,z]坐标
     * @param {HeightType} options.heightType - 高度模式
     * @param {Number} options.disableDistance - 深度测试的距离(默认不应用深度测试)
     */
export default class Point extends Overlay {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.position = options.position;
        this.name = options.name;
        this.show = defaultValue(options.show, true);
        this.pixelSize = defaultValue(options.pixelSize, 1);
        this.heightType = defaultValue(options.heightType, HeightType.NONE);
        this.color = defaultValue(options.color, Color.WHITE);
        this.disableDistance = defaultValue(options.disableDistance, Number.POSITIVE_INFINITY);
        this.outlineColor = defaultValue(options.outlineColor, Color.TRANSPARENT);
        this.outlineWidth = defaultValue(options.outlineWidth, 0);
        this.keyArry = ['id', 'name', 'show', 'position', 'heightType', 'color', 'outlineColor', 'outlineWidth', 'disableDistance'];
        this.options = options;
    }
    addTo(map) {
        this.map = map;
        this.entity = {
            position: new Cartesian3(this.position.x, this.position.y, this.position.z),
            show: this.show,
            point: {
                color: this.color,
                pixelSize: defaultValue(this.pixelSize, 1),
                outlineColor: this.outlineColor,
                outlineWidth: defaultValue(this.outlineWidth, 1),
                heightReference: this.heightType,
                disableDepthTestDistance: defaultValue(this.disableDistance, Number.POSITIVE_INFINITY)
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
