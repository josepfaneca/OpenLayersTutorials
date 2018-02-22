// import { GraphicOutInfo } from './../Scene/Graphic';
// import { IComponentsManager } from './../Component/ComponentManager';
// import { Ajax, VinciWindow } from 'vincijs';
// import { SceneManager } from '../scene/SceneManager';
// import { VinciInput } from 'vincijs/scripts/UI/Editor/VinciInput';
// export interface AssetInfo {
//     Uid: string
//     Title: string
//     Type: string
// }
// export interface PointEntity{
//     Id:string
//     X:number
//     Y:number
//     Z:number
// }
// export interface AssetEntity{
//     Id:string
//     Name:string
// }
// export interface RoadEntity{
//     Id:string
//     BeginPoint:PointEntity
//     EndPoint:PointEntity
//     Asset:AssetEntity
// }

// export class RouteBusiness {
// private RoadsStroy:Array<RoadEntity>=[]
//     constructor(public Element:HTMLDivElement,private SceneManager:SceneManager,private ComponentsManager:IComponentsManager){
//         this.InitForm(Element)
//     }
//     private InitForm(Element:HTMLDivElement){
//         let element=document.createElement('input');
//         element.appendChild(element);
        
//     }
//     private GetEndPoint(entryRoad:RoadEntity){

//     }
//     private GenerateRoute(sPoint:THREE.Vector3,ePoint:THREE.Vector3,type:number,IdAsset?:string):Array<RoadEntity>{
//         //just invoke GetNearestRoad for sPoint

// return [];
//     }
//     private GetNearestRoad(point:THREE.Vector3,roads:Array<RoadEntity>){
//         this.RoadsStroy
//     }
//     private GetRoads(){
//         this.InfoStory = [];
//         new Ajax({ url: "/TM/Roads", data:{type:-1,IdAsset:'0000-0000-0000000...'}, async: false }).done(d => {
//             if (d && d.IsSuccess){
//                 //转成平面坐标
//                 this.RoadsStroy = d.Data;
//             }
//         });
//     }
//     private InfoStory: Array<AssetInfo>
//     private ULElement: HTMLUListElement
//     GetInfo(uid: string, type: string): AssetInfo {
//         if (!this.InfoStory) {
//             this.GetInfoRemote();
//         }
//         return this.InfoStory.filter(i => i.Type.toLowerCase() == type.toLowerCase() && i.Uid == uid)[0];
//     }
//     private GetInfoRemote() {
//         this.InfoStory = [];
//         new Ajax({ url: "/TM/Terminals", data: {}, async: false }).done(d => {
//             if (d && d.IsSuccess)
//                 this.InfoStory = d.Data;
//         });
//     }
//     public ShowStatues(comM: IComponentsManager) {
//         let container = document.createElement("div");
//         container.classList.add("card", "border-primary", "zindex-fixed", "fixed-bottom", "float-right");
//         container.style.width = "10rem";
//         let ul = this.ULElement = document.createElement("ul");
//         ul.classList.add("list-group", "list-group-flush", "text-primary");
//         container.appendChild(ul);
//         let link = document.createElement("a");
//         link.innerHTML = "unconnected items";
//         link.classList.add("card-link");
//         link.href = "javascript:void(0);";
//         link.addEventListener("click", this.ShowDetails.bind(this, comM.Coms));
//         container.appendChild(link);
//         document.body.appendChild(container);
//     }
//     public Update(comM: IComponentsManager) {
//         let data = {}, ul = this.ULElement;
//         ul.innerHTML = "";
//         for (let n in comM.Coms) {
//             let obj = comM.Coms[n] as GraphicOutInfo
//             data[obj.type] = (data[obj.type] || 0) + 1;
//         }
//         for (let n in data) {
//             let li = document.createElement("li");
//             li.classList.add("list-group-item");
//             li.innerHTML = `${n} : ${data[n]}`;
//             ul.appendChild(li)
//         }
//     }
//     public ShowDetails(coms: {}) {
//         let div = document.createElement("div");
//         let table = document.createElement("table");
//         table.classList.add("table");
//         let thead = document.createElement("thead");
//         let tr = document.createElement("tr");
//         tr.innerHTML = `<th scope='col'>type</th>
//         <th scope='col'>name</th>
//         <th scope='col'>uid</th>`;
//         thead.appendChild(tr)
//         table.appendChild(thead);
//         let tbody = document.createElement("tbody");
//         tbody.classList.add();
//         table.appendChild(tbody);
//         div.style.height = "400px";
//         div.style.width = "450px";
//         div.style.overflowY = "auto";
//         div.appendChild(table);
//         new VinciWindow(div, { AutoDestory: true }).Open();
//         let unconnected = this.InfoStory.filter(i => !coms[i.Uid]);
//         unconnected.forEach(i => {
//             let tr = document.createElement("tr");
//             tr.innerHTML = `<th scope='row'>${i.Type}</th>
//           <td>${i.Title}</td>
//           <td>${i.Uid}</td>`;
//             tbody.appendChild(tr);
//         })
//     }
// }