import { default as EllipsoidGeodesic } from '../.././Core/EllipsoidGeodesic.js';

/**
 * 坐标计算
 */
export default class Calculatingarea{
    static instance:Calculatingarea
    static getInstane(){
        if(!this.instance){
            this.instance = new Calculatingarea()
        }
        return this.instance;
    }
    
    /**
     * @getArea 根据顶点集合计算多边形的面积
     * @param  points - 经纬度坐标数组{longitude：经度, latitude:纬度,height:高度}
     * 
     */
    getArea(points) {
        var res = 0;
        //拆分三角曲面
        for (var i = 0; i < points.length - 2; i++) {
            var j = (i + 1) % points.length;
            var k = (i + 2) % points.length;
            var totalAngle = this._getAngle(points[i], points[j], points[k]);
 
            var dis_temp1 = this.distance(points[i], points[j]);
            var dis_temp2 = this.distance(points[j], points[k]);
            res += dis_temp1 * dis_temp2 * Math.abs(Math.sin(totalAngle)) ;
            
        }
        
        return (res).toFixed(3);
    }
 
    /*角度*/
    _getAngle(p1, p2, p3) {
        var bearing21 = this._getBearing(p2, p1);
        var bearing23 = this._getBearing(p2, p3);
        var angle = bearing21 - bearing23;
        if (angle < 0) {
            angle += 360;
        }
        return angle;
    }
    /*方向*/
     _getBearing(from, to) {
        var radiansPerDegree = Math.PI / 180.0;//角度转化为弧度(rad) 
        var degreesPerRadian = 180.0 / Math.PI;
        var lat1 = from.latitude * radiansPerDegree;
        var lon1 = from.longitude * radiansPerDegree;
        var lat2 = to.latitude * radiansPerDegree;
        var lon2 = to.longitude * radiansPerDegree;
        var angle = -Math.atan2(Math.sin(lon1 - lon2) * Math.cos(lat2), Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2));
        if (angle < 0) {
            angle += Math.PI * 2.0;
        }
        angle = angle * degreesPerRadian;//角度
        return angle;

    }
    distance(point1,point2){
		//var point1cartographic = Cesium.Cartographic.fromCartesian(point1);
        //var point2cartographic = Cesium.Cartographic.fromCartesian(point2);
        /**根据经纬度计算出距离**/
        var geodesic = new EllipsoidGeodesic();
		geodesic.setEndPoints(point1, point2);
        var s = geodesic._distance;
		//console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
        //返回两点之间的距离    
		s = Math.sqrt(Math.pow(s, 2) + Math.pow(point2.height - point1.height, 2));	
		return s;
    }
}