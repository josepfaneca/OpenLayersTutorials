import { IncarGraphic } from './IncarGraphic';
import { GPSTagGraphic } from './GPSTagGraphic';
import { CellPhoneGraphic } from './CellPhoneGraphic';
import { GraphicOutInfo, GetGraphicFactory } from "./Graphic";
import { GetConfigManager, IObseverable, ObserverableWMediator, LogHelper } from 'vincijs';
import TWEEN = require('@tweenjs/tween.js')
import VertorSource = require('ol/source/Vector')
import VertorLayer = require('ol/layer/Vector')
import ol_proj = require('ol/proj')
// import ol_style = require('ol/style/Style')
// import ol_stroke = require('ol/style/Stroke')
import coordtransform = require('coordtransform')

GetGraphicFactory().SetComponent(CellPhoneGraphic);
GetGraphicFactory().SetComponent(GPSTagGraphic);
GetGraphicFactory().SetComponent(IncarGraphic);

/**
 * manager dependent on TWEEN
 */
export class ComponentsManager extends ObserverableWMediator {
    private socket: WebSocket;
    private TIMEOUT: number = 600000 //10 minutes
    public Coms = {}; //{"{Id}":GraphicOutInfo}
    private LastTweens: Object = {}; //{"{Id}":TWEEN.Tween}
    private VectorSource: ol.source.Vector
    private Layer: ol.layer.Vector
    public Events = { WSOpened: "WSOpened", WSClosed: "WSClosed", TweenStart: "TweenStart" }
    private HighlightedId: string
    constructor(private autoReconnectInterval: number = 5000, private duration: number = 5000, public durTimes: number = 1) {
        super();
        this.VectorSource = new VertorSource.default();
        this.Layer = new VertorLayer.default({
            source: this.VectorSource, style: (feature) => {
                let f = (feature as ol.Feature)
                //LogHelper.Log(this.HighlightedId+":"+f.getId()+":"+(this.HighlightedId==f.getId()));
                let s=GetGraphicFactory().GetComponent(f.get("type")).GetStyle(undefined, f.get('name'));
                if(this.HighlightedId&&this.HighlightedId==f.getId()){
                    let c=s.getImage() as ol.style.Circle
                    c.getStroke().setColor('yellow');
                    s.setZIndex(99);
                    s.getText().getStroke().setColor('red');
                }
                return s;
            }
        });
        this.Layer.setZIndex(50);
    }
    public GetLayer(): ol.layer.Vector {
        return this.Layer;
    }
    private ClearTimeOutComs() {
        // let now = new Date();
        // for (let n in this.Coms) {
        //     let obj = this.Coms[n] as GraphicOutInfo
        //     if ((now.getTime() - obj.ReveiveTime.getTime()) > this.TIMEOUT) { //因为小车也有时间 所以也会清除
        //         if (obj.Title3D) GetScene().remove(obj.Title3D)
        //         GetScene().remove(obj.ThreeObject3D)
        //         delete this.Coms[n];
        //     }
        // }
    }
    /**
     * 获取GraphicOutInfo
     * @param Id
     */
    public Obtain(Id: string): GraphicOutInfo {
        return this.Coms[Id];
    }
    public GetPosition(Id: string): [number, number] {
        return (this.Layer.getSource().getFeatureById(Id).getGeometry() as ol.geom.Point).getCoordinates();
    }

    public Find(fn: (obj: GraphicOutInfo) => boolean): Array<GraphicOutInfo> {
        let res: Array<GraphicOutInfo> = []
        for (let n in this.Coms) {
            let obj = this.Coms[n] as GraphicOutInfo
            if (fn(obj)) res.push(obj)
        }
        return res;
    }

    public Update() {
        TWEEN.update();
    }

