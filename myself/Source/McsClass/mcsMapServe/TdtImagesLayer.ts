import ImageLayer from '../mcsBaseMap/ImageLayer'
import { defaultValue } from '../mcsUtil/defind'
import { default as WebMapTileServiceImageryProvider } from '../.././Scene/WebMapTileServiceImageryProvider.js';
import { default as GeographicTilingScheme } from '../.././Core/GeographicTilingScheme.js';
import { default as CesiumTerrainProvider } from '../.././Core/CesiumTerrainProvider.js';

/**
 * 天地图影像
 * @class
 */
export default class TdtImageLayer extends ImageLayer {

    /**
     * @constructor
     * @param {Object} options - 图层选项
     * @param {String} options.id - 图层id 
     * @param {String} options.name - 图层显示名称
     * @param {String} [options.mapType=vec] - 地图类型: vec矢量地图/img影像地图
     * @param {String} options.key - key
     * @param {Boolean} [options.show=true] - 是否显示
     */
    mapType:string;
    key:string;
    _show:boolean;
    vec_w:object;
    cva_w:object;
    img_w:object;
    ter_w:object;
    layer:any;
    map:any;
    list:Map<string,any>;
    constructor(options) {
        super()

        this.id = defaultValue(options.id,null);
        this.mapType = defaultValue(options.mapType, 'vec')
        
        this.name = defaultValue(options.name, `天地图${this.mapType}`)

        this.key = defaultValue(options.key, "");

        this.type = "TdtImageLayer"
       
        this._show = defaultValue(options.show, true);

        /**
         * 矢量底图
         */
        this.vec_w =new WebMapTileServiceImageryProvider({
            url: "http://{s}.tianditu.gov.cn/vec_c/wmts?service=wmts&request=GetTile&version=1.0.0" +
            "&LAYER=vec&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}" +
            "&style=default&format=tiles&tk="+this.key,
            layer: "tdtCva",
            style: "default",
            format: "tiles",
            tileMatrixSetID: "c",
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme: new GeographicTilingScheme(),
            tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
            maximumLevel: 17
         })
        
            /**
             * 标记
             */
        this.cva_w =new WebMapTileServiceImageryProvider({
            url: "http://{s}.tianditu.gov.cn/cia_c/wmts?service=wmts&request=GetTile&version=1.0.0&LAYER=cia&tileMatrixSet=c&TileMatrix={TileMatrix}&TileRow={TileRow}&TileCol={TileCol}&style=default&format=tiles&tk="+this.key,
            layer: "tdtCva",
            style: "default",
            format: "tiles",
            tileMatrixSetID: "c",
            subdomains: ["t0", "t1", "t2", "t3", "t4", "t5", "t6", "t7"],
            tilingScheme: new GeographicTilingScheme(),
            tileMatrixLabels: ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19"],
            maximumLevel: 17
        })
        
        
            /**
             * 影像底图
             */
        this.img_w = new WebMapTileServiceImageryProvider({
            url: 'http://t0.tianditu.gov.cn/img_w/wmts?tk='+this.key,
            layer: 'img',
            style: 'default',
            tileMatrixSetID: 'w',
            format: 'tiles',
            maximumLevel: 17
        });
        
            /**
             * 地形底图
             */
        this.ter_w = new CesiumTerrainProvider({
            url: `http://t3.tianditu.com/DataServer?T=ter_w&tk=${this.key}&x={x}&y={y}&l={z}`
  
        })
        this.list.set('vec',this.vec_w);
        this.list.set('cav',this.cva_w);
        this.list.set('img',this.img_w);
        this.list.set('ter',this.ter_w);
        
    }
    set show(val:boolean){
        this._show = val;
        this.layer.show = val;
    }
    get show():boolean{
        return this._show;
    }
    /**
     * 添加地图到视图
     * @param map 视图
     */
    addTo(map) {
        this.map = map;
        this.layer = this.map.imageryLayers.addImageryProvider(this.list.get(this.mapType));
        this.layer.show = this._show;
    }
    /**
     * 移除地图
     */
    remove() {
       if(this.map){
            this.map.imageryLayers.remove(this.layer);
       }
    }
}