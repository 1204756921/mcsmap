
import {default as Viewer}  from '../../Widgets/Viewer/Viewer.js'
import {default as SceneMode} from '../.././Scene/SceneMode.js'
import { default as Math } from '../.././Core/Math.js';
import BaseLayer from '../mcsBaseMap/BaseLayer.js';
import { default as ScreenSpaceEventHandler } from '../.././Core/ScreenSpaceEventHandler.js';
import { default as Cartesian3 } from '../.././Core/Cartesian3.js';
import Vector3 from '../code/Vector3.js';
import { default as Clock } from '../.././Core/Clock.js';
import Overlay from '../mcsBaseMap/Overlay.js';
import { default as Rectangle } from '../.././Core/Rectangle.js';
import {  defaultValue } from '../mcsUtil/defind';

/**
 * @param {string} id 地图容器div 的id
 * @param {object} options 设置地图的属性
 */
export default class McsViewer{
    Viewer:any;
    scene:any;
    camera:any;
    drawHandler:any
    obj:object
    mapLayer:Map<string,BaseLayer>
    constructor(id:string,options:object){
        this.obj = {
            animation : false,//是否创建动画小器件，左下角仪表
            baseLayerPicker : false,//是否显示图层选择器
            fullscreenButton : false,//是否显示全屏按钮
            geocoder : false,//是否显示geocoder小器件，右上角查询按钮
            homeButton : false,//是否显示Home按钮
            infoBox : false,//是否显示信息框
            sceneModePicker : false,//是否显示3D/2D选择器
            selectionIndicator : false,//是否显示选取指示器组件
            timeline : true,//是否显示时间轴
            navigationHelpButton : false,//是否显示右上角的帮助按钮
            clock : new Clock(),//用于控制当前时间的时钟对象
            scene3DOnly : true,//如果设置为true，则所有几何图形以3D模式绘制以节约GPU资源
            selectedImageryProviderViewModel : undefined,//当前图像图层的显示模型，仅baseLayerPicker设为true有意义
            selectedTerrainProviderViewModel : undefined,//当前地形图层的显示模型，仅baseLayerPicker设为true有意义
            fullscreenElement : document.body,//全屏时渲染的HTML元素,
            useDefaultRenderLoop : true,//如果需要控制渲染循环，则设为true
            targetFrameRate : undefined,//使用默认render loop时的帧率
            showRenderLoopErrors : false,//如果设为true，将在一个HTML面板中显示错误信息
            automaticallyTrackDataSourceClocks : true,//自动追踪最近添加的数据源的时钟设置
            contextOptions : undefined,//传递给Scene对象的上下文参数（scene.options）
            sceneMode : SceneMode.SCENE3D,//初始场景模式
        }
        
        this.Viewer = new Viewer(id,this.obj);
        this.scene = this.Viewer.scene;
        this.camera = this.Viewer.camera;
        this.drawHandler = new ScreenSpaceEventHandler(this.Viewer.canvas);
        this.mapLayer = new Map();
        if(options){
            this._init(options);
        }
       
    }
    _init(options:any){
        var obj = {
            defaultResetView:Rectangle.fromDegrees(80, 22, 120, 10),
            enableCompass:defaultValue(options.enableCompass,true),
            enableZoomControls:false,
            enableDistanceLegend:defaultValue(options.enableDistanceLegend,true),
            enableCompassOuterRing:true,
        };
        //CesiumNavigation(this.Viewer, obj);
       for (let key in options) {
           if(key != 'enableCompass' && key != 'enableDistanceLegend'){
                this.scene.screenSpaceCameraController[key] = options[key];
           }
            
        }
    }
    /**
     * 
     * @param options 属性对象
     */
    setOptions(options:Object){
        for (let key in options) {
            if(key != 'enableCompass' && key != 'enableDistanceLegend'){
                this.scene.screenSpaceCameraController[key] = options[key];
           }
        }
    }
    /**
     * 切换二三维模式
     * @param modelNum - 模式代码：2D/3D
     */
    changeMode(modelNum:string){
        if(modelNum == '2D'){
            this.Viewer.sceneMode = SceneMode.SCENE2D;
        }else if(modelNum =='3D'){
            this.Viewer.sceneMode = SceneMode.SCENE3D;
        }
    }

    /**
     * 添加图层到图层集合
     * @param {BaseLayer} layer 
     */
    addLayer(layer:BaseLayer){
       layer.addTo(this.Viewer)
       this.mapLayer.set(layer.id,layer);
    }
     /**
     * 从图层集合中移除图层
     * @param {BaseLayer} layer 
     */
    removeLayer(layer){
        layer.remove(this.Viewer)
    }
    /**
     * 设置地形
     * @param terrain 地形对象
     */
    setTerrain(terrain:object){
        this.Viewer.terrainProvider = terrain;
    }
    /**
     * 添加实体到视图
     * @param entity 实体对象
     * @returns 返回添加的实体本身
     */
    addEntiey(entity:Overlay){
      return  entity.addTo(this.Viewer);
    }
    /**
     * 移除实体
     * @param entity 视图对象
     */
    removeEntity(entity:Overlay){
        entity.remove();
    }
    /**
     * 飞到数据
     * @param target 数据{Overlay/TilesetLayer/GeojsonLayer}
     */
    flyToTarget(target:any){
        target.flyTo(this.Viewer);
    }
    /**
     * 定位到坐标点
     * @param point 坐标点
     * @param rotate 水平旋转角度
     * @param angleDown 俯视角度
     */
    pointToTarget(point:Vector3,rotate:number,angleDown:number){
        this.Viewer.camera.setView({
            destination : new Cartesian3(point.x,point.x,point.z),
            orientation : {
                heading : Math.toRadians(rotate),
                pitch : Math.toRadians(angleDown),
                roll : 0.0
            }
         })
    }
    /**
     * 监听选中选中地图中的模型 点击时调用回调函数
     * @param callBack 回调函数 参数为选中的模型
     */
    bindCheckModel(callBack){
        this.drawHandler.setInputAction(movement => {
            var pickedFeature = this.scene.pick(movement.position);
            callBack(pickedFeature);
        })
    }
    /**
     * 监听选中地图中的实体的事件 点击时调用回调函数
     * @param callBack  回调函数 参数为选中的实体(如果没有选中则不会回调)
     */
    bindCheckEnity(callBack){
        this.drawHandler.setInputAction(movement => {
            var pickedFeature = this.scene.pick(movement.position);
            if(pickedFeature.id.position){
                callBack(pickedFeature.id);
            }
        })
    }
}