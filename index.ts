import { MapBase, RequestMsgObject, WSType } from './MapBase';
export class Index extends MapBase{
    constructor() {
        super();
    }
    protected InitComponent() {
        this.InitWSParameters= this.GetParameters();
        super.InitComponent();
    }
    protected GetParameters(): RequestMsgObject {
        //TODO get url parameters to return
        return {Type:WSType.Location};
    }
}

new Index();