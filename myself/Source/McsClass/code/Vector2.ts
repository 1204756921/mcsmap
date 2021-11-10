
import defaultValue from "../../Core/defaultValue.js";
import { default as Cartesian2 } from '../../Core/Cartesian2.js';

/**
 * A 3D Cartesian point.
 * @constructor 2维坐标点
 *
 * @param {number} [x=0.0] The X component.
 * @param {number} [y=0.0] The Y component.
 *
 */
export default class Vector2{
    x:number
    y:number
    constructor(x,y){
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
    }
    /** 
    * 计算两个点直接的距离
     *
     * @param {Vector2} left 第一个点
     * @param {Vector2} right 第二个点
     *
     */
    static distance(left:Vector2,right:Vector2):number{
        let leftc = new Cartesian2(left.x,left.y);
        let rightc = new Cartesian2(right.x,right.y);
        return Cartesian2.distance(leftc,rightc);
    } 

}