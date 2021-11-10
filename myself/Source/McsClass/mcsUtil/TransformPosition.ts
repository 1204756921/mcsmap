import { default as Math } from '../.././Core/Math.js';
import { default as Cartesian3 } from '../.././Core/Cartesian3.js';
import Vector3 from '../code/Vector3.js';


/**
     * 坐标转换类
     * @param {any} viewer - 视图
     */
export default class TransformPosition{
     viewer:any
     x_PI:number
     PI:number
     a:number
     ee:number
    constructor(viewer){
        this.viewer = viewer;
        this.x_PI = 3.14159265358979324 * 3000.0 / 180.0;
        this.PI = 3.1415926535897932384626;
        this.a = 6378245.0;
        this.ee = 0.00669342162296594323;
    }
    /**
     *  Vector3坐标转经纬度
     * @param {Vector3} poinstion - 坐标
     * @returns {object} pos-  pos.longitude 经度  pos.latitude 纬度  pos.height 高度
     */
    cartesianToLola(poinstion:Vector3){
       var cartographic = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(new Cartesian3(poinstion.x,poinstion.y,poinstion.z));
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
    /**
     * 经纬度坐标转Vector3
     * @param {object} lola - 经纬度对象lola.longitude-经度 lola.latitude-纬度 lola.height-高度
     */
    lolaTocartesian(lola:any){
        let car3d = Cartesian3.fromDegrees(lola.longitude,lola.latitude,lola.height)
        return new Vector3(car3d.x,car3d.y,car3d.z);
    }

    /**
     * WGS84 转换为 GCJ02
     * @param lng 经度
     * @param lat 纬度
     * @returns [lng,lat]
     */
    wgs84togcj02(lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        }
        else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [mglng, mglat]
        }
    }
    
    /**
     * GCJ02 转换为 WGS84
     * @param lng
     * @param lat
     * @returns [lng,lat]
     */
    gcj02towgs84(lng, lat) {
        if (this.out_of_china(lng, lat)) {
            return [lng, lat]
        }
        else {
            var dlat = this.transformlat(lng - 105.0, lat - 35.0);
            var dlng = this.transformlng(lng - 105.0, lat - 35.0);
            var radlat = lat / 180.0 * this.PI;
            var magic = Math.sin(radlat);
            magic = 1 - this.ee * magic * magic;
            var sqrtmagic = Math.sqrt(magic);
            dlat = (dlat * 180.0) / ((this.a * (1 - this.ee)) / (magic * sqrtmagic) * this.PI);
            dlng = (dlng * 180.0) / (this.a / sqrtmagic * Math.cos(radlat) * this.PI);
            var mglat = lat + dlat;
            var mglng = lng + dlng;
            return [lng * 2 - mglng, lat * 2 - mglat]
        }
    }
    
    transformlat(lng, lat) {
        var ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lat * this.PI) + 40.0 * Math.sin(lat / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (160.0 * Math.sin(lat / 12.0 * this.PI) + 320 * Math.sin(lat * this.PI / 30.0)) * 2.0 / 3.0;
        return ret
    }
    
    transformlng(lng, lat) {
        var ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
        ret += (20.0 * Math.sin(6.0 * lng * this.PI) + 20.0 * Math.sin(2.0 * lng * this.PI)) * 2.0 / 3.0;
        ret += (20.0 * Math.sin(lng * this.PI) + 40.0 * Math.sin(lng / 3.0 * this.PI)) * 2.0 / 3.0;
        ret += (150.0 * Math.sin(lng / 12.0 * this.PI) + 300.0 * Math.sin(lng / 30.0 * this.PI)) * 2.0 / 3.0;
        return ret
    }
    
    /**
     * 判断是否在国内，不在国内则不做偏移
     * @param lng 经度
     * @param lat 纬度
     * @returns {boolean}
     */
    out_of_china(lng, lat){
        return (lng < 72.004 || lng > 137.8347) || ((lat < 0.8293 || lat > 55.8271) || false);
    }
}