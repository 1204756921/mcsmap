
import { default as ScreenSpaceEventHandler } from '../../Core/ScreenSpaceEventHandler.js';
import { default as ScreenSpaceEventType } from '../../Core/ScreenSpaceEventType.js';
import { default as Math } from '../../Core/Math.js';
import { default as Color } from '../../Core/Color.js'
import { default as HeightReference } from '../../Scene/HeightReference.js';
import { default as LabelStyle } from '../../Scene/LabelStyle.js';
import { default as Cartesian3 } from '../.././Core/Cartesian3.js';
import { default as PolylineDashMaterialProperty } from '../.././DataSources/PolylineDashMaterialProperty.js';
import { default as CallbackProperty } from '../.././DataSources/CallbackProperty.js';
import { defaultValue } from '../mcsUtil/defind';

/**
 * 绘制折线
 * @param viewer - 视图
 * @param isShow - 是否显示长度 默认true
 */
export default class DrawLine{
    viewer:any
    isShow:boolean   
    scene:any
    canvas:any
    camera:any
    ellipsoid:any
    entity:any
    positions:any
    drawHandler:any
    layerId:any
    markers:object
    material:any
    drawType:any
    fontColor:Color
    lineColor:Color
    constructor(viewer,drawType,isShow){
        this.viewer = viewer;
        this.isShow = defaultValue(isShow,true);
        this.scene = this.viewer.scene;
        this.canvas = this.viewer.scene.canvas;
        this.camera = this.viewer.scene.camera;
        this.ellipsoid = this.viewer.scene.globe.ellipsoid;
        this.entity = null;
        this.positions = null;
        this.drawHandler = null;
        this.layerId = 'drawLine';
        this.markers = {};
        this.material = null;
        this.drawType = drawType;
    }
    clear(){
        if (this.drawHandler) {
            this.drawHandler.destroy();
            this.drawHandler = null;
        }
        // this.entity = null;
        // this._clearMarkers(this.layerId);
    }
    /**
     * 开始绘制
     * 鼠标左键绘制，右键结束
     * @param callback 绘制完成后的回调方法  参数为绘制的实体对象
     * @param fontColor 显示文字的颜色 默认为红色
     * @param lineColor 画线的颜色 默认为蓝色
     */
    startDraw(callback,fontColor:Color,lineColor:Color){
        let _this = this;
        this.fontColor =defaultValue(fontColor,Color.RED);
        this.lineColor = defaultValue(lineColor,Color.fromCssColorString('#0d8fe5'))
        this.positions = [];
        if(this.entity != null){
            this.viewer.entities.remove(this.entity);
        }
        this.entity = null;
        var floatingPoint = null;
        _this.drawHandler.setInputAction(function(event) {
            
            var position = event.position;
            if (!position) {
                return;
            }
            if(_this.drawType == 'model'){
                var cartesian = _this.scene.pickPosition(position)
            }else{
                
                var ray = _this.camera.getPickRay(position);
                if (!ray) {
                    return;
                }
                var cartesian = _this.scene.globe.pick(ray, _this.scene);
            }
            //var cartesian = _this.scene.pickPosition(position); // _this.scene.globe.pick(ray, _this.scene);
            if (!cartesian) {
                cartesian = _this.positions[_this.positions.length-1];
            }
            
            var num = _this.positions.length;
            if (num == 0) {
                _this.positions.push(cartesian);
                floatingPoint = _this._createPoint(cartesian, -1);
                _this._showPolyline2Map();
            }
            _this.positions.push(cartesian);
            var oid = _this.positions.length - 2;
            _this._createPoint(cartesian, oid);

            _this.entity.position = cartesian;
            var text = _this._getMeasureTip(_this.positions);
            _this.entity.label.text = text;

        }, ScreenSpaceEventType.LEFT_CLICK);

        _this.drawHandler.setInputAction(function(event) {
            var position = event.endPosition;
            if (!position) {
                return;
            } 
            if (_this.positions.length < 1) {
                return;
            }
            if(_this.drawType == 'model'){
                var cartesian = _this.scene.pickPosition(position)
            }else{
                
                var ray = _this.camera.getPickRay(position);
                if (!ray) {
                    return;
                }
                var cartesian = _this.scene.globe.pick(ray, _this.scene);
            }
            //var cartesian = _this.scene.pickPosition(position) //_this.scene.globe.pick(ray, _this.scene);
            if (!cartesian) {
                return;
            }
            floatingPoint.position.setValue(cartesian);
            _this.positions.pop();
            _this.positions.push(cartesian);

            _this.entity.position.setValue(cartesian);
            var text = _this._getMeasureTip(_this.positions);
            _this.entity.label.text = text;
        }, ScreenSpaceEventType.MOUSE_MOVE);

        _this.drawHandler.setInputAction(function(movement) {
            // if (_this.positions.length < 3) {
            //     return;
            // }
            _this.positions.pop();
            _this.viewer.entities.remove(floatingPoint);

            //进入编辑状态
            _this.clear();
            //_this._showModifyPolyline2Map();

            if (callback) {
                callback(_this.entity);
            }
        }, ScreenSpaceEventType.RIGHT_CLICK);
    }
    _createPoint(cartesian, oid){
        var _this = this;
        var point = this.viewer.entities.add({
            position: cartesian,
            
        });
        point.oid = oid;
        point.sid = cartesian.sid; //记录原始序号
        point.layerId = _this.layerId;
        point.flag = "anchor";
        _this.markers[oid] = point;
        return point;
    }
    _showPolyline2Map() {
        var _this = this;
        if (_this.material == null) {
            _this.material = new PolylineDashMaterialProperty({
                color:_this.lineColor
            });
        }
        var dynamicPositions = new CallbackProperty(function() {
            return _this.positions;
        }, false);
        var num = _this.positions.length;
        var last = _this.positions[num - 1];
        var bData = {
            position: last,
            label: {
                text: "",
                font: '16px "微软雅黑", Arial, Helvetica, sans-serif, Helvetica',
                fillColor: _this.fontColor,
                style: LabelStyle.FILL_AND_OUTLINE,
                heightReference: HeightReference.NONE,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            polyline: {
                positions: dynamicPositions,
                clampToGround: true,
                width: 3,
                material: _this.material
            }
        };
        _this.entity = _this.viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
    }
    _getMeasureTip(pntList) {
        var _this = this;
        var dis3d = _this._computeLineDis3d(pntList);
        var tip = "距离：" + dis3d.toFixed(3) +"米";
        
        if(this.isShow){
            return tip;
        }else{
            return null;
        }
        
    }
    _computeDis3d(p1, p2){
        var dis = Cartesian3.distance(p1, p2);
        return dis;
    }
    _computeLineDis3d(pntList) {
        var _this = this;
        var total = 0;
        for (var i = 1; i < pntList.length; i++) {
            var p1 = pntList[i - 1];
            var p2 = pntList[i];
            var dis = _this._computeDis3d(p1, p2);
            total += dis;
        }
        return total;
    }
    _clearMarkers(layerName) {
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

}