
import Style = require('ol/style/Style')
import Circle = require('ol/style/Circle')
import Fill = require('ol/style/Fill')
import Stroke = require('ol/style/Stroke')
import Text = require('ol/style/Text')
export abstract class BaseMaterial {
    public static GetPointMaterial(color: string = 'black', title?: string) {
        let res = new Style.default({
            image: new Circle.default({
                radius: 8,
                snapToPixel: false,
                fill: new Fill.default({ color: color }),
                stroke: new Stroke.default({
                    color: 'white', width: 2
                })
            }), text: new Text.default({
                fill: new Fill.default({ color: color }),
                stroke: new Stroke.default({ color: "white", width: 2 }),
                font:"Normal 12px Arial"
            })
        });
        if (title) res.getText().setText(title);
        return res;
    }
}