import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import OO_UIManager from '../../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

@ccclass('CHTPropCardCtrl')
export class CHTPropCardCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();

        // console.log(this.views)
        // TODO: 请求CharacterPropManager接口，获取主要属性和次要属性列表，渲染出来
        let arr = [
            { key: "level", label: "等级", value: 10 },
            { key: "hp", label: "生命值", value: 24 },
            { key: "spd", label: "速度", value: 5 }
        ];

        for (let item of arr) {
            let node: Node = OO_UIManager.instance.loadUINode("common/CHTPropItem", "NONE");
            this.views["Board/Board1"].addChild(node);
        }
    }

    start() {

    }

    update(deltaTime: number) {
        
    }
}


