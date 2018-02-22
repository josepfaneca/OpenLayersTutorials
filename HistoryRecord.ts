import { HistoryBusiness } from './Scripts/Business/HistoryBusiness';
import { MapBase, RequestMsgObject,WSType } from './MapBase';

export class HistoryRecord extends MapBase {
    protected InitComponent(autoReconnectInterval?: number, duration?: number,durTimes?:number) {
        this.TrackOfComponent=true;
        super.InitComponent(autoReconnectInterval,duration,2);
    }
    protected GetParameters(): RequestMsgObject {
        return  (this.Business as HistoryBusiness).GetMsgParameters();
    }
    protected InitBusiness(){
        this.Business=new HistoryBusiness(this.ComponentsManager,this.SceneManager);
        this.InitWSParameters= this.GetParameters();
    }
}

new HistoryRecord();