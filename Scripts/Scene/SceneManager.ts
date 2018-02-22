import { IManager } from "../IManager";
import { Singleton } from "vincijs";
import ol_Map = require('ol/map')
import ol_layer_Tile = require('ol/layer/tile');
// import ol_source_OSM = require('ol/source/osm');
import ol_View = require('ol/view');
import ol_proj = require('ol/proj')
import aMapLayer from "./../../Maplayers/AMapLayer"
import TWEEN= require('@tweenjs/tween.js')

export class SceneManager  {//implements IManager
    private Map: ol.Map
    /**
     * {SceneManager}
     * @param {HTMLDivElement}
     */
    constructor(public Element: HTMLDivElement) {
        
    }
    /**
     * AddLayer
     * @param {} layer
     */
    public AddLayer(layer:ol.layer.Layer) {
        this.Map.addLayer(layer);
    }
    public RemoveLayer(layer){
        
    }
    private EnvironmentConfig() {
        this.Map = new ol_Map.default({
            target: this.Element,
            layers: [
                aMapLayer
                //new ol_layer_Tile.default({ source: new ol_source_OSM.default() })
            ],
            view: new ol_View.default({ center: ol_proj.default.transform([118.89565229, 32.19354589], 'EPSG:4326', 'EPSG:3857'), zoom: 15 })
        });
        this.Map.on('postcompose',()=>{
            TWEEN.update();
        });
    }
    public Helper(helper?: Object) {
    }

    public Change(data: Object): void {
        throw new Error("Method not implemented.");
    }
    public Init(data: Object) {
        this.EnvironmentConfig();// this.EnvironmentConfig( ....);
       // this.Render();
    }

    public Focus(point:[number,number]){
       this.Map.getView().setCenter(point);
    }
    public Render() {
        this.Map.render()
    }
}


