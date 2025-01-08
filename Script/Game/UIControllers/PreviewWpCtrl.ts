import { _decorator, Component, EventTouch, Label, Node } from 'cc';
import { OO_Component } from '../../OO/OO';
import WeaponManager from '../CManager/WeaponManager';
const { ccclass, property } = _decorator;

@ccclass('PreviewWpCtrl')
export class PreviewWpCtrl extends OO_Component {
    private _storeIdx: number;

    start() {
        this.views["Mask"].once(Node.EventType.TOUCH_END, () => {
            this.node.destroy();
        });

        this.views["Card"].on(Node.EventType.TOUCH_END, (e: EventTouch) => {
            e.propagationStopped = true;
        });

        const storeItem = this.node.OO_param1;
        const storeIdx = this.node.OO_param2;
        this._storeIdx = storeIdx;

        this.views["Card/ImgTxt/WName/Name"].getComponent(Label).string = storeItem.name;

        let wpPanelNode: Node = WeaponManager.instance.getWeaponPanelNode(storeItem.id);
        this.views["Card"].addChild(wpPanelNode);
    }

    update(deltaTime: number) {
        
    }
}


