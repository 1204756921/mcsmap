export default class Overlay {
    constructor() {
        this.id = null;
        this.name = "";
        this._show = true;
        this.type = "Overlay";
    }
    /**
     * 添加到视图
     * @param map 视图
     * @returns Overlay 添加的实体
     */
    addTo(map) {
        throw new Error("Overlay 子类必须实现该方法");
    }
    /**
     * 移除
     * @abstract
     */
    remove() {
        throw new Error("Overlay 子类必须实现该方法");
    }
    /**
     * 定位到实体
     */
    flyTo() {
        throw new Error("Overlay 子类必须实现该方法");
    }
}
