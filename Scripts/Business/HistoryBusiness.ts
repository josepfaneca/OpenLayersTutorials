import { WSType } from './../../MapBase';
import { SceneManager } from './../Scene/SceneManager';
import { XBBusiness, AssetInfo } from './XBBusiness';
import { GraphicOutInfo } from './../Component/Graphic';
import { ComponentsManager } from './../Component/ComponentManager';

export class HistoryBusiness extends XBBusiness {
    private QueryObj: { stime: Date, etime: Date, UIds: Array<string> }
    private CurrentTime: Date = new Date();
    constructor(ComponentM: ComponentsManager, sceneM: SceneManager) {
        super(ComponentM, sceneM);
    }
    public GetMsgParameters() {
        return { Type: WSType.History, UIds: [this.GetQueryString("uid")], STime: this.GetQueryString("stime"), ETime: this.GetQueryString("etime") }
    }
    private GetQueryString(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]); return null;
    }
    protected Getarameters() {
        this.QueryObj = { stime: new Date(this.GetQueryString("stime")), etime: new Date(this.GetQueryString("etime")), UIds: [this.GetQueryString("uid")] };
    }
    public ShowStatues() {
        let container = this.InfoContainer = document.createElement("div");
        container.classList.add("card", "border-primary", "zindex-fixed", "fixed-bottom", "float-right");
        container.style.width = "10rem";
        let ul = this.ULElement = document.createElement("ul");
        ul.classList.add("list-group", "list-group-flush", "text-primary");
        container.appendChild(ul);
        document.body.appendChild(container);
        this.ComponentM.Bind(this.ComponentM.Events.TweenStart, e => {
            let g = e.Value as { x: number, y: number, dur: number, time: string }
            let data = {}, ul = this.ULElement;
            ul.innerHTML = "";
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = `${new Date(g.time).toLocaleTimeString()}`;
            ul.appendChild(li);
        })
        // this.ComponentM.TempFn = (gif: GraphicOutInfo, time: string) => {
        //     let data = {}, ul = this.ULElement;
        //     ul.innerHTML = "";
        //     let li = document.createElement("li");
        //     li.classList.add("list-group-item");
        //     li.innerHTML = `${time}`;
        //     ul.appendChild(li);
        // };
    }
    public Update(type: string, gif: GraphicOutInfo) {
        if (!gif.AllPs) gif.AllPs = [];
        gif.AllPs.push({ x: gif.Location.x, y: gif.Location.y, dur: gif.Duration, time: gif.Time as string })
        // let data = {}, ul = this.ULElement;
        // ul.innerHTML = "";
        //     let li = document.createElement("li");
        //     li.classList.add("list-group-item");
        //     li.innerHTML = `${gif.Time}`;
        //     ul.appendChild(li);
    }
    private TimeBar() {
        if (!this.QueryObj) this.Getarameters();
        let container = document.createElement("div"),
            range = document.createElement("input"),
            timer = document.createElement("label")
        container.classList.add("fixed-bottom", "float-right", "bg-light");
        container.style.left = "auto";
        timer.style.display = "block";
        range.type = "range";
        range.value="0"
        range.style.width = "700px";
        range.min = "0";
        range.max = `${60 * this.QueryObj.etime.getHours() + this.QueryObj.etime.getMinutes() - 60 * this.QueryObj.stime.getHours() - this.QueryObj.stime.getMinutes()}`;
        range.step = "2";
        let btnGroup=document.createElement("div"),
        stopBtn=document.createElement("button"),
        resumeBtn=document.createElement("button")
        stopBtn.classList.add("btn")
        stopBtn.innerHTML="<i class='fa  fa-stop-circle'></i>";
        stopBtn.addEventListener("click",this.ComponentM.Stop);
        resumeBtn.classList.add("btn")
        resumeBtn.innerHTML="<i class='fa fa-play-circle'></i>";
        resumeBtn.addEventListener("click",this.ComponentM.Resume);
        //container.appendChild(btnGroup)
        btnGroup.classList.add("btn-group");
        btnGroup.appendChild(stopBtn);
        btnGroup.appendChild(resumeBtn);
        timer.innerText = `${this.QueryObj.stime.getHours()} : ${this.QueryObj.stime.getMinutes()}`;
        range.addEventListener("input", e => {
            let i = e.target as HTMLInputElement
            let tms = this.QueryObj.stime.getMinutes() + parseInt(i.value);
            let m = Math.floor(tms % 60), h = Math.floor(tms / 60);
            timer.innerText = `${this.QueryObj.stime.getHours() + h} : ${m}`;
        });
        range.addEventListener("change", this.TimeBarChange.bind(this))
        container.appendChild(timer);
        container.appendChild(range);
        document.body.appendChild(container)
    }
    private TimeBarChange(e: Event) {
        let i = e.target as HTMLInputElement
        let date = new Date(this.QueryObj.stime.getFullYear(),this.QueryObj.stime.getMonth(),this.QueryObj.stime.getDate(),this.QueryObj.stime.getHours());
        date.setMinutes(this.QueryObj.stime.getMinutes() + parseInt(i.value));
        this.ComponentM.JumpTo(date);
    }
    protected LayerDisplay() {
        this.ShowStatues();
        this.TimeBar();
    }
}