import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { EventBus } from '../../../OO/Manager/OO_MsgManager';
import { CEVENT_PREPARE } from '../../CEvent';
import OO_UIManager from '../../../OO/Manager/OO_UIManager';
const { ccclass, property } = _decorator;

@ccclass('PrepareWeaponCtrl')
export class PrepareWeaponCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        this.updateWeaponView();

        EventBus.on(CEVENT_PREPARE.UPDATE_WEAPON, this.updateWeaponView, this)
    }

    // 更新界面的武器列表
    public updateWeaponView() {
        let weaponList: any[] = WeaponManager.instance.weaponList;

        this.views["WeaponList"].children.forEach((slotNode: Node, i) => {
            const wItem = weaponList[i];
            if (wItem) {
                let wpItemNode: Node = this.loadUINode("prepare/WpItem", "NONE");
                wpItemNode.on(Node.EventType.TOUCH_END, () => { this._touchFn(wItem, i) }, this);
                slotNode.removeAllChildren();
                slotNode.addChild(wpItemNode);
            } else {
                slotNode.removeAllChildren();
            }
        })
    }

    private _touchFn(wItem: any, i: number) {
        let PreviewNode: Node = WeaponManager.instance.loadUINode("GUI:PreviewWp");
        PreviewNode.OO_param1 = wItem;
        PreviewNode.OO_param2 = i;
        OO_UIManager.instance.appendUINode(PreviewNode);
    }

    update(deltaTime: number) {
        
    }
}


