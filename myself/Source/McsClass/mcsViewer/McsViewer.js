import { default as Viewer } from '../../Widgets/Viewer/Viewer.js';
import { default as SceneMode } from '../.././Scene/SceneMode.js';
import { default as Math } from '../.././Core/Math.js';
import { default as ScreenSpaceEventHandler } from '../.././Core/ScreenSpaceEventHandler.js';
import { default as Cartesian3 } from '../.././Core/Cartesian3.js';
import { default as Clock } from '../.././Core/Clock.js';
import { default as Rectangle } from '../.././Core/Rectangle.js';
import { defaultValue } from '../mcsUtil/defind';
/**
 * @param {string} id 地图容器div 的id
 * @param {object} options 设置地图的属性
 */
export default class McsViewer {
    constructor(id, options) {
        this.obj = {
            animation: false,
            baseLayerPicker: false,
            fullscreenButton: false,
            geocoder: false,
            homeButton: false,
            infoBox: false,
            sceneModePicker: false,
            selectionIndicator: false,
            timeline: true,
            navigationHelpButton: false,
            clock: new Clock(),
            scene3DOnly: true,
            selectedImageryProviderViewModel: undefined,
            selectedTerrainProviderViewModel: undefined,
            fullscreenElement: document.body,
            useDefaultRenderLoop: true,
            targetFrameRate: undefined,
            showRenderLoopErrors: false,
            automaticallyTrackDataSourceClocks: true,
            contextOptions: undefined,
            sceneMode: SceneMode.SCENE3D,
        };
        this.Viewer = new Viewer(id, this.obj);
        this.scene = this.Viewer.scene;
        this.camera = this.Viewer.camera;
        this.drawHandler = new ScreenSpaceEventHandler(this.Viewer.canvas);
        this.mapLayer = new Map();
        if(options){
            this._init(options);
        }
        
    }
    _init(options) {
        var obj = {
            defaultResetView: Rectangle.fromDegrees(80, 22, 120, 10),
            enableCompass: defaultValue(options.enableCompass, true),
            enableZoomControls: false,
            enableDistanceLegend: defaultValue(options.enableDistanceLegend, true),
            enableCompassOuterRing: true,
        };
        //CesiumNavigation(this.Viewer, obj);
        for (let key in options) {
            if (key != 'enableCompass' && key != 'enableDistanceLegend') {
                this.scene.screenSpaceCameraController[key] = options[key];
            }
        }
    }
    /**
     *
     * @param options 属性对象
     */
    setOptions(options) {
        for (let key in options) {
            if (key != 'enableCompass' && key != 'enableDistanceLegend') {
                this.scene.screenSpaceCameraController[key] = options[key];
            }
        }
    }
    /**
     * 切换二三维模式
     * @param modelNum - 模式代码：2D/3D
     */
    changeMode(modelNum) {
        if (modelNum == '2D') {
            this.Viewer.sceneMode = SceneMode.SCENE2D;
        }
        else if (modelNum == '3D') {
            this.Viewer.sceneMode = SceneMode.SCENE3D;
        }
    }
    /**
     * 添加图层到图层集合
     * @param {BaseLayer} layer
     */
    addLayer(layer) {
        layer.addTo(this.Viewer);
        this.mapLayer.set(layer.id, layer);
    }
    /**
    * 从图层集合中移除图层
    * @param {BaseLayer} layer
    */
    removeLayer(layer) {
        layer.remove(this.Viewer);
    }
    /**
     * 设置地形
     * @param terrain 地形对象
     */
    setTerrain(terrain) {
        this.Viewer.terrainProvider = terrain;
    }
    /**
     * 添加实体到视图
     * @param entity 实体对象
     * @returns 返回添加的实体本身
     */
    addEntiey(entity) {
        return entity.addTo(this.Viewer);
    }
    /**
     * 移除实体
     * @param entity 视图对象
     */
    removeEntity(entity) {
        entity.remove();
    }
    /**
     * 飞到数据
     * @param target 数据{Overlay/TilesetLayer/GeojsonLayer}
     */
    flyToTarget(target) {
        target.flyTo(this.Viewer);
    }
    /**
     * 定位到坐标点
     * @param point 坐标点
     * @param rotate 水平旋转角度
     * @param angleDown 俯视角度
     */
    pointToTarget(point, rotate, angleDown) {
        this.Viewer.camera.setView({
            destination: new Cartesian3(point.x, point.x, point.z),
            orientation: {
                heading: Math.toRadians(rotate),
                pitch: Math.toRadians(angleDown),
                roll: 0.0
            }
        });
    }
    /**
     * 监听选中选中地图中的模型 点击时调用回调函数
     * @param callBack 回调函数 参数为选中的模型
     */
    bindCheckModel(callBack) {
        this.drawHandler.setInputAction(movement => {
            var pickedFeature = this.scene.pick(movement.position);
            callBack(pickedFeature);
        });
    }
    /**
     * 监听选中地图中的实体的事件 点击时调用回调函数
     * @param callBack  回调函数 参数为选中的实体(如果没有选中则不会回调)
     */
    bindCheckEnity(callBack) {
        this.drawHandler.setInputAction(movement => {
            var pickedFeature = this.scene.pick(movement.position);
            if (pickedFeature.id.position) {
                callBack(pickedFeature.id);
            }
        });
    }
}
