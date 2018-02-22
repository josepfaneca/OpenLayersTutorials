import Point =require('ol/geom/point');
import Feature  =require( 'ol/Feature');
export abstract class BaseGeometry{
    public static GetPoint(coordinates:[number,number],type:string){
       return new Feature.default({
            type: type,
            geometry: new Point.default(coordinates)
          });
    }
}