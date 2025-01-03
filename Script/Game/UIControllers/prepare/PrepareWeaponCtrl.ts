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

    public updateWeaponView() {
        let weaponList: any[] = WeaponManager.instance.weaponList;
        for (let wItem of weaponList) {
            let slotNode: Node = this.loadUINode("prepare/WpSlotItem", "NONE");
            this.views["WeaponList"].addChild(slotNode);
        }
    }

    update(deltaTime: number) {
        
    }
}


