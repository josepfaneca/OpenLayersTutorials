import ol_layer_Tile =require( 'ol/layer/tile');
import ol_source_xyz=require('ol/source/XYZ')
export default new ol_layer_Tile.default({  
    source: new ol_source_xyz.default({  
        minZoom:3,
        maxZoom:18,
        url: 'https://webst0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=6&x={x}&y={y}&z={z}'
        //url: 'http://wprd0{1-4}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&style=7&x={x}&y={y}&z={z}'  
    })  
}); 

// case "road":
// url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
// break;
// case "st":
// url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=6&x=' + col + '&y=' + row + '&z=' + level;
// break;
// case "label":
// url = 'http://webst0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?style=8&x=' + col + '&y=' + row + '&z=' + level;
// break;
// default:
// url = 'http://webrd0' + (col % 4 + 1) + '.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x=' + col + '&y=' + row + '&z=' + level;
// break;