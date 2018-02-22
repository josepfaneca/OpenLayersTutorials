import { Tracker } from './Scripts/Scene/Tracker';
import { SceneManager } from "./Scripts/Scene/SceneManager";
import { ComponentsManager } from './Scripts/Component/ComponentManager';
import { GraphicOutInfo } from './Scripts/Component/Graphic';
import { XBBusiness } from './Scripts/Business/XBBusiness';
import { Ajax, VinciLoading, LogHelper } from 'vincijs'
import VectorLayer = require('ol/layer/Vector')
import VectorSource = require('ol/source/Vector')
// VinciLoading(document.body, true);
export enum WSType {
    //None = 0,
    Location = 1,
    History = 10,
}
export interface RequestMsgObject {
    Type?: WSType
    Region?: string
    /**
     * svr default 3000
     */
    HistoryDuration?: number
    STime?: Date | string
    ETime?: Date | string
    UIds?: Array<string>
}
export class MapBase {
    protected ComponentsManager: ComponentsManager;
    protected LocationFinished: boolean = false;
    protected SceneManager: SceneManager
    protected MapWorker: Worker
    protected Mouse: { x: number, y: number } = { x: 0, y: 0 }
    protected Business: XBBusiness
    protected InitWSParameters: RequestMsgObject = {}
    protected TrackOfComponent: boolean = false
    protected PathLayer: ol.layer.Vector
    constructor() {
        this.InitScene();
        this.InitDecorate();
        this.InitComponent();
        this.InitBusiness();

        //trigger init of usersettings

        //lastest
        this.ComponentMProcess();
    }
    /**
     * InitScene
     */
    protected InitScene() {
      this.SceneManager=new SceneManager(document.getElementById('map') as HTMLDivElement)
      this.SceneManager.Init(undefined);
    }

    /**
     * 不会更改类型
     * @param obj 
     */
    protected SendMsg(obj: RequestMsgObject) {
        if (obj)
            this.ComponentsManager.SendMsg(obj);
    }
    protected InitWSType() {
        this.SendMsg(this.InitWSParameters);
    }
    protected ComponentMProcess() {
        this.ComponentsManager.DataProcess((gif, type) => {
            if (type == "new") {
                let info = this.Business.GetInfo(gif.Id, gif.type);
                if (!info) gif.Title = "***";
                else gif.Title = info.Title;
                if (this.TrackOfComponent) {
                    gif.Path = new Tracker(5, [gif.Location.x, gif.Location.y]);
                    this.AddPath(gif.Path);
                }
            }
            else if (type == "move") {
                if (this.TrackOfComponent) {
                    gif.Path.AddPoint([gif.Location.x, gif.Location.y]);
                }
            }
            this.Business.Update(type, gif);
        });
    }
    protected AddPath(path: Tracker) {
        if (this.PathLayer) this.PathLayer.getSource().addFeature(path.GetFeature())
        else {
            this.PathLayer = new VectorLayer.default({
                source: new VectorSource.default({
                    features: [path.GetFeature()]
                })
            })
            this.PathLayer.setZIndex(49);
            this.SceneManager.AddLayer(this.PathLayer)
        }
    }
    /**
     * InitComponent
     */
    protected InitComponent(autoReconnectInterval?: number, duration?: number, durTimes?: number) {
        this.ComponentsManager = new ComponentsManager(autoReconnectInterval, duration, durTimes)
        this.ComponentsManager.Bind(this.ComponentsManager.Events.WSOpened, this.InitWSType.bind(this));
        this.SceneManager.AddLayer(this.ComponentsManager.GetLayer())
    }
    protected InitBusiness() {
        this.Business = new XBBusiness(this.ComponentsManager, this.SceneManager);
    }
    private onDocumentMouseMove(event) {
        event.preventDefault();
        this.Mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.Mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

    }
    private ShowComponentInfo() {
        // this.Raycaster.setFromCamera(this.Mouse, this.SceneManager.camera);
        // let coms = this.ComponentsManager.Coms;
        // let gcoms = Object.getOwnPropertyNames(coms).map(n => (coms[n] as GraphicOutInfo).ThreeObject3D)
        // let intersects = this.Raycaster.intersectObjects(gcoms, true);
        // if (intersects.length > 0) {
        //     let currenIntersect = intersects[0];
        //     let id = currenIntersect.object["UniqueId"]
        //     window.open("/TM/AssetInfo?uniqueId=" + id, 'newwindow', 'height=572, width=1016, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
        // }
    }
    protected InitConnection() {

    }
    /**
     * InitDecorate
     */
    protected InitDecorate() {
        // this.DatGUI = new dat.GUI();
        // this.DatGUI.domElement.parentElement.style.zIndex = "999999"
    }
}

