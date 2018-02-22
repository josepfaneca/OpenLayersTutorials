import { SceneManager } from './SceneManager';
import Feature = require('ol/Feature')
import LineString = require('ol/geom/LineString')

export class Tracker {
    protected OldPoint: { x: number, y: number, z: number }
    protected Feature:ol.Feature
    constructor(protected thickness: number = 3, startPoint: [number, number]) {
   this.Feature= new Feature.default(new LineString.default([startPoint]))
       
    }
    /**
     * GetLayer
     */
    public GetFeature(): ol.Feature {
        return this.Feature;
    }
    public AddPoint(point:[number,number]): Tracker {
       (this.Feature.getGeometry() as ol.geom.LineString).appendCoordinate(point);
        return this;
    }
}