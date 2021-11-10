import ImageLayer from "../mcsBaseMap/ImageLayer";
import { defaultValue } from '../mcsUtil/defind'
import { default as WebMapServiceImageryProvider } from '../../Scene/WebMapServiceImageryProvider.js';
import mcsViewer from '../mcsViewer/McsViewer'

export default class WmsImageLayer extends ImageLayer{
    /**
     * @constructor
     * @param {Object} options - 图层选项
     * @param {String} options.id - 图层id 
     * @param {String} options.name - 图层显示名称
     * @param {String} options.url - 地图地址
     * @param {String} options.layers - 图层名/图层编号
     * @param {Boolean} [options.show=true] - 是否显示
     * @param {object} options.parameters- 参数
     * @param {Boolean} options.parameters.transparent - 是否透明
     * @param {string} options.parameters.format - 图片格式
     */
     id:string;
     name:string;
     _show:boolean;
     url:string;
     layer:any;
     layers:string;
     parameters:object;
     map:any
    constructor(options){
        super();
        this.id = defaultValue(options.id, null);
        this.name =  defaultValue(options.name, 'wmsMap');
        this.show =  defaultValue(options.show, true);
        this.url = options.url;
        this.layers = options.layers;
        this.parameters = options.parameters;
        this.type = "WmsImageLayer"
        
    }

    set show(val:boolean){
      this._show = val;
      this.layer.show = val;
    }
    get show():boolean{
       return this._show;
    }
  addTo(map){
    this.map = map;
    this.layer = this.map.imageryLayers.addImageryProvider(
      new WebMapServiceImageryProvider({   
        url:this.url,
        layers:this.layers,
        parameters : this.parameters,
      })
    );
  }
  remove(){
     if(this.map){
         this.map.imageryLayers.remove(this.layer);
     }
  }
}