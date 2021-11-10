import BaseLayer from "./BaseLayer";
/**
 * 图层父类，抽象类，不可实例化
 * @abstract
 * @class
 */
export default class ProviderLayer extends BaseLayer {
    constructor() {
        super();
        this.type = "ProviderLayer";
    }
    /**
     * @abstract
     * @private
     * @param map 视图
     */
    addTo(map) {
        throw new Error("Layer 子类必须实现该方法");
    }
    remove() {
        throw new Error("Layer 子类必须实现该方法");
    }
    /**
     * 飞行到图层
     */
    flyTo() {
        throw new Error("Overlay 子类必须实现该方法");
    }
}
