
import { default as ScreenSpaceEventHandler } from '../../Core/ScreenSpaceEventHandler.js';
import { default as ScreenSpaceEventType } from '../../Core/ScreenSpaceEventType.js';
import { default as Math } from '../../Core/Math.js';
import { default as Color } from '../../Core/Color.js'
import { default as HeightReference } from '../../Scene/HeightReference.js';
import { default as LabelStyle } from '../../Scene/LabelStyle.js';
import { defaultValue } from '../mcsUtil/defind';
import DrawType from '../code/DrawType.js';

/**
 * 绘制点
 * @param {any} viewer - 视图
 * @param {DrawType} DrawType 绘制类型
 * @param {boolean} isShow 是否显示点的坐标(经纬度) true
 */
export default class DrawPoint{
    viewer:any
    isShow:boolean   
    scene:any
    canvas:any
    camera:any
    ellipsoid:any
    entity:any
    position:any
    drawHandler:any
    layerId:any
    drawType:any
    fontColor:Color
    pointColor:Color
    constructor(viewer,drawType,isShow){
        this.viewer = viewer;
        this.isShow = defaultValue(isShow,true);
        this.scene = this.viewer.scene;
        this.canvas = this.viewer.scene.canvas;
        this.camera = this.viewer.scene.camera;
        this.ellipsoid = this.viewer.scene.globe.ellipsoid;
        this.entity = null;
        this.position = null;
        this.drawHandler = null;
        this.layerId = 'drawPoint';
        this.drawType = drawType;
    }
    clear(){
        if (this.drawHandler) {
            this.drawHandler.destroy();
            this.drawHandler = null;
        }
        
        //this._clearMarkers(this.layerId);
    }
     /**
      * 开始绘制
     * 鼠标左键绘制，右键结束
     * @param callback 绘制完成后的回调方法  参数为绘制的实体对象
     * @param fontColor 显示文字颜色 默认红色
     * @param pointColor 画的点颜色 默认白色
     */
    startDraw(callback,fontColor:Color,pointColor:Color){
        let _this = this;
        if(this.entity != null){
            this.viewer.entities.remove(this.entity);
        }
        this.entity = null;
        this.fontColor = defaultValue(fontColor,Color.RED);
        this.pointColor = defaultValue(pointColor,Color.WHITE)
        this.drawHandler = new ScreenSpaceEventHandler(this.canvas);
        this.drawHandler.setInputAction(function(event) {

            _this.clear();
            callback(_this.entity);
        }, ScreenSpaceEventType.LEFT_UP);
        this.drawHandler.setInputAction(function(event) {
            
            var wp = event.position;
            if (!wp) {
                return;
            }
            
            if(_this.drawType == 'model'){
                var cartesian = _this.scene.pickPosition(wp)
            }else{
                
                var ray = _this.camera.getPickRay(wp);
                if (!ray) {
                    return;
                }
                var cartesian = _this.scene.globe.pick(ray, _this.scene);
            }
            //var cartesian = _this.scene.pickPosition(wp)//_this.scene.globe.pick(ray, _this.scene);
            if (!cartesian) {
                return;
            }
            _this.position = cartesian;
        }, ScreenSpaceEventType.LEFT_CLICK);

        this.drawHandler.setInputAction(function(event) {
            var wp = event.endPosition;
            if (!wp) {
                return;
            }
            if(_this.drawType == 'model'){
                var cartesian = _this.scene.pickPosition(wp)
            }else{
                
                var ray = _this.camera.getPickRay(wp);
                if (!ray) {
                    return;
                }
                var cartesian = _this.scene.globe.pick(ray, _this.scene);
            }
            //var cartesian = _this.scene.pickPosition(wp)//_this.scene.globe.pick(ray, _this.scene);
            if (!cartesian) {
                return;
            }
            _this.position = cartesian;
            if (_this.entity == null) {
                _this._createPoint();
            } else {
                _this.entity.position.setValue(cartesian);
                var text = _this._getMeasureTip(_this.position);
                _this.entity.label.text = text;
            }
        }, ScreenSpaceEventType.MOUSE_MOVE);
    }
    _createPoint() {
        var _this = this;
        var text = _this._getMeasureTip(_this.position);
        var point = this.viewer.entities.add({
            position: _this.position,
            label: {
                text: text,
                font: '18px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
                fillColor: _this.fontColor,
                style: LabelStyle.FILL_AND_OUTLINE,
                heightReference:HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            point:{
                show : true, // default
                color :  _this.pointColor, // default: WHITE
                pixelSize : 10, // default: 1
                heightReference: HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
        });
        point.oid = 0;
        point.layerId = _this.layerId;
        point.flag = "anchor";
        _this.entity = point;
        return point;
    }
    _getMeasureTip(cartesian) {
        var pos = this._getLonLat(cartesian);
        if (!pos.height) {
            pos.height = "";
        } else {
            pos.height = pos.height.toFixed(1);
        }
        pos.longitude = pos.longitude.toFixed(9);
        pos.latitude = pos.latitude.toFixed(9);
        var tip = "经度：" + pos.longitude + "，纬度：" + pos.latitude;// + "\n 海拔=" + pos.alt + "米";
        if(this.isShow){
            return tip;
        }else{
            return null;
        }
        
    }
    _clearMarkers(layerName) {
        //console.log(11)
        var viewer = this.viewer;
        var entityList = viewer.entities.values;
        if (entityList == null || entityList.length < 1)
            return;
        for (var i = 0; i < entityList.length; i++) {
            var entity = entityList[i];
            if (entity.layerId == layerName) {
                viewer.entities.remove(entity);
                i--;
            }
        }
    }
    _getLonLat(cartesian) {
        var cartographic = this.ellipsoid.cartesianToCartographic(cartesian);
        cartographic.height = this.viewer.scene.globe.getHeight(cartographic);
        var pos = {
            longitude: cartographic.longitude,
            latitude: cartographic.latitude,
            height: cartographic.height
        };
        pos.longitude = Math.toDegrees(pos.longitude);
        pos.latitude = Math.toDegrees(pos.latitude);
        return pos;
    }
}