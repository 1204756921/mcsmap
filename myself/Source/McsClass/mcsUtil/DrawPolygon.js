import { default as ScreenSpaceEventType } from '../../Core/ScreenSpaceEventType.js';
import { default as Math } from '../../Core/Math.js';
import { default as Color } from '../../Core/Color.js';
import { default as HeightReference } from '../../Scene/HeightReference.js';
import { default as LabelStyle } from '../../Scene/LabelStyle.js';
import { default as Cartesian3 } from '../.././Core/Cartesian3.js';
import { default as PolylineDashMaterialProperty } from '../.././DataSources/PolylineDashMaterialProperty.js';
import { default as CallbackProperty } from '../.././DataSources/CallbackProperty.js';
import { default as PolygonHierarchy } from '../.././Core/PolygonHierarchy.js';
import { default as PolygonGraphics } from '../.././DataSources/PolygonGraphics.js';
import calculaArea from './Calculatingarea.js';
import { defaultValue } from '../mcsUtil/defind';
/**
 * @param {any} viewer -视图
 * @param {any} drawType -绘制类型
 * @param {boolean} isShow -是否显示多边形面积 true
 */
export default class DrawPolygon {
    constructor(viewer, drawType, isShow) {
        this.viewer = viewer;
        this.isShow = defaultValue(isShow, true);
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
        this.outlineMaterial = null;
        this.drawType = drawType;
    }
    clear() {
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
     * @param fontColor  显示文字的颜色 默认红色
     * @param fillColor  多边形填充的颜色 默认浅绿色
     * @param outLineColor  多边形轮廓的颜色 默认橙色
     */
    startDraw(callback, fontColor, fillColor, outLineColor) {
        let _this = this;
        if (this.entity != null) {
            this.viewer.entities.remove(this.entity);
        }
        this.entity = null;
        this.positions = [];
        this.fontColor = defaultValue(fontColor, Color.RED);
        this.fillColor = defaultValue(fillColor, Color.AQUAMARINE);
        this.outLineColor = defaultValue(outLineColor, Color.DARKORANGE);
        var floatingPoint = null;
        _this.drawHandler.setInputAction(function (event) {
            var position = event.position;
            if (!position) {
                return;
            }
            if (_this.drawType == 'model') {
                var cartesian = _this.scene.pickPosition(position);
            }
            else {
                var ray = _this.camera.getPickRay(position);
                if (!ray) {
                    return;
                }
                var cartesian = _this.scene.globe.pick(ray, _this.scene);
            }
            //var cartesian = _this.scene.pickPosition(position) // _this.scene.globe.pick(ray, _this.scene);
            if (!cartesian) {
                return;
            }
            var num = _this.positions.length;
            if (num == 0) {
                _this.positions.push(cartesian);
                floatingPoint = _this._createPoint(cartesian, -1);
                _this._showRegion2Map();
            }
            _this.positions.push(cartesian);
            var oid = _this.positions.length - 2;
            _this._createPoint(cartesian, oid);
            if (_this.positions.length > 3) {
                var text = _this._getMeasureTip(_this.positions);
                _this.entity.label.text = text;
            }
            _this.entity.position = cartesian;
            var text = _this._getMeasureTip(_this.positions);
            _this.entity.label.text = text;
        }, ScreenSpaceEventType.LEFT_CLICK);
        _this.drawHandler.setInputAction(function (event) {
            var position = event.endPosition;
            if (!position) {
                return;
            }
            if (_this.positions.length < 1) {
                return;
            }
            if (_this.drawType == 'model') {
                var cartesian = _this.scene.pickPosition(position);
            }
            else {
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
            //floatingPoint.position.setValue(cartesian);
            _this.positions.pop();
            _this.positions.push(cartesian);
            if (_this.positions.length > 2) {
                var text = _this._getMeasureTip(_this.positions);
                _this.entity.label.text = text;
            }
            //_this.entity.position = cartesian;
            var text = _this._getMeasureTip(_this.positions);
            _this.entity.label.text = text;
        }, ScreenSpaceEventType.MOUSE_MOVE);
        _this.drawHandler.setInputAction(function (movement) {
            if (_this.positions.length < 4) {
                return;
            }
            _this.positions.pop();
            _this.viewer.entities.remove(floatingPoint);
            _this.clear();
            var dis3d = _this._computeLineDis3d(_this.positions);
            // var area = _this._computeArea(positions);
            // area = area.toFixed(3);
            var rlt = {
                dis3d: dis3d,
            };
            callback(_this.entity);
        }, ScreenSpaceEventType.RIGHT_CLICK);
    }
    _createPoint(cartesian, oid) {
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
    _showRegion2Map() {
        var _this = this;
        if (_this.material == null) {
            _this.material = _this.fillColor;
        }
        if (_this.outlineMaterial == null) {
            _this.outlineMaterial = new PolylineDashMaterialProperty({
                dashLength: 16,
                color: _this.outLineColor
            });
        }
        var dynamicHierarchy = new CallbackProperty(function () {
            if (_this.positions.length > 2) {
                var pHierarchy = new PolygonHierarchy(_this.positions);
                return pHierarchy;
            }
            else {
                return null;
            }
        }, false);
        var outlineDynamicPositions = new CallbackProperty(function () {
            if (_this.positions.length > 1) {
                var arr = [].concat(_this.positions);
                var first = _this.positions[0];
                arr.push(first);
                return arr;
            }
            else {
                return null;
            }
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
                heightReference: HeightReference.CLAMP_TO_GROUND,
                disableDepthTestDistance: Number.POSITIVE_INFINITY
            },
            polygon: new PolygonGraphics({
                hierarchy: dynamicHierarchy,
                material: _this.material,
                show: true
            }),
            polyline: {
                positions: outlineDynamicPositions,
                clampToGround: true,
                width: 1,
                material: _this.outlineMaterial,
                show: true
            }
        };
        _this.entity = _this.viewer.entities.add(bData);
        _this.entity.layerId = _this.layerId;
    }
    _getMeasureTip(pntList) {
        var _this = this;
        var dis3d = _this._computeLineDis3d(pntList);
        var tip = "周长：" + dis3d.toFixed(3) + "米";
        if (pntList.length > 2) {
            var area = _this._computeArea(pntList);
            //var area = _this._getArea(pntList);
            tip = "\n 面积：" + area + "平方米";
        }
        if (this.isShow) {
            return tip;
        }
        else {
            return null;
        }
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
    _cartesian2LonLat(cartesian) {
        var _this = this;
        //将笛卡尔坐标转换为地理坐标
        var cartographic = _this.ellipsoid.cartesianToCartographic(cartesian);
        //将弧度转为度的十进制度表示
        var pos = {
            longitude: Math.toDegrees(cartographic.longitude),
            latitude: Math.toDegrees(cartographic.latitude),
            height: Math.ceil(cartographic.height)
        };
        return pos;
    }
    _computeArea(positions) {
        var _this = this;
        var arr = [];
        for (var i = 0; i < positions.length; i++) {
            var p = _this._cartesian2LonLat(positions[i]);
            arr.push([p.longitude, p.latitude]);
        }
        arr.push(arr[0]); //终点和起点重合
        let are = calculaArea.getInstane().getArea(arr);
        return are;
    }
    _computeDis3d(p1, p2) {
        var dis = Cartesian3.distance(p1, p2);
        return dis;
    }
    _clearMarkers(layerName) {
        var _this = this;
        var viewer = _this.viewer;
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
