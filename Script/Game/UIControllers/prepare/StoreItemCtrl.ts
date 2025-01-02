import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
const { ccclass, property } = _decorator;

@ccclass('StoreItemCtrl')
export class StoreItemCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    public initPanelItem(storeItem: any) {
        this.views["Top/WName/Name"].getComponent(Label).string = storeItem.name;
        let ary: any = [];
        if (storeItem.r_panel.dmg) {
            ary.push({
                label: "伤害",
                value: storeItem.r_panel.dmg
            });
        }
        if (storeItem.r_panel.atk_spd) {
            ary.push({
                label: "冷却",
                value: storeItem.r_panel.atk_spd + 's'
            });
        }
        if (storeItem.r_panel.range) {
            ary.push({
                label: "范围",
                value: storeItem.r_panel.range
            });
        }

        for (let item of ary) {
            let panelNode: Node = this.loadUINode("prepare/PanelItem", "NONE");
            panelNode.getChildByName("Label").getComponent(Label).string = `${item.label}: `;
            panelNode.getChildByName("Value").getComponent(Label).string = item.value;
            this.views["Wrap"].addChild(panelNode);
        }
    }

    start() {
    }

    update(deltaTime: number) {
        
    }
}


