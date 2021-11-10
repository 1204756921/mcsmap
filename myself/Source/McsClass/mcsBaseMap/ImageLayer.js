import BaseLayer from "./BaseLayer";
/**
 * 影像图层父类，抽象类，不可实例化
 * @abstract
 * @class
 */
export default class ImageLayer extends BaseLayer {
    constructor() {
        super();
        this.type = "ImageLayer";
    }
    /**
     *
     * @param map 视图
     */
    addTo(map) {
    }
}
