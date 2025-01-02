import { _decorator, Component, Node } from 'cc';
import { OO_Component } from '../../../OO/OO';
import WeaponManager from '../../CManager/WeaponManager';
const { ccclass, property } = _decorator;

@ccclass('PrepareWeaponCtrl')
export class PrepareWeaponCtrl extends OO_Component {
    protected onLoad(): void {
        super.onLoad();
    }

    start() {
        this.updateWeaponView();
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


