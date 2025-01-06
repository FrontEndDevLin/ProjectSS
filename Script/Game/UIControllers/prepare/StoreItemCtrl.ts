import { _decorator, Component, Label, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { StoreManager } from '../../CManager/StoreManager';
const { ccclass, property } = _decorator;

@ccclass('StoreItemCtrl')
export class StoreItemCtrl extends OO_Component {
    private _storeItem: any = null;
    private _storeIdx: number = 0;

    protected onLoad(): void {
        super.onLoad();
    }

    public initPanelItem(storeItem: any, storeIdx: number) {
        this._storeItem = storeItem;
        this._storeIdx = storeIdx;
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
                value: storeItem.r_panel.atk_spd + "s"
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

    private _buyItem() {
        this.views["Bottom/Assets"].off(Node.EventType.TOUCH_END, this._buyItem, this);
        StoreManager.instance.buyItem(this._storeIdx);
    }

    start() {
        const storeItem = this.node.OO_param1;
        const storeIdx = this.node.OO_param2;
        this._storeIdx = storeIdx;
        this.views["Bottom/Assets"].on(Node.EventType.TOUCH_END, this._buyItem, this);
    }

    protected onDestroy(): void {
        // 
    }

    update(deltaTime: number) {
        
    }
}


