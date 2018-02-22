import { SceneManager } from './../Scene/SceneManager';
import { GraphicOutInfo } from './../Component/Graphic';
import { ComponentsManager } from './../Component/ComponentManager';
import { Ajax, VinciWindow, DataSource } from 'vincijs';
import { TopToolBar } from '../Layers/TopToolBar';
export interface AssetInfo {
    Uid: string
    Title: string
    Type: string
    Type_Id?: string
}

export class XBBusiness {
    protected InfoStory: Array<AssetInfo>
    protected ULElement: HTMLUListElement
    protected InfoContainer: HTMLDivElement
    private SearcherValue
    constructor(protected ComponentM: ComponentsManager, protected sceneM: SceneManager) {
        this.LayerDisplay();
    }
    protected LayerDisplay() {
        this.ShowStatues();
        this.ComponentFilter();
    }
    GetInfo(uid: string, type: string): AssetInfo {
        if (!this.InfoStory) {
            this.GetInfoRemote();
        }
        return this.InfoStory.filter(i => i.Type.toLowerCase() == type.toLowerCase() && i.Uid == uid)[0];
    }
    protected GetInfoRemote() {
        this.InfoStory = [];
        // this.InfoStory = JSON.parse('[{"Uid":"130123776","Type":"InCar","Title":"2#装载机(金景)"},{"Uid":"1455458304","Type":"InCar","Title":"1#装载机(金景)"},{"Uid":"1438681088","Type":"InCar","Title":"2#装载机(群首)"},{"Uid":"113346560","Type":"InCar","Title":"1#装载机(群首)"},{"Uid":"532776960","Type":"InCar","Title":"3#叉车"},{"Uid":"1505789952","Type":"InCar","Title":"15#装载机"},{"Uid":"1350732032","Type":"InCar","Title":"7#卸船机"},{"Uid":"1266845952","Type":"InCar","Title":"2#装船机"},{"Uid":"327321856","Type":"InCar","Title":"1#装船机"},{"Uid":"377587968","Type":"InCar","Title":"3#装船机"},{"Uid":"1585613056","Type":"InCar","Title":"4#装船机"},{"Uid":"193628416","Type":"InCar","Title":"5#卸船机"},{"Uid":"897747200","Type":"InCar","Title":"备用"},{"Uid":"998410496","Type":"InCar","Title":"1#叉车"},{"Uid":"1539344384","Type":"InCar","Title":"2#叉车"},{"Uid":"1589676032","Type":"InCar","Title":"13#装载机"},{"Uid":"180455424","Type":"InCar","Title":"9#装载机"},{"Uid":"750880768","Type":"InCar","Title":"14#装载机"},{"Uid":"767657984","Type":"InCar","Title":"7#装载机"},{"Uid":"884705280","Type":"InCar","Title":"8#装载机"},{"Uid":"1489012736","Type":"InCar","Title":"5#装载机"},{"Uid":"851150848","Type":"InCar","Title":"1#装载机"},{"Uid":"415336448","Type":"InCar","Title":"6#装载机"},{"Uid":"1103136768","Type":"InCar","Title":"11#装载机"},{"Uid":"784041984","Type":"InCar","Title":"10#装载机"},{"Uid":"1519422208","Type":"InCar","Title":"16#装载机"},{"Uid":"817989632","Type":"InCar","Title":"2#装载机"},{"Uid":"12683264","Type":"InCar","Title":"备用"},{"Uid":"163678208","Type":"InCar","Title":"3#装载机"},{"Uid":"63014912","Type":"InCar","Title":"4#装载机"},{"Uid":"352544071942263","Type":"GPSTag","Title":"2#"},{"Uid":"352544071942362","Type":"GPSTag","Title":"31#"},{"Uid":"352544071945738","Type":"GPSTag","Title":"22#"},{"Uid":"352544071945795","Type":"GPSTag","Title":"27#"},{"Uid":"352544071943097","Type":"GPSTag","Title":"3#"},{"Uid":"352544071943139","Type":"GPSTag","Title":"28#"},{"Uid":"352544071945662","Type":"GPSTag","Title":"7#"},{"Uid":"352544071942297","Type":"GPSTag","Title":"19#"},{"Uid":"352544071945787","Type":"GPSTag","Title":"23#"},{"Uid":"352544071945720","Type":"GPSTag","Title":"30#"},{"Uid":"352544071941554","Type":"GPSTag","Title":"32#"},{"Uid":"352544071942735","Type":"GPSTag","Title":"16#"},{"Uid":"352544071942487","Type":"GPSTag","Title":"20#"},{"Uid":"352544071942586","Type":"GPSTag","Title":"36#"},{"Uid":"352544071942776","Type":"GPSTag","Title":"15#"},{"Uid":"352544071941760","Type":"GPSTag","Title":"39#"},{"Uid":"352544071943105","Type":"GPSTag","Title":"33#"},{"Uid":"352544071942248","Type":"GPSTag","Title":"5#"},{"Uid":"352544071942271","Type":"GPSTag","Title":"34#"},{"Uid":"352544071941562","Type":"GPSTag","Title":"18#"},{"Uid":"352544071942420","Type":"GPSTag","Title":"17#"},{"Uid":"352544071943170","Type":"GPSTag","Title":"10#"},{"Uid":"352544071941729","Type":"GPSTag","Title":"38#"},{"Uid":"352544071943238","Type":"GPSTag","Title":"1#"},{"Uid":"869697536","Type":"InCar","Title":"10#自卸车"},{"Uid":"1272350720","Type":"InCar","Title":"2#自卸车"},{"Uid":"352544071941851","Type":"GPSTag","Title":"25#"},{"Uid":"1339459584","Type":"InCar","Title":"7#自卸车"},{"Uid":"352544071942883","Type":"GPSTag","Title":"40#"},{"Uid":"1171687424","Type":"InCar","Title":"2#斗轮机"},{"Uid":"1524008960","Type":"InCar","Title":"11#自卸车"},{"Uid":"701925376","Type":"InCar","Title":"3#斗轮机"},{"Uid":"352544071945704","Type":"GPSTag","Title":"12#"},{"Uid":"1289127936","Type":"InCar","Title":"6#斗轮机"},{"Uid":"1389791232","Type":"InCar","Title":"1#自卸车"},{"Uid":"534153216","Type":"InCar","Title":"6#卸船机"},{"Uid":"1590528000","Type":"InCar","Title":"4#卸船机"},{"Uid":"352544071941547","Type":"GPSTag","Title":"4#"},{"Uid":"1087801344","Type":"InCar","Title":"1#装车机"},{"Uid":"14125056","Type":"InCar","Title":"8#卸船机"},{"Uid":"1154910208","Type":"InCar","Title":"8#自卸车"},{"Uid":"352544071942115","Type":"GPSTag","Title":"8#"},{"Uid":"735479808","Type":"InCar","Title":"1#卸船机"},{"Uid":"1003915264","Type":"InCar","Title":"2#卸船机"},{"Uid":"1657636864","Type":"InCar","Title":"13#自卸车"},{"Uid":"352544071945696","Type":"GPSTag","Title":"13#"},{"Uid":"1557563392","Type":"InCar","Title":"1#斗轮机"},{"Uid":"1138132992","Type":"InCar","Title":"3#自卸车"},{"Uid":"352544071941695","Type":"GPSTag","Title":"14#"},{"Uid":"1406568448","Type":"InCar","Title":"4#斗轮机"},{"Uid":"1573750784","Type":"InCar","Title":"3#卸船机"},{"Uid":"1540196352","Type":"InCar","Title":"5#自卸车"},{"Uid":"352544071945639","Type":"GPSTag","Title":"9#"},{"Uid":"1640859648","Type":"InCar","Title":"2#挖机"},{"Uid":"903251968","Type":"InCar","Title":"1#挖机"},{"Uid":"352544071943030","Type":"GPSTag","Title":"37#"},{"Uid":"668370944","Type":"InCar","Title":"9#自卸车"},{"Uid":"352544071941844","Type":"GPSTag","Title":"26#"},{"Uid":"1238796288","Type":"InCar","Title":"7#斗轮机"},{"Uid":"801212416","Type":"InCar","Title":"12#装载机"},{"Uid":"547588096","Type":"InCar","Title":"6#自卸车"},{"Uid":"352544071942198","Type":"GPSTag","Title":"29#"},{"Uid":"1237354496","Type":"InCar","Title":"12#自卸车"},{"Uid":"352544071941646","Type":"GPSTag","Title":"11#"},{"Uid":"02021009","Type":"CellPhone","Title":"4#"},{"Uid":"02020285","Type":"CellPhone","Title":"3#"},{"Uid":"02020590","Type":"CellPhone","Title":"1#"},{"Uid":"352544071941513","Type":"GPSTag","Title":"6#"},{"Uid":"02020677","Type":"CellPhone","Title":"2#"},{"Uid":"02020520","Type":"CellPhone","Title":"6#"},{"Uid":"352544071945621","Type":"GPSTag","Title":"21#"},{"Uid":"02020716","Type":"CellPhone","Title":"5#"},{"Uid":"02020196","Type":"CellPhone","Title":"7#"},{"Uid":"352544071944046","Type":"GPSTag","Title":"24#"},{"Uid":"02020375","Type":"CellPhone","Title":"10#"},{"Uid":"02021045","Type":"CellPhone","Title":"11#"},{"Uid":"02020274","Type":"CellPhone","Title":"9#"},{"Uid":"02020524","Type":"CellPhone","Title":"8#"},{"Uid":"352544071942388","Type":"GPSTag","Title":"35#"},{"Uid":"02020649","Type":"CellPhone","Title":"12#"}]')
        // this.InfoStory.forEach(i => i.Type_Id = `${i.Type.toLowerCase()}_${i.Uid.toLowerCase()}`)
        new Ajax({ url: "/TM/Terminals", data: {}, async: false }).done(d => {
            if (d && d.IsSuccess) {
                this.InfoStory = d.Data;
                this.InfoStory.forEach(i => i.Type_Id = `${i.Type.toLowerCase()}_${i.Uid.toLowerCase()}`)
            }
        });
    }
    public ShowStatues() {
        let container = this.InfoContainer = document.createElement("div");
        container.classList.add("card", "border-primary", "zindex-fixed", "fixed-bottom", "float-right");
        container.style.width = "10rem";
        let ul = this.ULElement = document.createElement("ul");
        ul.classList.add("list-group", "list-group-flush", "text-primary");
        container.appendChild(ul);
        document.body.appendChild(container);
        this.Filter();
        this.Unconnecteds();
    }
    protected Unconnecteds() {
        let link = document.createElement("a");
        link.innerHTML = "unconnected items";
        link.classList.add("card-link");
        link.href = "javascript:void(0);";
        link.addEventListener("click", this.ShowDetails.bind(this));
        this.InfoContainer.appendChild(link);
    }
    protected Filter() {
        let div = document.createElement("div"),
            incarCheck = document.createElement('input'),
            tagCheck = document.createElement('input'),
            cellPhoneCheck = document.createElement('input'),
            incarCheckT = document.createElement("label"),
            tagCheckT = document.createElement("label"),
            cellPhoneCheckT = document.createElement("label")
        incarCheck.type = "checkbox";
        incarCheck.value = "InCar";
        incarCheck.checked = true;
        incarCheck.id = "cbIncar";
        incarCheckT.innerText = "InCar";
        incarCheckT.classList.add("form-check-label");
        incarCheckT.setAttribute("for","cbIncar")
        tagCheck.type = "checkbox";
        tagCheck.value = "GPSTag";
        tagCheck.checked = true;
        tagCheck.id = "cbTag";
        tagCheckT.innerText = "GPSTag";
        tagCheckT.classList.add("form-check-label");
        tagCheckT.setAttribute("for","cbTag")
        cellPhoneCheck.type = "checkbox";
        cellPhoneCheck.value = "Cellphone";
        cellPhoneCheck.id = "cbPhone";
        cellPhoneCheck.checked = true;
        cellPhoneCheckT.innerText = "CellPhone";
        cellPhoneCheckT.classList.add("form-check-label");
        cellPhoneCheckT.setAttribute("for","cbPhone")
        let incarCheckD = document.createElement("div");
        incarCheckD.appendChild(incarCheck)
        incarCheckD.appendChild(incarCheckT)
        let tagCheckD = document.createElement("div");
        tagCheckD.appendChild(tagCheck)
        tagCheckD.appendChild(tagCheckT)
        let cellPhoneCheckD = document.createElement("div");
        cellPhoneCheckD.appendChild(cellPhoneCheck)
        cellPhoneCheckD.appendChild(cellPhoneCheckT)
        div.appendChild(incarCheckD);
        div.appendChild(tagCheckD);
        div.appendChild(cellPhoneCheckD);
        this.InfoContainer.appendChild(div);
        let change = (e: Event) => {
            let boxs = div.querySelectorAll("input[type='checkbox']"),
                types: Array<[string, boolean]> = [];
            boxs.forEach((b) => {
                let box = b as HTMLInputElement;
                types.push([box.value.toLowerCase(), box.checked]);
            });
            this.ComponentM.SetShowItem(types);
        }
        incarCheck.addEventListener('change', change);
        tagCheck.addEventListener('change', change);
        cellPhoneCheck.addEventListener('change', change);
    }
    protected ComponentFilter() {
        let div = document.createElement("div");
        document.body.appendChild(div);
        div.classList.add("btn-toolbar", "mb-3", "zindex-fixed", "zindex-fixed", "fixed-top", "bg-dark");
        if (!this.InfoStory) {
            this.GetInfoRemote();
        }
        let topBar = new TopToolBar(div, {
            SearcherOptions: {
                TextField: "Title", ValueField: "Type_Id", DataSource: new DataSource({ Data: this.InfoStory })
                , Columns: [{ field: "Title" }]
            }
        });
        topBar.Bind(topBar.Events.SearcherChange, e => {
            this.SearcherValue = e.Value;
            let component = this.ComponentM.Find(o => `${o.type}_${o.Id}`.toLowerCase() == (e.Value as string))[0];
            if (component) {
                this.sceneM.Focus(this.ComponentM.GetPosition(component.Id));
                // this.sceneM.Render();
            }
            this.ComponentM.HighLight(component);
        });
    }
    public Update(type: string, gif: GraphicOutInfo) {
        let comM = this.ComponentM;
        let data = {}, ul = this.ULElement;
        ul.innerHTML = "";
        for (let n in comM.Coms) {
            let obj = comM.Coms[n] as GraphicOutInfo
            data[obj.type] = (data[obj.type] || 0) + 1;
        }
        for (let n in data) {
            let li = document.createElement("li");
            li.classList.add("list-group-item");
            li.innerHTML = `${n} : ${data[n]}`;
            ul.appendChild(li)
        }
    }
    public ShowDetails() {
        let coms = this.ComponentM.Coms;
        let div = document.createElement("div");
        let table = document.createElement("table");
        table.classList.add("table");
        let thead = document.createElement("thead");
        let tr = document.createElement("tr");
        tr.innerHTML = `<th scope='col'>type</th>
        <th scope='col'>name</th>
        <th scope='col'>uid</th>`;
        thead.appendChild(tr)
        table.appendChild(thead);
        let tbody = document.createElement("tbody");
        tbody.classList.add();
        table.appendChild(tbody);
        div.style.height = "400px";
        div.style.width = "450px";
        div.style.overflowY = "auto";
        div.appendChild(table);
        new VinciWindow(div, { AutoDestory: true }).Open();
        let unconnected = this.InfoStory.filter(i => !coms[i.Uid]);
        unconnected.forEach(i => {
            let tr = document.createElement("tr");
            tr.innerHTML = `<th scope='row'>${i.Type}</th>
          <td>${i.Title}</td>
          <td>${i.Uid}</td>`;
            tbody.appendChild(tr);
        })
    }
}