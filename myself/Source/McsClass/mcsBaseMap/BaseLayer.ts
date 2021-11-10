/**
 * 图层父类，抽象类，不可实例化
 * @abstract
 * @class
 */
export default class BaseLayer {
    /**
     * 图层唯一标识
     * @type {String}
     */
    id:string;
    /**
     * 图层名称
     * @type {String}
     */
    name:string;
    /**
     * 是否显示
     * @default true
     * @type {Boolean}
     */
    _show:boolean;
    /**
    * @readonly
    * @type {String} 图层类型
    */
    type:string;
    constructor() {
        this.id = null
        this.name = ""
        this._show = true
        this.type = "BaseLayer"
    }
    /**
     * 添加图层到map
     * @abstract
     */
    addTo(map) {
        throw new Error("BaseLayer 子类必须实现该方法")
    }

    /**
     * 移除图层
     * @abstract
     */
    remove() {
        throw new Error("BaseLayer 子类必须实现该方法")
    }
}