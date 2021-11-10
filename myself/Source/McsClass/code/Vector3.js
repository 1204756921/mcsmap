import defaultValue from "../../Core/defaultValue.js";
import { default as Cartesian3 } from '../../Core/Cartesian3.js';
/**
 * A 3D Cartesian point.
 * @constructor 3维坐标点
 *
 * @param {number} [x=0.0] The X component.
 * @param {number} [y=0.0] The Y component.
 * @param {number} [z=0.0] The Z component.
 *
 */
export default class Vector3 {
    constructor(x, y, z) {
        /**
 * The X component.
 * @type {number}
 * @default 0.0
 */
        this.x = defaultValue(x, 0.0);
        /**
         * The Y component.
         * @type {number}
         * @default 0.0
         */
        this.y = defaultValue(y, 0.0);
        /**
         * The Z component.
         * @type {number}
         * @default 0.0
         */
        this.z = defaultValue(z, 0.0);
    }
    /**
    * 计算两个点直接的距离
     *
     * @param {Vector3} left 第一个点
     * @param {Vector3} right 第二个点
     *
     */
    static distance(left, right) {
        let leftc = new Cartesian3(left.x, left.y, left.z);
        let rightc = new Cartesian3(right.x, right.y, right.z);
        return Cartesian3.distance(leftc, rightc);
    }
    /**
    * 经纬度坐标转成 Vector3
     *
     * @param {number} longitude 经度
     * @param {number} latitude 纬度
     * @param {number} height 高度
     */
    static fromDegrees(longitude, latitude, height) {
        let car3 = Cartesian3.fromDegrees(longitude, latitude, height);
        return new Vector3(car3.x, car3.y, car3.z);
    }
    /**
   * 获取两个点的中间点
    *
    * @param {Vector3} left 第一个点
    * @param {Vector3} right 第二个点
    *
    */
    static midpoint(left, right) {
        let leftc = new Cartesian3(left.x, left.y, left.z);
        let rightc = new Cartesian3(right.x, right.y, right.z);
        let midol = null;
        midol = Cartesian3.midpoint(leftc, rightc, midol);
        return new Vector3(midol.x, midol.y, midol.z);
    }
}
