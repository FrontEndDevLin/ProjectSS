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

    private _buyItem() {
        this.views["Bottom/Assets"].off(Node.EventType.TOUCH_END, this._buyItem, this);
        StoreManager.instance.buyItem(this._storeIdx);
    }

    start() {
        const storeItem = this.node.OO_param1;
        const storeIdx = this.node.OO_param2;
        this._storeIdx = storeIdx;
        this.views["Bottom/Assets"].on(Node.EventType.TOUCH_END, this._buyItem, this);

        this.views["Top/WName/Name"].getComponent(Label).string = storeItem.name;

        let wpPanelNode: Node = WeaponManager.instance.getWeaponPanelNode(storeItem.id);
        this.node.addChild(wpPanelNode);
    }

    protected onDestroy(): void {
        // 
    }

    update(deltaTime: number) {
        
    }
}


