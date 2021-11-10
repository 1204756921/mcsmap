import Overlay from '../mcsBaseMap/Overlay.js';
import { defaultValue } from '../mcsUtil/defind';
import HeightType from '../code/HeightType.js';
import Vector2 from '../code/Vector2';
import { default as Cartesian3 } from '../../Core/Cartesian3.js';
import { default as Color } from '../../Core/Color';
import Labelstyle from '../code/TextStyle';
/**
     * @constructor
     * @param {Object} options - 实体选项
     * @param {String} options.id - 标签id
     * @param {String} options.name - 标签名称
     * @param {String} options.text - 标签内容
     * @param {number} options.fontSize - 标签字体大小
     * @param {Color} options.fillColor - 标签文字颜色
     * @param {LabelStyle} options.style - 标签样式
     * @param {Number} options.outlineWidth - 标签轮廓宽度
     * @param {Color} options.outlineColor - 标签轮廓颜色
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {Vector3} options.position - 标签位置[x,y,z]坐标
     * @param {HeightType} options.heightType - 高度模式
     * @param {Number} options.disableDistance - 深度测试的距离(默认不应用深度测试)
     * @param {Vector2} options.pixelOffset - 在屏幕的偏移[x,y]
     * @param {Number} options.scale  - 缩放大小
     */
export default class Label extends Overlay {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.position = options.position;
        this.name = options.name;
        this.show = defaultValue(options.show, true);
        this.scale = defaultValue(options.scale, 1);
        this.pixelOffset = defaultValue(options.pixelOffset, new Vector2(0, 0));
        this.text = defaultValue(options.text, '');
        this.fontSize = defaultValue(options.fontSize, 16);
        this.fillColor = defaultValue(options.fillColor, Color.WHITE);
        this.outlineColor = defaultValue(options.outlineColor, Color.TRANSPARENT);
        this.outlineWidth = defaultValue(options.outlineWidth, 0);
        this.style = defaultValue(options.LabelStyle, Labelstyle.FILL);
        this.heightType = defaultValue(options.heightType, HeightType.NONE);
        this.disableDistance = defaultValue(options.disableDistance, Number.POSITIVE_INFINITY);
        this.keyArry = ['id', 'name', 'show', 'position', 'scale', 'pixelOffset', 'heightType', 'fontSize', 'fillColor', 'outlineColor',
            'outlineWidth', 'style', 'disableDistance'];
        this.options = options;
    }
    addTo(map) {
        this.map = map;
        this.entity = {
            show: this.show,
            position: new Cartesian3(this.position.x, this.position.y, this.position.z),
            label: {
                text: this.text,
                font: this.fontSize + '"微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
                fillColor: this.fillColor,
                outlineColor: this.outlineColor,
                outlineWidth: this.outlineWidth,
                style: this.style,
                heightReference: this.heightType,
                disableDepthTestDistance: this.disableDistance
            }
        };
        for (let objKey of Object.keys(this.options)) {
            if (this.keyArry.indexOf(objKey) == -1) {
                this.entity[objKey] = this.options[objKey];
            }
        }
        if (this.id && this.id != null) {
            this.entity.id = this.id;
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
