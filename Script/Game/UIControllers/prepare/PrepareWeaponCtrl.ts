import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
import { EventBus } from '../../../OO/Manager/OO_MsgManager';
import { CEVENT_PREPARE } from '../../CEvent';
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
                let wpIconNode: Node = this.loadUINode("prepare/WpItem", "NONE");
                slotNode.removeAllChildren();
                slotNode.addChild(wpIconNode);
            } else {
                slotNode.removeAllChildren();
            }
        })
    }

    update(deltaTime: number) {
        
    }
}


