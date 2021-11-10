
import { default as SceneTransforms } from '../.././Scene/SceneTransforms.js';
import Vector3 from '../code/Vector3.js';
import { default as Cartesian3 } from '../../Core/Cartesian3.js';

/**
 * 将dom元素创建到地图中
 */
export default class CreatEntityInfo{
    constructor(){
        
    }
    /**
     * @creat 在视图中创建一个dom 元素
     * @param {HTMLElement} dom - dom元素
     * @param {any} viewer - 视图 
     * @param {Vector3} point- 坐标
     *  @param {number} xOffe - 屏幕横向偏移值
     * @param {number} yOffe - 屏幕纵向偏移值
     * @param {string} domId - dom 元素的Id
     */
    static creat(dom:HTMLElement,viewer:any,point:Vector3,xOffe:number,yOffe:number,domId:string){
        viewer.container.appendChild(dom)
        let dirmoveHandler=() =>{
            try {
                let pos = SceneTransforms.wgs84ToWindowCoordinates(viewer.scene, new Cartesian3(point.x,point.y,point.z));
                dom.style.bottom = viewer.canvas.clientHeight-yOffe - pos.y+'px';
                dom.style.left = pos.x+xOffe+ 'px';
            } catch (error) {
                console.log(error)
            }
        }
        viewer.scene.postRender.removeEventListener(dirmoveHandler,domId);
        viewer.scene.postRender.addEventListener(dirmoveHandler,domId);
    }

}