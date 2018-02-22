import { VinciSearcher, Extend, IVinciSearcherOptions ,ObserverableWMediator} from "vincijs";
export interface ITopToolBarEvents{
    SearcherChange:"searcherChange"
}
export interface ITopToolBarOptions{
    SearcherOptions:IVinciSearcherOptions
}
export class TopToolBar extends ObserverableWMediator{
    public searcher:VinciSearcher
    public Events:ITopToolBarEvents=Extend({},this.Events)
    constructor(protected Element:HTMLDivElement,protected Options:ITopToolBarOptions){
        super();
        this.InitSearcher();
    }
    private InitSearcher(){
        var input=document.createElement("input");
        this.Element.appendChild(input);
        this.searcher=new VinciSearcher(input,this.Options.SearcherOptions);
        this.searcher.Bind(this.searcher.Events.Change,e=>{
            this.SetState(this.Events.SearcherChange,e.Value)
        });
        this.searcher.Wrapper.classList.add("mx-auto");
    }
}