    /**
     * 
     * @param id    
     * @param location
     * @param duration
     */
    ComponentMove(id: string, loc: { x: number; y: number; }, duration: number): ComponentsManager { //TODO 若chain堆积太多 则必须对象位置需跳过前面tweens
        let that = this, graphic: GraphicOutInfo
        //TODO 判断位置如果相同不进行任何操作;
        if (graphic = this.Coms[id]) {
            if (!graphic.PArray) graphic.PArray = [];
            graphic.PArray.push({ x: loc.x, y: loc.y, dur: duration, time: graphic.Time as string });
            if (!that.LastTweens[graphic.Id]) {
                // LogHelper.Log("tween launch")
                that.LastTweens[graphic.Id] = this.Tween(graphic.Location, graphic).start();
            }
        }
        else
            console.log("err: id:" + id + " 在Coms中不存在");
        return this;
    }
    private Tween(currentLoc: { x: number, y: number }, graphic: GraphicOutInfo, preTween?: TWEEN.Tween): TWEEN.Tween {
        let that = this, f = graphic.PArray.shift();
        if (!f) return;
        let duration = f.dur, loc = { x: f.x, y: f.y };
        duration = (duration > this.duration * 2 || duration < 1000) ? this.duration : duration;
        if (this.durTimes != 1) duration /= this.durTimes;
        let tween = new TWEEN.Tween(currentLoc).to(loc, duration).easing(TWEEN.Easing.Linear.None).onUpdate((obj: { x: number, y: number }) => {
            let feature = this.VectorSource.getFeatureById(graphic.Id);
            (feature.getGeometry() as ol.geom.Point).setCoordinates([obj.x, obj.y])
        }).onComplete((obj: { x: number, y: number }) => {
            // LogHelper.Log("complete")
            let i: TWEEN.Tween
            if (that.LastTweens[graphic.Id] = i = that.Tween(loc, graphic))
                i.start();
        }).onStart(() => {
            this.SetState(this.Events.TweenStart, f)
            // LogHelper.Log("start")
            //TODO 开始前调整方向 计算单位向量
        });
        if (preTween)
            preTween.chain(tween);
        return tween;
    }
    public Stop() {
        TWEEN.getAll().forEach(t => t.stop());
    }
    public Resume() {
        TWEEN.getAll().forEach(t => t.start());
    }
    private TweenClear() {
        TWEEN.removeAll();
    }
    /**
     * 将被移出
     * @param date 
     */
    public JumpTo(date: Date) {
        this.TweenClear();
        for (let n in this.Coms) {
            let item = this.Coms[n] as GraphicOutInfo
            item.PArray = [];
            item.AllPs.forEach(p => {
                if (new Date(p.time) >= date)
                    item.PArray.push(p);
            })
            let loc = item.PArray.shift();
            if (loc) {
                let feature = this.VectorSource.getFeatureById(item.Id);
                (feature.getGeometry() as ol.geom.Point).setCoordinates([loc.x, loc.y])
                loc = item.PArray.shift();
                if (loc)
                    this.Tween({ x: loc.x, y: loc.y }, item).start();
            }
        }
    }
    /**
     *  更新所有位置信息
     * @param time
     */
    UPdateLocation(time): ComponentsManager {
        TWEEN.update(time);
        return this;
    }
    DataProcess(callback: (gif: GraphicOutInfo, type: "new" | "move") => void
        , posiConvertor?: (posi: [number, number]) => [number, number]): ComponentsManager {
        let that = this, url = GetConfigManager().GetConfig("locationSocketURI");
        this.socket =
            this.Open(url, evt => {
                try {
                    let datas = JSON.parse(evt.data), now = new Date();
                    for (var i = 0; i < datas.length; i++) {
                        let data = datas[i]
                        if (data.X == 0 && data.Y == 0) continue;
                        let graphic = GetGraphicFactory().GetComponent(data.Type);
                        let profile: GraphicOutInfo, type: "new" | "move"
                        let ps: [number, number] = [data.X, data.Y];
                        ps = coordtransform.wgs84togcj02(ps[0], ps[1]) as [number, number]
                        ps = ol_proj.default.transform(ps, 'EPSG:4326', 'EPSG:3857')
                        if (posiConvertor)
                            ps = posiConvertor(ps);
                        let feature: ol.Feature
                        if (!that.Coms[data.UniqueId]) {
                            profile = {
                                type: data.Type, Graphic: graphic, Id: data.UniqueId, Location: { x: ps[0], y: ps[1] }
                                , Parent: null
                                , Title: data.Name
                                , ReveiveTime: now
                            }
                            feature = graphic.Buid(ps);
                            feature.setId(profile.Id);
                            this.VectorSource.addFeature(feature);
                            that.Coms[data.UniqueId] = profile;
                            type = "new";
                        } else {
                            profile = that.Coms[data.UniqueId];
                            that.ComponentMove(data.UniqueId, { x: ps[0], y: ps[1] }, data.Duration);
                            type = "move";
                        }
                        profile.Duration = data.Duration;
                        profile.ReveiveTime = now;
                        profile.Time = data.CollectTime;
                        profile.Location = { x: ps[0], y: ps[1] }
                        callback(profile, type);
                        if (type == 'new')
                            feature.setProperties({ name: profile.Title })
                    }
                } catch (error) {
                    LogHelper.Error(error)
                }

            })
        return this;
    }
    Open(url: string, onmessage: (evt: MessageEvent) => void) {
        let ws: WebSocket = new WebSocket(url);
        ws.onopen = () => {
            console.log("ws open");
            this.SetState(this.Events.WSOpened, ws);
            // if (postData)
            //     ws.send(JSON.stringify(postData));
        };
        ws.onmessage = (evt) => {//TODO needs remove garphic
            //console.log(evt.data);
            if (onmessage) onmessage(evt);

        };
        ws.onerror = (evt) => {
            console.log("onerror")
            console.log(evt["message"]);
        };
        ws.onclose = (evt) => {
            switch (evt.code) {
                case 1000:	// CLOSE_NORMAL
                    console.log("WebSocket: closed");
                    break;
                default:	// Abnormal closure
                    this.Reconnect(evt, url, onmessage);
                    break;
            }
        }; return ws;
    }
    SetShowItem(types: Array<[string, boolean]>) {
        types.forEach(t => {
            GetGraphicFactory().GetComponent(t[0]).Visable = t[1];
        })
        //TODo hide something
        return this;
    }
    Reconnect(e: CloseEvent, url: string, onmessage: (evt: MessageEvent) => void) {
        console.log(`WebSocketClient: retry in ${this.autoReconnectInterval}ms`, e.reason);
        setTimeout(() => {
            console.log("WebSocketClient: reconnecting...");
            this.socket = this.Open(url, onmessage);
        }, this.autoReconnectInterval);
    }
    SendMsg(postData: Object): ComponentsManager {
        let ws = this.socket;
        if (ws && ws.readyState == 1)
            ws.send(JSON.stringify(postData));
        else console.log("socket readyState is not 1, send fail");
        return this;
    }
    ProcessClose(onclose?: () => void): ComponentsManager {
        if (onclose) this.socket.onclose = onclose
        this.socket.close();
        return this;
    }
    EmptyComponents(): ComponentsManager {
        // for (let n in this.Coms) {
        //     let obj = this.Coms[n] as GraphicOutInfo
        //     if (obj.Title3D) GetScene().remove(obj.Title3D)
        //     GetScene().remove(obj.ThreeObject3D)
        //     delete this.Coms[n];
        // }
        return this;
    }
    private ShowTitleSingle(info: GraphicOutInfo): ComponentsManager {
        // let scene = GetScene(), render = GetWebGLRender()
        // if (info.Title) {
        //     if (!(info.Title3D)) {
        //         info.Title3D = TextSprites.makeTextSprite(info.Title,
        //             { fontsize: 18, borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
        //         scene.add(info.Title3D);
        //     }
        //     else {
        //         TextSprites.updateText(info.Title, info.Title3D.children[0] as THREE.Sprite, { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
        //     }
        //     info.Title3D.position.set(info.ThreeObject3D.position.x, info.Graphic.Height * info.ThreeObject3D.scale.y, info.ThreeObject3D.position.z);
        // }
        return this;
    }
    ShowTitle(): ComponentsManager {
        // let scene = GetScene(), render = GetWebGLRender()
        // for (let n in this.Coms) {
        //     let c = this.Coms[n] as GraphicOutInfo;
        //     if (c.Title) {
        //         if (!(c.Title3D)) {
        //             c.Title3D = TextSprites.makeTextSprite(c.Title,
        //                 { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
        //             scene.add(c.Title3D);
        //         }
        //         TextSprites.updateText(c.Title, c.Title3D.children[0] as THREE.Sprite, { fontsize: 18, fontface: "Georgia", borderColor: { r: 0, g: 0, b: 255, a: 1.0 } });
        //         c.Title3D.position.set(c.ThreeObject3D.position.x, c.Graphic.Height * c.ThreeObject3D.scale.y, c.ThreeObject3D.position.z);

        //         // var dir = new THREE.Vector3(c.ThreeObject3D.position.x, c.Graphic.Height * c.ThreeObject3D.scale.y, c.ThreeObject3D.position.z);
        //         // //normalize the direction vector (convert to vector of length 1)
        //         // // dir.normalize();
        //         // var origin = new THREE.Vector3(c.ThreeObject3D.position.x, 0, c.ThreeObject3D.position.z );
        //         // var length = 100;
        //         // var hex = 0xffff00;
        //         // var arrowHelper = new THREE.ArrowHelper( dir, origin, length, hex );
        //         // scene.add( arrowHelper );
        //     }
        // }
        return this;
    }
    HideTitle(): ComponentsManager {
        //for (let n in this.Coms) {
        //    let c = this.Coms[n] as GraphicOutInfo;
        //    if (c.TitleDoc) {
        //        c.TitleDoc.style.display = "none";
        //    }
        //}
        return this;
    }
    ShowProfile(event: MouseEvent): ComponentsManager {
        // console.log("dblclick")
        // let clientX = event.clientX, clientY = event.clientY;
        // // update the mouse variable
        // clientX = (event.clientX / window.innerWidth) * 2 - 1;
        // clientY = - (event.clientY / window.innerHeight) * 2 + 1;
        // let vector = new THREE.Vector3(clientX, clientY, 1).unproject(GetPCamera());
        // let ray = new THREE.Raycaster(GetPCamera().position, vector.sub(GetPCamera().position).normalize());
        // //ray.setFromCamera({ x: clientX, y: clientY }, GetPCamera());
        // ray.linePrecision = 8;
        // let cranes = Object.getOwnPropertyNames(this.Coms).filter(n => this.Coms[n] && this.Coms[n].type == "crane").map(n => {
        //     return (this.Coms[n] as GraphicOutInfo).ThreeObject3D;
        // })
        // let crane = ray.intersectObjects(cranes, true)[0];
        // if (crane) {
        //     if (!this.BoxHelper) {
        //         this.BoxHelper = new THREE.BoxHelper(crane.object); GetScene().add(this.BoxHelper);
        //     }
        //     else this.BoxHelper.update(crane.object)
        //     let ip = crane.object["remoteAddr"]
        //     window.open("http://" + ip + "/pds.php", 'newwindow', 'height=572, width=1016, top=0, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no,location=n o, status=no')
        // }
        return this;
    }
    public HighLight(com: GraphicOutInfo) {
        if (!com||this.HighlightedId) {
            delete this.HighlightedId
        }
        this.HighlightedId = com?com.Id:undefined;
    }
}
// export let GetComponentsManager: () => ComponentsManager = Singleton(ComponentsManager, true);