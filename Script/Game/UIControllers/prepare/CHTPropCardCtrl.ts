import { _decorator, Color, Component, EventTouch, Label, Node, Sprite, UITransform } from 'cc';
import { OO_Component } from '../../../OO/OO';
import OO_UIManager from '../../../OO/Manager/OO_UIManager';
import { BProp } from '../../Interface';
const { ccclass, property } = _decorator;

@ccclass('CHTPropCardCtrl')
export class CHTPropCardCtrl extends OO_Component {
    private _activeTab: number = 1;

    protected onLoad(): void {
        super.onLoad();

        // console.log(this.views)
        // TODO: 请求CharacterPropManager接口，获取主要属性和次要属性列表，渲染出来
        let arr = [
            { key: "level", label: "等级", value: 10 },
            { key: "hp", label: "生命值", value: 24 },
            { key: "spd", label: "速度", value: 5 }
        ];

        let arr2 = [
            { key: "exp_eff", label: "经验加成", value: 25 },
            { key: "pick_range", label: "拾取范围", value: 0 }
        ]

        for (let item of arr) {
            this._renderPropItem(this.views["Board/Board1"], item);
        }

        for (let item of arr2) {
            let node: Node = OO_UIManager.instance.loadUINode("common/CHTPropItem", "NONE");
            this.views["Board/Board2"].addChild(node);
        }

        for (let tabNode of this.views["Tabs"].children) {
            tabNode.on(Node.EventType.TOUCH_END, this._touchTab, this);
        }
    }

    start() {

    }

    private _renderPropItem(parentNode: Node, prop: BProp) {
        let node: Node = OO_UIManager.instance.loadUINode("common/CHTPropItem", "NONE");
        parentNode.addChild(node);
    }

    private _touchTab(e: EventTouch) {
        let targetTabNode: Node = e.target;
        let targetTabName: string = targetTabNode.name;
        let targetTabKey: number = Number(targetTabName.replace("Tab", ""));
        if (targetTabKey === this._activeTab) {
            return;
        }
        for (let tabNode of this.views["Tabs"].children) {
            let bgColor: Color = new Color(245, 245, 245, 0);
            let labColor: Color = new Color(245, 245, 245);
            let tabName: string = tabNode.name;
            let tabKey: string = tabName.replace("Tab", "");
            if (tabName === targetTabName) {
                bgColor = new Color(245, 245, 245);
                labColor = new Color(51, 51, 51);
                this.views[`Board/Board${tabKey}`].active = true;
            } else {
                this.views[`Board/Board${tabKey}`].active = false;
            }
            this.views[`Tabs/${tabName}/BG`].getComponent(Sprite).color = bgColor;
            this.views[`Tabs/${tabName}/Label`].getComponent(Label).color = labColor;
        }
        this._activeTab = targetTabKey;
    }

    update(deltaTime: number) {
        
    }
}


