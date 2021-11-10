import { defaultValue } from '../mcsUtil/defind';
import HeightType from '../code/HeightType.js';
import Overlay from '../mcsBaseMap/Overlay.js';
import Vector2 from '../code/Vector2';
import { default as Cartesian3 } from '../../Core/Cartesian3.js';
import { default as Cartesian2 } from '../../Core/Cartesian2.js';
import { default as CallbackProperty } from '../.././DataSources/CallbackProperty.js';
/**
     * @constructor
     * @param {Object} options - 实体选项
     * @param {String} options.id - 图层id
     * @param {String} options.name - 图层显示名称
     * @param {Array} options.imgList - 序列图片集
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {Vector3} options.position - 图层位置
     * @param {HeightType} options.heightType - 高度模式:
     * @param {Number} options.disableDistance - 深度测试的距离(默认不应用深度测试)
     * @param {Vector2} options.pixelOffset - 在屏幕的偏移
     * @param {Number} options.rotation  - 旋转(弧度单位)
     * @param {Number} options.scale  - 缩放大小
     */
export default class GifIcon extends Overlay {
    constructor(options) {
        super();
        this.id = defaultValue(options.id, null);
        this.name = options.name;
        this.show = defaultValue(options.show, true);
        this.imaList = defaultValue(options.imaList, []);
        this.position = options.position;
        this.rotation = defaultValue(options.rotation, 0);
        this.scale = defaultValue(options.scale, 1);
        this.pixelOffset = defaultValue(options.pixelOffset, new Vector2(0, 0));
        this.heightType = defaultValue(options.heightType, HeightType.NONE);
        this.disableDistance = defaultValue(options.disableDistance, Number.POSITIVE_INFINITY);
        this.keyArry = ['id', 'name', 'show', 'position', 'rotation', 'scale', 'pixelOffset', 'heightType'];
        this.options = options;
    }
    addTo(map) {
        this.map = map;
        let flag = 0;
        let img = new CallbackProperty(() => {
            flag++;
            if (flag >= this.imaList.length) {
                flag = 0;
            }
            return this.imaList[flag];
        }, false);
        this.entity = {
            position: new Cartesian3(this.position.x, this.position.y, this.position.z),
            show: this.show,
            billboard: {
                image: img,
                pixelOffset: new Cartesian2(this.pixelOffset.x, this.pixelOffset.y),
                rotation: this.rotation,
                scale: this.scale,
                heightReference: this.heightType,
                disableDepthTestDistance: this.disableDistance,
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
